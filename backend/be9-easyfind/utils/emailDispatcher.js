const LostItem = require("../models/LostItem");
const Item = require("../models/FoundItem");
const sendEmail = require("./notifications");
const stringSimilarity = require("string-similarity");

/**
 * Dispatches background email jobs
 * @param {string} type - Type of job, e.g. 'matchLostItem'
 * @param {Object} payload - Depends on job type
 */
function dispatchEmailJob(type, payload) {
  setImmediate(async () => {
    try {
      switch (type) {
        case "matchLostItem":
          await matchAndNotify(payload.itemId); // Only needs itemId now
          break;

        case "customEmail":
          await sendEmail(payload.to, payload.subject, payload.body);
          break;

        // Add more job types as needed
        default:
          console.warn("Unknown email job type:", type);
      }
    } catch (err) {
      console.error("Email job failed:", err);
    }
  });
}

/**
 * Matches verified item with lost items and sends emails if similarity > threshold
 * @param {string} itemId - ID of the verified found item
 */
async function matchAndNotify(itemId) {
  const item = await Item.findById(itemId);
  if (!item) {
    return console.warn("Item not found for email match:", itemId);
  }

  if (!item.description) {
    return console.warn("Item has no description to compare:", itemId);
  }

  const lostItems = await LostItem.find({});
  let notified = false;

  for (const lostItem of lostItems) {
    const checker = [
      lostItem.itemName,
      lostItem.category,
      lostItem.location,
      lostItem.dateLost,
      lostItem.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const similarity = stringSimilarity.compareTwoStrings(
      item.description.toLowerCase(),
      checker
    );

    if (similarity > 0.1) {
      await sendEmail(
        lostItem.email,
        "Update: Lost Item Match Found!",
        `Dear user,

We believe we’ve found a possible match for your lost item: "${lostItem.itemName}".

Please log in to your account for more details and to verify the match.

Regards,  
EasyFind Team`
      );
      console.log("✅ Email sent to:", lostItem.email);
      notified = true;
    }
  }

  if (!notified) {
    console.log("❌ No matching lost items found for item:", itemId);
  }
}

module.exports = dispatchEmailJob;
