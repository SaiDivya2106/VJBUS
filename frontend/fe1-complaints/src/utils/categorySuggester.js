// src/utils/categorySuggester.js

/* ===============================
   1️⃣ STRONG KEYWORDS (DIRECT HIT)
   =============================== */

const STRONG_KEYWORDS = {
  Sports: [
    "football", "cricket", "badminton", "volleyball",
    "basketball", "sports", "match", "practice",
    "tournament", "ground", "court"
  ],

  Examination: [
    "exam", "exams", "question paper", "question papers",
    "hall ticket", "invigilator", "invigilation",
    "valuation", "evaluation", "marks", "results",
    "semester", "mid exam", "internal"
  ],

  "IT and Networking": [
    "wifi", "wi-fi", "internet", "network",
    "lan", "ethernet", "server",
    "login issue", "login problem", "unable to login",
    "slow internet", "no internet", "website not opening",
    "page not loading", "portal down",
    "password issue", "reset password",
    "network issue", "disconnected", "connection lost"
  ],

  Library: [
    "library", "book issue", "book return", "lib",
    "fine", "reading hall", "reference books",
    "book not available", "no books", "issue book"
  ],

  Transport: [
    "bus", "college bus", "transport",
    "route", "driver", "bus timing",
    "late bus", "bus late", "bus delay",
    "missed bus", "bus crowded", "route change"
  ],

  Security: [
    "security", "guard", "watchman",
    "theft", "entry issue", "gate problem"
  ],
  "Fee Payments and Accounts": [
  "fee", "fees", "tuition fee", "college fee", "accounts section",
  "payment", "online payment", "fee payment",
  "receipt", "fee receipt", "transaction",
  "transaction failed", "payment failed",
  "refund", "extra charge", "fine amount",
  "account section", "accounts office",
  "billing", "invoice"
],

};

/* ===============================
   2️⃣ CONTEXT RULES (SMART LOGIC)
   =============================== */

const CONTEXT_RULES = (text) => {

  // Hostel food override canteen
  if (
    text.includes("hostel") &&
    (text.includes("food") || text.includes("mess"))
  ) {
    return "Hostel Food";
  }

  // Sports ground override infrastructure
  if (
    text.includes("ground") &&
    (text.includes("football") ||
     text.includes("cricket") ||
     text.includes("sports"))
  ) {
    return "Sports";
  }

  // Boys & Girls Hostel direct match
  if (text.includes("boys hostel")) return "Boys Hostel";
  if (text.includes("girls hostel")) return "Girls Hostel";
  // Fee & Accounts override
if (
  text.includes("fee") ||
  text.includes("payment failed") ||
  text.includes("transaction failed") ||
  text.includes("refund") ||
  text.includes("accounts office")
) {
  return "Fee Payments and Accounts";
}


  // Audio-Visual override
  if (
    text.includes("projector") ||
    text.includes("mic") ||
    text.includes("microphone") ||
    text.includes("speaker") ||
    text.includes("smart board") ||
    text.includes("no sound") ||
    text.includes("no display") ||
    text.includes("hdmi")
  ) {
    return "Audio-Visual Equipment";
  }

  return null;
};

/* ===============================
   3️⃣ NORMAL KEYWORDS (SCORING)
   =============================== */

const CATEGORY_KEYWORDS = {
  Infrastructure: [
    "fan", "fan not working",
    "light", "light not working",
    "switch", "switch broken",
    "plug", "power issue", "power cut",
    "water leakage", "leak", "pipe",
    "electricity", "classroom", "lab",
    "building", "ceiling", "door", "window",
    "bench", "broken bench", "damaged bench"
  ],

  Canteen: [
    "canteen", "food", "meal",
    "breakfast", "lunch", "dinner",
    "snacks", "hygiene", "quality",
    "price", "canteen food",
    "food quality", "unhygienic",
    "stale food", "overpriced"
  ],

  "Hostel Food": [
    "mess", "food", "rice", "dal",
    "chapati", "curry", "oil",
    "quality", "taste", "smell",
    "stale", "spoiled", "hostel",
    "unhygienic kitchen"
  ],

  "Boys Hostel": [
    "boys hostel", "hostel room",
    "warden", "room issue",
    "doors", "bathroom",
    "water problem", "net", "wifi"
  ],

  "Girls Hostel": [
    "girls hostel", "hostel room",
    "warden", "room issue",
    "bathroom", "water problem",
    "net", "wifi"
  ],

  Housekeeping: [
    "cleaning", "dirty", "dust",
    "garbage", "toilet", "washroom",
    "cleanliness", "sweeping",
    "toilet dirty", "washroom dirty",
    "garbage not cleared", "bad smell",
    "unclean", "mosquito"
  ],
"Audio-Visual Equipment": [
  // Equipment
  "projector", "projector not working",
  "screen", "screen blank", "no display",
  "smart board", "smartboard", "touch not working",
  "mic", "microphone", "mic not working",
  "speaker", "speaker not working", "no sound",
  "audio issue", "ppt not visible",
  "hdmi", "hdmi not connecting",
  "cable issue", "av system", "sound system",

  // Location-based (important for your case)
  "auditorium", "seminar hall",
  "presentation hall", "conference hall",
  "function hall", "stage sound",
  "hall projector", "hall mic"
],

  Parking: [
    "parking", "vehicle",
    "bike parking", "car parking",
    "parking space"
  ],

  "Extracurricular and Events": [
    "event", "fest", "cultural",
    "club", "workshop", "seminar",
    "hackathon", "competition"
  ],
  "Fee Payments and Accounts": [
  "fee", "fees", "tuition", "payment",
  "online payment", "upi", "net banking",
  "transaction", "transaction failed",
  "payment failed", "receipt", "refund",
  "extra charge", "overcharged", "fine",
  "due amount", "pending fee",
  "account section", "accounts office",
  "billing", "invoice", "cash counter"
],

};

/* ===============================
   4️⃣ FINAL SUGGEST FUNCTION
   =============================== */

export const suggestCategory = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  // 1️⃣ Context override
  const contextMatch = CONTEXT_RULES(text);
  if (contextMatch) return [contextMatch];

  // 2️⃣ Strong keyword match
  for (const category in STRONG_KEYWORDS) {
    if (STRONG_KEYWORDS[category].some(word => text.includes(word))) {
      return [category];
    }
  }

  // 3️⃣ Normal keyword scoring
  const scores = {};

  for (const category in CATEGORY_KEYWORDS) {
    scores[category] = 0;
    CATEGORY_KEYWORDS[category].forEach(word => {
      if (text.includes(word)) {
        scores[category]++;
      }
    });
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  // No match → Others
  if (sorted[0][1] === 0) return ["Others"];

  // Close score → show 2 suggestions
  if (sorted.length > 1 && sorted[0][1] - sorted[1][1] <= 1) {
    return [sorted[0][0], sorted[1][0]];
  }

  return [sorted[0][0]];
};
