// Script to add travel events between assigned visits in homecare-complete.json
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
};

// Add coordinates to existing events
data.events.rows = data.events.rows.map((event) => {
  const addressKey = Object.keys(locations).find((key) =>
    event.address?.includes(key.split(",")[0]),
  );
  if (addressKey) {
    event.lat = locations[addressKey].lat;
    event.lng = locations[addressKey].lng;
  }
  event.eventType = "visit"; // Mark as visit type
  return event;
});

// Group assignments by resource to find sequence
const resourceSchedules = {};
data.assignments.rows.forEach((assignment) => {
  const resourceId = assignment.resource;
  if (!resourceSchedules[resourceId]) {
    resourceSchedules[resourceId] = [];
  }
  const event = data.events.rows.find((e) => e.id === assignment.event);
  if (event && event.startDate) {
    resourceSchedules[resourceId].push({
      assignmentId: assignment.id,
      eventId: event.id,
      event: event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    });
  }
});

// Sort each resource's schedule by time
Object.keys(resourceSchedules).forEach((resourceId) => {
  resourceSchedules[resourceId].sort((a, b) => a.startDate - b.startDate);
});

// Generate travel events
let travelEventId = 1000; // Start travel IDs at 1000
let travelAssignmentId = 1000;
const travelEvents = [];
const travelAssignments = [];

Object.keys(resourceSchedules).forEach((resourceId) => {
  const schedule = resourceSchedules[resourceId];

  for (let i = 0; i < schedule.length - 1; i++) {
    const currentVisit = schedule[i].event;
    const nextVisit = schedule[i + 1].event;

    // Only add travel if there's a gap and travelMinutes exists
    if (nextVisit.travelMinutes && nextVisit.travelMinutes > 0) {
      const travelStart = schedule[i].endDate;
      const travelEnd = new Date(
        travelStart.getTime() + nextVisit.travelMinutes * 60000,
      );

      const travelEvent = {
        id: travelEventId++,
        name: `Resa ${nextVisit.travelMinutes}min`,
        eventType: "travel",
        duration: nextVisit.travelMinutes / 60, // Convert to hours
        eventColor: "transparent",
        requiredRole: nextVisit.requiredRole,
        travelMinutes: nextVisit.travelMinutes,
        travelFrom: currentVisit.address?.split(",")[0] || "Föregående besök",
        travelTo: nextVisit.address?.split(",")[0] || nextVisit.patient,
        startDate: travelStart.toISOString().slice(0, 19),
        endDate: travelEnd.toISOString().slice(0, 19),
        iconCls: "fa fa-car",
      };

      travelEvents.push(travelEvent);
      travelAssignments.push({
        id: travelAssignmentId++,
        event: travelEvent.id,
        resource: parseInt(resourceId),
      });
    }
  }
});

// Add travel events to data
data.events.rows.push(...travelEvents);
data.assignments.rows.push(...travelAssignments);

// Write updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(
  `Added ${travelEvents.length} travel events to homecare-complete.json`,
);
