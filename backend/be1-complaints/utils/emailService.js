const nodemailer = require("nodemailer");
const isExperimental = require("./isExperimental");
const demoEmail = require("../demo/demoEmail");

const createTransporter = () => {
    if (isExperimental) {
        return demoEmail.createTransport();
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASS,
        },
    });
};

const sendEmail = async (mailOptions) => {
    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail(mailOptions);
        if (!isExperimental) {
            console.log("✅ Email sent:", info.response);
        }
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        // don't throw in demo mode to avoid breaking UI flow if something is slight off
        if (isExperimental) return { response: "Simulated Error (Logged)" };
        throw error;
    }
};

module.exports = { sendEmail };
