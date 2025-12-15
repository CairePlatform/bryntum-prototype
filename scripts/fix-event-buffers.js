// Script to properly set preamble/postamble as duration in hours
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../public/data/homecare-complete.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Convert preamble/postamble from minutes to hours (Bryntum expects duration in hours when durationUnit='h')
data.events.rows = data.events.rows.map((event) => {
  if (event.preamble) {
    // Convert minutes to hours for Bryntum
    event.preamble = event.preamble / 60;
  }
  if (event.postamble) {
    event.postamble = event.postamble / 60;
  }

  // Ensure default preamble icon
  if (event.preamble && !event.preambleIcon) {
    event.preambleIcon = "fa fa-car";
  }
  if (event.postamble && !event.postambleIcon) {
    event.postambleIcon = "fa fa-car";
  }

  return event;
});

// Write updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(
  `✅ Fixed preamble/postamble durations (converted minutes to hours)`,
);
console.log(
  `✅ Events with preamble: ${data.events.rows.filter((e) => e.preamble).length}`,
);
