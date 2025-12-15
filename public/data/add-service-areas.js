// Script to add service area fields to all test data files
const fs = require('fs');
const path = require('path');

const serviceAreas = [
  { id: "area-1", name: "Västra", color: "#3b82f6" },
  { id: "area-2", name: "Östra", color: "#10b981" },
  { id: "area-3", name: "Södra", color: "#f59e0b" },
];

const dataFiles = [
  'data.json',
  'homecare-complete.json',
  'homecare-realistic.json',
  'homecare-revision2.json',
  'homecare-revision3.json',
  'homecare.json',
  'visits_data.json',
  'visits-generated.json'
];

function addServiceAreasToFile(filename) {
  const filePath = path.join(__dirname, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${filename} - file not found`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add service areas to resources
    if (data.resources && data.resources.rows) {
      data.resources.rows.forEach((resource, index) => {
        const areaIndex = index % serviceAreas.length;
        const area = serviceAreas[areaIndex];
        resource.serviceAreaId = area.id;
        resource.serviceAreaName = area.name;
        resource.serviceAreaColor = area.color;
      });
      console.log(`✅ Updated ${data.resources.rows.length} resources in ${filename}`);
    }
    
    // Add service areas and visitCategory to events
    if (data.events && data.events.rows) {
      data.events.rows.forEach((event, index) => {
        const areaIndex = index % serviceAreas.length;
        const area = serviceAreas[areaIndex];
        event.serviceAreaId = area.id;
        event.serviceAreaName = area.name;
        event.serviceAreaColor = area.color;
        
        // Add visitCategory based on visitRecurrence
        // daily/null = "daily", weekly/bi-weekly/monthly = "recurring"
        if (!event.visitCategory) {
          const recurrence = event.visitRecurrence;
          if (!recurrence || recurrence === "daily" || recurrence === "other") {
            event.visitCategory = "daily";
          } else if (["weekly", "bi-weekly", "monthly"].includes(recurrence)) {
            event.visitCategory = "recurring";
          } else {
            event.visitCategory = "daily"; // default
          }
        }
        
        // Add requiredSkills by extracting from taskNotes ("Kräver: X, Y")
        if (!event.requiredSkills && event.taskNotes) {
          const requiresMatch = event.taskNotes.match(/Kräver:\s*(.+?)(?:\.|$)/i);
          if (requiresMatch) {
            const skillsString = requiresMatch[1];
            event.requiredSkills = skillsString
              .split(",")
              .map(s => s.trim())
              .filter(s => s.length > 0);
          } else {
            event.requiredSkills = [];
          }
        } else if (!event.requiredSkills) {
          event.requiredSkills = [];
        }
        
        // Migrate from old visitStatus to new boolean flags + priority
        // Map old visitStatus to new fields
        if (event.visitStatus) {
          const oldStatus = event.visitStatus;
          event.isOptional = oldStatus === "optional";
          event.isMandatory = oldStatus === "mandatory";
          event.isExtra = oldStatus === "extra";
          event.isCancelled = oldStatus === "cancelled";
          event.isAbsent = oldStatus === "absent";
          
          // Priority: if old status was "priority", set priority to 7 (default high)
          // Otherwise, use existing priority field or default to 0
          if (oldStatus === "priority") {
            event.priority = event.priority || 7;
          } else {
            event.priority = event.priority || 0;
          }
          
          // Remove old field
          delete event.visitStatus;
        } else {
          // Ensure all fields exist with proper defaults
          // If fields don't exist, assign based on index to create variety
          const eventIndex = data.events.rows.indexOf(event);
          
          // Base status: Distribute between optional and mandatory (60% mandatory, 40% optional)
          // Only set if truly undefined, otherwise preserve existing value
          if (event.isOptional === undefined && event.isMandatory === undefined) {
            event.isMandatory = (eventIndex % 10) < 6;
            event.isOptional = !event.isMandatory;
          } else {
            // Ensure at least one is true (every visit is either optional or mandatory)
            if (event.isOptional === undefined) {
              event.isOptional = !event.isMandatory;
            }
            if (event.isMandatory === undefined) {
              event.isMandatory = !event.isOptional;
            }
          }
          
          // Add variety: some extra visits (10% of events)
          // Force set based on index to ensure variety exists
          if (event.isExtra === undefined || event.isExtra === false) {
            // Only set to true for 10% of events (every 10th event)
            event.isExtra = (eventIndex % 10) === 0;
          }
          
          // Add variety: some cancelled visits (5% of events)
          // Force set based on index to ensure variety exists
          if (event.isCancelled === undefined || event.isCancelled === false) {
            // Only set to true for 5% of events (every 20th event, starting at index 2)
            event.isCancelled = (eventIndex % 20) === 2;
          }
          
          // Add variety: some absent visits (3% of events)
          // Force set based on index to ensure variety exists
          if (event.isAbsent === undefined || event.isAbsent === false) {
            // Only set to true for 3% of events (every 30th event, starting at index 5)
            event.isAbsent = (eventIndex % 30) === 5;
          }
          
          // Add variety: priority levels (30% have priority, distributed across 1-10)
          // Only set if truly undefined, otherwise preserve existing value
          if (event.priority === undefined) {
            if ((eventIndex % 10) < 3) {
              // 30% have priority (levels 1-10)
              event.priority = Math.min(Math.floor((eventIndex % 10) * 3.33) + 1, 10);
            } else {
              event.priority = 0;
            }
          }
          
          // Ensure boolean flags are actually booleans (not strings or other types)
          event.isOptional = Boolean(event.isOptional);
          event.isMandatory = Boolean(event.isMandatory);
          event.isExtra = Boolean(event.isExtra);
          event.isCancelled = Boolean(event.isCancelled);
          event.isAbsent = Boolean(event.isAbsent);
          event.priority = Number(event.priority) || 0;
        }
      });
      console.log(`✅ Updated ${data.events.rows.length} events in ${filename}`);
    }
    
    // Write back to file with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`📝 Saved ${filename}\n`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
}

console.log('🚀 Adding service area data to test files...\n');
dataFiles.forEach(addServiceAreasToFile);
console.log('✨ Done!');

