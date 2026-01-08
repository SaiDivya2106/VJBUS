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
    "lan", "server", "login issue", "slow internet",
    "no internet", "website not opening","ethernet",
  ],

  Library: [
    "library", "book issue", "book return","lib",
    "fine", "reading hall", "reference books"
  ],

  Transport: [
    "bus", "college bus", "transport",
    "route", "driver", "bus timing", "late bus"
  ],

  Security: [
    "security", "guard", "watchman",
    "theft", "entry issue", "gate problem"
  ],
};

/* ===============================
   2️⃣ CONTEXT RULES (SMART LOGIC)
   =============================== */

const CONTEXT_RULES = (text) => {

  // Hostel food must override canteen
  if (
    text.includes("hostel") &&
    (text.includes("food") || text.includes("mess"))
  ) {
    return "Hostel Food";
  }

  // Sports ground override infrastructure
  if (
    text.includes("ground") &&
    (
      text.includes("football") ||
      text.includes("cricket") ||
      text.includes("sports")
    )
  ) {
    return "Sports";
  }

  // Hostel stay issues
  if (text.includes("boys hostel")) return "Boys Hostel";
  if (text.includes("girls hostel")) return "Girls Hostel";

  return null;
};

/* ===============================
   3️⃣ NORMAL KEYWORDS (SCORING)
   =============================== */

const CATEGORY_KEYWORDS = {
  Infrastructure: [
    "fan", "light", "switch", "plug",
    "water leakage", "leak", "pipe",
    "electricity", "power cut",
    "classroom", "lab", "building",
    "ceiling", "door", "window","benches"
  ],

  Canteen: [
    "canteen", "food", "meal",
    "breakfast", "lunch", "dinner",
    "snacks", "hygiene", "quality",
    "price", "canteen food"
  ],

  "Hostel Food": [
    "mess", "food", "rice", "dal",
    "chapati", "curry", "oil",
    "quality", "taste", "smell",
    "stale", "spoiled","hostel","Unhygienic kitchen"
  ],

  "Boys Hostel": [
    "boys hostel", "hostel room",
    "warden", "room issue","doors",
    "bathroom", "water problem","hostel","net"
  ],

  "Girls Hostel": [
    "girls hostel", "warden",
    "room issue", "bathroom","hostel","net"
  ],

  Housekeeping: [
    "cleaning", "dirty", "dust",
    "garbage", "toilet", "washroom",
    "cleanliness", "sweeping"
  ],

  "Audio-Visual Equipment": [
    "projector", "mic", "microphone",
    "speaker", "audio", "video",
    "smart board", "screen", "ppt"
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
};

/* ===============================
   4️⃣ FINAL SUGGEST FUNCTION
   =============================== */

export const suggestCategory = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  // 1️⃣ Context override (highest priority)
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
