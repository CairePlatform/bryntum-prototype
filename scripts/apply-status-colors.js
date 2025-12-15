// Script to apply simplified status-based visual system
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../public/data/homecare-complete.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Update all events to use visitStatus instead of eventType
data.events.rows = data.events.rows.map((event) => {
  // Determine visitStatus based on priority and mandatory
  if (event.priority === "akut" || event.priority === "high") {
    event.visitStatus = "priority"; // Red
  } else if (event.mandatory) {
    event.visitStatus = "mandatory"; // Purple
  } else {
    event.visitStatus = "optional"; // Blue (standard)
  }

  // Clean up old fields
  delete event.eventType;
  delete event.priority;
  delete event.mandatory;

  return event;
});

// Write updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(
  `✅ Applied status-based colors to ${data.events.rows.length} events`,
);
console.log(`   Status distribution:`);
console.log(
  `   - Optional: ${data.events.rows.filter((e) => e.visitStatus === "optional").length}`,
);
console.log(
  `   - Mandatory: ${data.events.rows.filter((e) => e.visitStatus === "mandatory").length}`,
);
console.log(
  `   - Priority: ${data.events.rows.filter((e) => e.visitStatus === "priority").length}`,
);
