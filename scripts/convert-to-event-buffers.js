// Script to convert travelMinutes to preamble/postamble (eventBuffer) in homecare-complete.json
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../public/data/homecare-complete.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Stockholm coordinates for different areas
const locations = {
  "Götgatan 12": { lat: 59.314, lng: 18.0745 },
  "Ringvägen 45": { lat: 59.3076, lng: 18.0856 },
  "Folkungagatan 88": { lat: 59.3158, lng: 18.0819 },
  "Sockenvägen 23": { lat: 59.2912, lng: 18.0556 },
  "Ringvägen 102": { lat: 59.3023, lng: 18.0912 },
  "Bondegatan 55": { lat: 59.3178, lng: 18.0889 },
  "Skånegatan 71": { lat: 59.3134, lng: 18.0801 },
  "Nytorgsgatan 34": { lat: 59.3145, lng: 18.0756 },
  "Åsögatan 144": { lat: 59.3089, lng: 18.0934 },
  "Katarina Bangata 68": { lat: 59.3167, lng: 18.0878 },
  "Blekingegatan 22": { lat: 59.3112, lng: 18.0867 },
  "Hornsgatan 154": { lat: 59.3089, lng: 18.0523 },
  "Långholmsgatan 31": { lat: 59.3156, lng: 18.0334 },
  "Wollmar Yxkullsgatan 12": { lat: 59.3123, lng: 18.0645 },
  "Fatbursgatanatan 8": { lat: 59.3134, lng: 18.0723 },
  "Renstiernas gata 19": { lat: 59.3123, lng: 18.0789 },
  "Tjärhovsgatan 45": { lat: 59.3112, lng: 18.0534 },
  "Södermannagatan 66": { lat: 59.3145, lng: 18.0867 },
  "Malmgårdsvägen 15": { lat: 59.2934, lng: 18.0623 },
  "Enskedevägen 88": { lat: 59.2889, lng: 18.0567 },
  "Johannesfredsvägen 12": { lat: 59.2956, lng: 18.0678 },
};

// Remove travel events (IDs >= 1000)
data.events.rows = data.events.rows.filter((event) => event.id < 1000);
data.assignments.rows = data.assignments.rows.filter((assignment) => {
  const event = data.events.rows.find((e) => e.id === assignment.event);
  return event !== undefined;
});

// Add coordinates and convert travelMinutes to preamble
data.events.rows = data.events.rows.map((event) => {
  // Add coordinates
  const addressKey = Object.keys(locations).find((key) =>
    event.address?.includes(key.split(",")[0]),
  );
  if (addressKey) {
    event.lat = locations[addressKey].lat;
    event.lng = locations[addressKey].lng;
  }

  // Convert travelMinutes to preamble (travel before event)
  if (event.travelMinutes && event.travelMinutes > 0) {
    event.preamble = event.travelMinutes;
    event.preambleIcon = "fa fa-car";
    event.preambleCls = "";
    event.preambleText = "";
  }

  // Remove old eventType field
  delete event.eventType;
  delete event.travelFrom;
  delete event.travelTo;

  return event;
});

// Write updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(
  `✅ Converted ${data.events.rows.filter((e) => e.preamble).length} events to use eventBuffer (preamble)`,
);
console.log(
  `✅ Added coordinates to ${data.events.rows.filter((e) => e.lat && e.lng).length} events`,
);
console.log(
  `✅ Removed ${60 - data.events.rows.length} travel events (now using eventBuffer)`,
);
