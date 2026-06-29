const cron = require("node-cron");
const nodemailer = require("nodemailer");

module.exports = function (complaintsCollectionObj, adminsCollectionObj) {
  console.log("⏰ Reminder Cron (PRODUCTION MODE) started!");

  // Run every day at 9:00 AM (server time)
// cron.schedule("* * * * *", async () => {
  cron.schedule("*/10 * * * *", async () => {


    console.log("⏳ Running daily complaint reminder cron at:", new Date());

    try {
      const now = new Date();
      const oneDay = 24*60*60 * 1000;
      const twoDays = 2 * oneDay;

      const oneDayAgo = new Date(now.getTime() - oneDay);
      const twoDaysAgo = new Date(now.getTime() - twoDays);

      // 1️⃣ Complaints Pending for ≥ 1 day (and reminder not already sent)
      const pendingComplaints = await complaintsCollectionObj
        .find({
          status: "Pending",
          timestamp: { $lte: oneDayAgo },
          pendingReminderSent: { $ne: true },
        })
        .toArray();

      // 2️⃣ Complaints Ongoing for ≥ 2 days & no comments (and reminder not already sent)
      const ongoingComplaints = await complaintsCollectionObj
        .find({
          status: "Ongoing",
          timestamp: { $lte: twoDaysAgo },
          $or: [
            { comments: { $exists: false } },
            { comments: { $size: 0 } },
          ],
          ongoingReminderSent: { $ne: true },
        })
        .toArray();

      console.log(
        `Found ${pendingComplaints.length} pending and ${ongoingComplaints.length} ongoing complaints needing reminders`
      );

      if (pendingComplaints.length === 0 && ongoingComplaints.length === 0) {
        console.log("⏳ No complaints eligible for reminders today.");
        return;
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_PASS,
        },
      });

      // --------------------------
      // SEND REMINDERS FOR PENDING
      // --------------------------
      for (let comp of pendingComplaints) {
        const adminList = await adminsCollectionObj
          .find({ category: comp.category })
          .toArray();

        const adminEmails = adminList.map((a) => a.email);

        // Skip if no admins configured for this category
        if (!adminEmails.length) {
          console.log(
            `⚠️ No admins found for category: ${comp.category}. Skipping pending reminder for complaint ${comp.complaint_id}.`
          );
          continue;
        }

        const mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: adminEmails,
          subject: `⏰ Reminder: Complaint "${comp.title}" Pending for 1+ Day`,
          html: `
            <p>Dear Admin,</p>
            <p>The following complaint has been <b>Pending for more than 1 day</b>:</p>
            <ul>
              <li><b>Title:</b> ${comp.title}</li>
              <li><b>Category:</b> ${comp.category}</li>
              <li><b>Complaint ID:</b> ${comp.complaint_id}</li>
              <li><b>Submitted on:</b> ${new Date(comp.timestamp).toLocaleString(
                "en-IN",
                { timeZone: "Asia/Kolkata" }
              )}</li>
            </ul>
            <p>Please review and take necessary action.</p>
            <p>- Complaint Management System</p>
          `,
        };

        await transporter.sendMail(mailOptions);

        // Mark that reminder for this condition was sent
        await complaintsCollectionObj.updateOne(
          { complaint_id: comp.complaint_id },
          { $set: { pendingReminderSent: true } }
        );

        console.log("📨 Sent Pending Reminder →", comp.complaint_id, comp.title);
      }

      // --------------------------
      // SEND REMINDERS FOR ONGOING
      // --------------------------
      for (let comp of ongoingComplaints) {
        const adminList = await adminsCollectionObj
          .find({ category: comp.category })
          .toArray();

        const adminEmails = adminList.map((a) => a.email);

        if (!adminEmails.length) {
          console.log(
            `⚠️ No admins found for category: ${comp.category}. Skipping ongoing reminder for complaint ${comp.complaint_id}.`
          );
          continue;
        }

        const mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: adminEmails,
          subject: `⏰ Reminder: Complaint "${comp.title}" Ongoing 2+ Days with No Comments`,
          html: `
            <p>Dear Admin,</p>
            <p>The following complaint has been in <b>Ongoing</b> status for more than <b>2 days</b> without any admin comments:</p>
            <ul>
              <li><b>Title:</b> ${comp.title}</li>
              <li><b>Category:</b> ${comp.category}</li>
              <li><b>Complaint ID:</b> ${comp.complaint_id}</li>
              <li><b>Submitted on:</b> ${new Date(comp.timestamp).toLocaleString(
                "en-IN",
                { timeZone: "Asia/Kolkata" }
              )}</li>
            </ul>
            <p>Please update the complaint status or add a comment.</p>
            <p>- Complaint Management System</p>
          `,
        };

        await transporter.sendMail(mailOptions);

        await complaintsCollectionObj.updateOne(
          { complaint_id: comp.complaint_id },
          { $set: { ongoingReminderSent: true } }
        );

        console.log("📨 Sent Ongoing Reminder →", comp.complaint_id, comp.title);
      }

      console.log("🎉 Daily reminder cron completed.");
    } catch (err) {
      console.error("❌ Cron Error:", err);
    }
  });
};
