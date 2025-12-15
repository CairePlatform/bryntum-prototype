// Script to apply new visual system to homecare-complete.json
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../public/data/homecare-complete.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Map visit names to eventTypes
const typeMapping = {
  Insulin: "medical",
  Medicin: "medical",
  Provtagning: "medical",
  Sårbyte: "medical",
  "Palliativ vård": "medical",
  Lunch: "meal",
  Måltid: "meal",
  Matlagning: "meal",
  Kvällsmat: "meal",
  Frukost: "meal",
  Träning: "rehab",
  Promenad: "rehab",
  Sällskap: "social",
  Städning: "practical",
  Rengöring: "practical",
  Inköp: "practical",
};

// Determine eventType from visit name
function getEventType(name) {
  for (const [keyword, type] of Object.entries(typeMapping)) {
    if (name.includes(keyword)) {
      return type;
    }
  }
  return "standard"; // Default
}

// Determine recurrence based on visit characteristics
function getRecurrence(name, mandatory, movable) {
  // Daily recurring = breakfast, toilet, morning care (can't move to another day)
  const dailyKeywords = [
    "Morgonomsorg",
    "Kvällsomvårdnad",
    "Insulin",
    "Medicin morgon",
    "Medicin kväll",
  ];
  if (dailyKeywords.some((k) => name.includes(k))) {
    return "daily";
  }

  // Weekly = cleaning, shopping (can move within week)
  const weeklyKeywords = ["Städning", "Rengöring", "Inköp"];
  if (weeklyKeywords.some((k) => name.includes(k))) {
    return "weekly";
  }

  // Bi-weekly = special rehab
  const biweeklyKeywords = ["Promenad", "Träning"];
  if (biweeklyKeywords.some((k) => name.includes(k))) {
    return "bi-weekly";
  }

  // Monthly = major medical procedures
  const monthlyKeywords = ["Provtagning", "Sårbyte"];
  if (monthlyKeywords.some((k) => name.includes(k))) {
    return "monthly";
  }

  return null; // No recurrence
}

// Update all events
data.events.rows = data.events.rows.map((event) => {
  // Set eventType
  event.eventType = getEventType(event.name);

  // Set recurrence
  event.recurrence = getRecurrence(event.name, event.mandatory, event.movable);

  // Set movable based on recurrence
  // Daily recurring can't be moved to another day
  if (event.recurrence === "daily") {
    event.movable = false;
  }

  // Ensure priority is lowercase
  if (event.priority === "Hög") {
    event.priority = "high";
  } else if (event.priority === "Akut") {
    event.priority = "akut";
  } else if (event.priority === "Låg") {
    event.priority = "normal";
  } else if (event.priority === "Normal") {
    event.priority = "normal";
  }

  // Set staffingType (default single, would need specific data for double)
  event.staffingType = event.staffingType || "single";

  // Remove old eventColor field (replaced by eventType)
  delete event.eventColor;

  return event;
});

// Write updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(
  `✅ Applied new visual system to ${data.events.rows.length} events`,
);
console.log(
  `   Event types: ${[...new Set(data.events.rows.map((e) => e.eventType))].join(", ")}`,
);
console.log(
  `   Recurrence patterns: ${[...new Set(data.events.rows.map((e) => e.recurrence).filter(Boolean))].join(", ")}`,
);
