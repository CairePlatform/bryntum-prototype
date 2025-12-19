# Bryntum Prototype Integration PRD – Reference Document

> **⚠️ IMPORTANT:** This document is for **reference only**. The prototype is **NOT being integrated** into production.  
> Production development will start **from scratch** in the private repository: [https://github.com/CairePlatform/beta-appcaire](https://github.com/CairePlatform/beta-appcaire)  
> **Timeline:** 4 weeks (basic features) + 4 weeks (all features) = 8 weeks total  
> **Primary Development Guide:** See [BRYNTUM_FROM_SCRATCH_PRD.md](./BRYNTUM_FROM_SCRATCH_PRD.md)

---

**Version:** 1.0  
**Date:** 2025-12-15  
**Purpose:** Reference document for understanding prototype structure and components  
**Prototype Reference:** [https://bryntum-vite.vercel.app](https://bryntum-vite.vercel.app)

---

## Executive Summary

This document describes the **bryntum-prototype** repository, which serves as a **UX/UI reference and demonstration** for the production scheduling calendar. The prototype:

1. **Demonstrates all UI features** with mock data
2. **Shows component structure** and Bryntum configurations
3. **Provides UX/UI reference** for design decisions
4. **Contains mock data examples** in `public/data/2.0/`

**Use this document to:**
- Understand how features are implemented in the prototype
- Reference component patterns and structures
- Understand data formats and transformations
- Guide UX/UI decisions during production development

**Do NOT use this document to:**
- Integrate prototype code into production (development starts from scratch)
- Copy components directly (use as reference only)

---

## Prototype Integration Approach

### What is the Prototype?

We have a **fully functional Bryntum SchedulerPro calendar** built as a standalone prototype application. The prototype:

- ✅ **Complete UI Implementation:** All visual features, components, and interactions are built and working
- ✅ **Mock Data:** Uses JSON files with realistic home care scheduling data
- ✅ **All Features:** Drag-and-drop, filters, comparison view, metrics, optimization scenarios, etc.
- ✅ **Swedish Localization:** All UI text translated to Swedish
- ✅ **Visual System:** Complete color coding, icons, status indicators
- ✅ **Live Demo:** Available at [https://bryntum-vite.vercel.app](https://bryntum-vite.vercel.app)

**Prototype Location:** Separate repository at `CairePlatform/bryntum-prototype` (standalone Vite + React application, deployed on Vercel)

**Repository:** [https://github.com/CairePlatform/bryntum-prototype.git](https://github.com/CairePlatform/bryntum-prototype.git)

### Prototype Repository Details

**GitHub Repository:** [CairePlatform/bryntum-prototype](https://github.com/CairePlatform/bryntum-prototype)

**Live Demo:** [https://bryntum-vite.vercel.app](https://bryntum-vite.vercel.app)

**Technology Stack:**

- React 18.2.0
- Vite 4.3.9
- TypeScript
- Bryntum SchedulerPro 7.0.0+
- Tailwind CSS
- pnpm (package manager)

**Repository Structure:**

```
bryntum-prototype/
├── src/                    # Source code (components to be copied)
│   ├── components/          # Bryntum calendar components
│   ├── data/               # Mock JSON data files
│   └── ...
├── public/                 # Static assets
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Setup instructions
```

**Access Requirements:**

- **GitHub Access:** Repository is private - you'll need access granted by Caire team
- **Bryntum NPM Token:** Required for installing Bryntum packages (will be provided)
- **Setup:** Follow README.md in repository for installation instructions

**Key Files to Reference:**

- `src/components/` - All Bryntum calendar components (these will be copied to main app)
- `src/data/homecare-complete.json` - Example mock data structure
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration

**Getting Started:**

1. Clone the repository: `git clone https://github.com/CairePlatform/bryntum-prototype.git` (access will be granted)
2. Set up Bryntum NPM access (see repository README for details)
3. Install dependencies: `pnpm install`
4. Run development server: `pnpm dev`
5. Explore the codebase to understand component structure and data flow

**Note:** The prototype uses mock JSON data files. During integration, these will be replaced with GraphQL API calls and mapper functions.

### Integration Strategy

Instead of building from scratch, we will:

1. **Copy prototype components** into the main Next.js application structure
2. **Replace mock data** with GraphQL API calls
3. **Add mapper functions** to transform backend data to Bryntum format
4. **Connect real-time features** (WebSocket subscriptions for optimization progress)
5. **Preserve all UI/UX** from the prototype (no redesign needed)

### Why This Approach?

- **Faster Delivery:** UI is already built and tested
- **Lower Risk:** Visual design and UX patterns are proven
- **Cost Effective:** Focus on integration, not UI development
- **Consistent Experience:** Users get the same interface they've seen in demos

### What Needs to Be Done?

The prototype has **all the UI code** but needs:

- Backend API integration (GraphQL queries/mutations)
- Data transformation (database format → Bryntum format)
- Real-time updates (WebSocket subscriptions)
- Error handling and loading states
- Integration with main app routing and authentication

**Estimated Effort:** 22-33 hours (vs 112-152 hours for building from scratch)

---

## Project Context

### Current State

- ✅ **Prototype Complete:** Working Bryntum calendar with all features implemented
- ✅ **Visual System:** Complete color coding, icons, status indicators
- ✅ **Swedish Localization:** All labels translated
- ✅ **All UX Patterns:** Drag-and-drop, filters, legend, comparison view, etc.
- ❌ **Backend Integration:** Not yet connected to real data
- ❌ **Main App Integration:** Prototype is standalone (Vite + React)

### Target State

- ✅ Bryntum calendar integrated into main Next.js/React app
- ✅ Connected to GraphQL API (Express + Apollo Server)
- ✅ Real-time optimization progress via WebSocket subscriptions
- ✅ All features working with production data
- ✅ Type-safe end-to-end (Prisma → GraphQL → React)

---

## Scope of Work

### Phase 1: Prototype Integration (4-6 hours)

**Task:** Copy prototype components into main application structure

**Deliverables:**

- Clone the prototype repository: `git clone https://github.com/CairePlatform/bryntum-prototype.git` (access will be granted)
- Copy components from `bryntum-prototype/src/` to main app: `packages/client/src/features/scheduling/components/bryntum-calendar/`
- Update import paths and dependencies
- Ensure Bryntum SchedulerPro is properly configured
- Verify all UI features still work (filters, legend, histogram, comparison)

**Repository Access:**

- GitHub repository: [https://github.com/CairePlatform/bryntum-prototype.git](https://github.com/CairePlatform/bryntum-prototype.git)
- Access will be granted by Caire team
- Bryntum NPM token required (will be provided)

**Files to Copy:**

```
bryntum-calendar/
├── SchedulerView.tsx          # Main calendar component
├── LegendAndFiltering.tsx     # Legend and filter controls
├── ResourceHistogram.tsx       # Resource utilization chart
├── ComparisonView.tsx          # Baseline vs optimized comparison
├── OptimizationScenarioModal.tsx # Scenario selection
├── MetricsPanel.tsx           # Metrics display
├── RouteSummary.tsx           # Route summary
└── types.ts                   # Bryntum-specific types
```

**Acceptance Criteria:**

- [ ] All components copied and working in main app
- [ ] No console errors
- [ ] All UI features functional (still with mock data)
- [ ] Swedish localization preserved

---

### Phase 2: GraphQL Integration (8-12 hours)

**Task:** Replace mock data with GraphQL queries and implement mapper functions

#### 2.1 Create GraphQL Hooks (4-6 hours)

**Deliverables:**

- Create `useSchedule.ts` hook for fetching schedule data
- Create `useUpdateSchedule.ts` hook for saving changes
- Create `useOptimization.ts` hook for triggering optimization
- Create `useOptimizationProgress.ts` hook for real-time progress

**GraphQL Operations Required:**

```graphql
# Query: Get schedule with all data for Bryntum
query GetScheduleForCalendar($id: ID!) {
  schedule(id: $id) {
    id
    name
    date
    status
    employees {
      id
      name
      role
      contractType
      transportMode
      skills {
        name
        level
      }
      shifts {
        minStartTime
        maxEndTime
        breaks {
          minStartTime
          maxEndTime
          breakType
        }
      }
    }
    visits {
      id
      name
      clientName
      plannedStartTime
      plannedEndTime
      duration
      visitStatus
      priority
      pinned
      recurrenceType
      visitCategory
      requiredStaff
      skills {
        name
      }
      client {
        name
        address
        latitude
        longitude
      }
      assignment {
        employeeId
        startTime
        endTime
        travelTimeSeconds
        waitingTimeSeconds
      }
    }
    metrics {
      serviceHours
      travelTimeSeconds
      waitingTimeSeconds
      utilizationPercentage
      unassignedVisits
    }
  }
}

# Mutation: Save schedule changes
mutation UpdateSchedule($input: UpdateScheduleInput!) {
  updateSchedule(input: $input) {
    id
    status
    updatedAt
  }
}

# Mutation: Trigger optimization
mutation RunOptimization($scheduleId: ID!, $scenarioId: ID!) {
  runOptimization(scheduleId: $scheduleId, scenarioId: $scenarioId) {
    jobId
    status
    estimatedDuration
  }
}

# Subscription: Optimization progress
subscription OptimizationProgress($jobId: ID!) {
  optimizationProgress(jobId: $jobId) {
    jobId
    status
    progress
    eta
    solution {
      id
      assignments {
        visitId
        employeeId
        startTime
        endTime
      }
    }
  }
}
```

**Acceptance Criteria:**

- [ ] All hooks created with proper TypeScript types
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Optimistic updates where appropriate

#### 2.2 Implement Mapper Functions (4-6 hours)

**Task:** Transform between GraphQL types and Bryntum format

**Location:** `src/features/scheduling/lib/mappers.ts`

**Required Functions:**

```typescript
/**
 * Maps GraphQL Schedule to Bryntum SchedulerPro data format
 */
export function mapScheduleToBryntum(schedule: Schedule): BryntumData {
  return {
    resources: schedule.employees.map(mapEmployeeToResource),
    events: schedule.visits.map(mapVisitToEvent),
    assignments: schedule.visits
      .filter(v => v.assignment?.employeeId)
      .map(v => ({
        id: `${v.id}-${v.assignment.employeeId}`,
        eventId: v.id,
        resourceId: v.assignment.employeeId,
      })),
    calendars: schedule.employees.map(mapEmployeeToCalendar),
  };
}

/**
 * Maps employee to Bryntum resource
 */
function mapEmployeeToResource(employee: Employee): BryntumResource {
  return {
    id: employee.id,
    name: employee.name,
    type: "employee",
    role: employee.role,
    contractType: employee.contractType,
    transportMode: employee.transportMode,
    skills: employee.skills.map(s => s.name),
    // ... other fields
  };
}

/**
 * Maps visit to Bryntum event
 */
function mapVisitToEvent(visit: Visit): BryntumEvent {
  return {
    id: visit.id,
    name: visit.name,
    clientName: visit.clientName,
    startDate: visit.plannedStartTime || visit.assignment?.startTime,
    endDate: visit.plannedEndTime || visit.assignment?.endTime,
    duration: visit.duration / 60, // minutes to hours
    visitStatus: mapVisitStatus(visit),
    priority: visit.priority,
    pinned: visit.pinned,
    recurrence: visit.recurrenceType,
    requiredStaff: visit.requiredStaff,
    skills: visit.skills.map(s => s.name),
    client: {
      name: visit.client.name,
      address: visit.client.address,
      lat: visit.client.latitude,
      lng: visit.client.longitude,
    },
    travelTime: visit.assignment?.travelTimeSeconds / 60,
    waitingTime: visit.assignment?.waitingTimeSeconds / 60,
    // ... other fields
  };
}

/**
 * Maps employee shifts and breaks to Bryntum calendar
 */
function mapEmployeeToCalendar(employee: Employee): BryntumCalendar {
  return {
    id: employee.id,
    intervals: employee.shifts.map(shift => ({
      startDate: shift.minStartTime,
      endDate: shift.maxEndTime,
      isWorking: true,
    })),
    breaks: employee.shifts.flatMap(shift =>
      shift.breaks.map(break => ({
        startDate: break.minStartTime,
        endDate: break.maxEndTime,
        name: break.breakType === "LUNCH" ? "Lunch" : "Break",
        cls: "lunch-break",
      }))
    ),
  };
}

/**
 * Maps Bryntum changes back to GraphQL mutation input
 */
export function mapBryntumChangesToUpdate(
  changes: BryntumChanges,
  scheduleId: string
): UpdateScheduleInput {
  return {
    scheduleId,
    visits: changes.events.map(event => ({
      id: event.id,
      plannedStartTime: event.startDate,
      plannedEndTime: event.endDate,
      pinned: event.pinned,
    })),
    assignments: changes.assignments.map(assignment => ({
      visitId: assignment.eventId,
      employeeId: assignment.resourceId,
    })),
  };
}

/**
 * Maps visit status from database to Bryntum format
 */
function mapVisitStatus(visit: Visit): BryntumVisitStatus {
  if (visit.visitStatus === "cancelled") return "cancelled";
  if (visit.visitStatus === "absent") return "absent";
  if (visit.priority === "urgent") return "priority";
  if (visit.pinned) return "mandatory";
  return "optional";
}
```

**Acceptance Criteria:**

- [ ] All mapper functions implemented
- [ ] Type-safe (no `any` types)
- [ ] Handles null/undefined gracefully
- [ ] Unit tests for each mapper function
- [ ] Edge cases covered (unassigned visits, missing data, etc.)

---

### Phase 3: Connect Components to GraphQL (4-6 hours)

**Task:** Update SchedulerView component to use GraphQL hooks instead of mock data

**Before (prototype with mock data):**

```typescript
const [data, setData] = useState(null);
useEffect(() => {
  fetch("/public/data/homecare-complete.json")
    .then((res) => res.json())
    .then(setData);
}, []);
```

**After (with GraphQL):**

```typescript
export function SchedulerView({ scheduleId }: { scheduleId: string }) {
  const { schedule, loading, error } = useSchedule(scheduleId);
  const { saveSchedule, saving } = useUpdateSchedule();
  const { runOptimization, optimizing } = useOptimization();
  const { progress } = useOptimizationProgress(optimizationJobId);

  const bryntumData = useMemo(
    () => schedule ? mapScheduleToBryntum(schedule) : null,
    [schedule]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!bryntumData) return <EmptyState />;

  const handleSave = (changes: BryntumChanges) => {
    saveSchedule(changes, scheduleId);
  };

  const handleOptimize = (scenarioId: string) => {
    runOptimization(scheduleId, scenarioId);
  };

  return (
    <SchedulerPro
      {...bryntumData}
      onEventChange={handleSave}
      onOptimize={handleOptimize}
      optimizationProgress={progress}
      // ... other Bryntum config
    />
  );
}
```

**Acceptance Criteria:**

- [ ] SchedulerView loads real data from GraphQL
- [ ] Save functionality creates new revision in database
- [ ] Optimize functionality triggers Timefold job
- [ ] Real-time progress updates via subscription
- [ ] Error handling for failed operations
- [ ] Loading states during operations

---

### Phase 4: Real-time Updates (2-3 hours)

**Task:** Implement WebSocket subscriptions for optimization progress

**Deliverables:**

- Connect GraphQL subscription to optimization progress
- Update Bryntum calendar with progress updates
- Show progress overlay during optimization
- Handle completion and error states

**Implementation:**

```typescript
// useOptimizationProgress.ts
export function useOptimizationProgress(jobId: string) {
  const { data, loading } = useSubscription(OPTIMIZATION_PROGRESS, {
    variables: { jobId },
    skip: !jobId,
  });

  return {
    progress: data?.optimizationProgress,
    loading,
  };
}

// In SchedulerView component
const { progress } = useOptimizationProgress(optimizationJobId);

useEffect(() => {
  if (progress?.solution) {
    // Update Bryntum with new solution data
    const newData = mapScheduleToBryntum(progress.solution);
    scheduler.eventStore.data = newData.events;
    scheduler.assignmentStore.data = newData.assignments;
  }
}, [progress]);
```

**Acceptance Criteria:**

- [ ] Progress updates in real-time during optimization
- [ ] Calendar updates automatically when solution arrives
- [ ] Progress overlay shows correct status
- [ ] Error states handled gracefully

---

### Phase 5: Testing & Polish (4-6 hours)

**Task:** Comprehensive testing and bug fixes

**Deliverables:**

- Unit tests for mapper functions
- Integration tests for GraphQL hooks
- E2E tests for critical workflows
- Bug fixes and performance optimization
- Documentation updates

**Test Coverage:**

- [ ] Mapper functions: >90% coverage
- [ ] GraphQL hooks: >80% coverage
- [ ] Critical workflows: E2E tests
- [ ] Edge cases: null handling, error states

**Acceptance Criteria:**

- [ ] All tests passing
- [ ] No console errors
- [ ] Performance acceptable (<200ms query time)
- [ ] Documentation complete

---

## Technical Requirements

### Technology Stack

**Frontend:**

- React 18 with TypeScript
- Apollo Client for GraphQL
- Bryntum SchedulerPro 7.0.0+
- React Router for navigation
- Tailwind CSS for styling

**Backend (Provided):**

- Express.js + Apollo Server
- GraphQL API (queries, mutations, subscriptions)
- Prisma ORM with PostgreSQL
- WebSocket for real-time subscriptions

### Data Model

The backend uses a normalized data model. Key entities:

- **Schedules:** Main schedule instances
- **Visits:** Individual care visits
- **Employees:** Caregivers/staff
- **Clients:** Care recipients
- **Solutions:** Optimization results
- **Assignments:** Visit-to-employee assignments

See `data-model-v2.md` for complete schema.

### API Interface

**GraphQL Endpoint:** `http://localhost:4000/graphql` (or provided URL)  
**WebSocket Endpoint:** `ws://localhost:4000/graphql` (or provided URL)

**Authentication:** Clerk JWT tokens in Authorization header

**Example Request:**

```typescript
const { data } = useQuery(GET_SCHEDULE, {
  variables: { id: scheduleId },
  context: {
    headers: {
      authorization: `Bearer ${clerkToken}`,
    },
  },
});
```

---

## Visual System Reference

### Color Coding (Status-Based)

- 🔵 **Blue** = Optional/standard visit
- 🟣 **Purple** = Mandatory (can't skip)
- 🔴 **Red** = High priority or emergency
- 🟢 **Green** = Extra visits added by planner
- 🟡 **Yellow** = Cancelled
- ⚪ **Grey** = Absent

### Icons

- 📅**1** = Daily recurring
- 📅**7** = Weekly recurring
- 📅**14** = Bi-weekly recurring
- 📅**30** = Monthly recurring
- 🔒 = Locked/pinned visit
- 👥 = Double staffing required

### Travel & Breaks

- **Travel:** Transparent + dashed border, transport icon (🚗🚴🚶🚌), duration
- **Lunch:** Transparent + dotted frame (12:00-12:30)

See prototype for complete visual reference: https://bryntum-vite.vercel.app

---

## Features to Implement

### Core Features (Already in Prototype)

✅ **Timeline Calendar View**

- Employee rows with metadata columns
- Visit events with drag-and-drop
- Time axis navigation
- Zoom controls

✅ **Drag & Drop**

- Assign unplanned visits to employees
- Reassign visits between employees
- Adjust visit times by dragging
- Resize visit duration

✅ **Filters & Toggles**

- Mandatory/Optional filter
- Priority filter
- Recurrence filter
- Service area filter
- Skill filter
- Pinned visits filter
- Night/weekend toggle
- Breaks toggle

✅ **Visual Indicators**

- Visit status colors
- Recurrence icons
- Pinned lock icons
- Double staffing icons
- Transport mode icons

✅ **Optimization Scenarios**

- 5 preset scenarios (Daglig Planering, Nya Klienter, Störningshantering, Kontinuitetsfokus, Maximal Effektivitet)
- Custom scenario with editable weights
- Scenario selection modal

✅ **Comparison Mode**

- Baseline vs optimized side-by-side
- Metrics comparison
- Delta highlighting

✅ **Metrics Panel**

- Service hours
- Travel time
- Waiting time
- Utilization percentage
- Unassigned visits count

### Features Requiring Backend Integration

🔄 **Real-time Optimization Progress**

- WebSocket subscription
- Progress bar overlay
- Automatic calendar update on completion

🔄 **Save Changes**

- Create new revision on save
- Update database via GraphQL mutation
- Optimistic UI updates

🔄 **Load Real Data**

- Fetch schedule from GraphQL
- Transform to Bryntum format
- Handle loading/error states

---

## Deliverables

### Code Deliverables

1. **Integrated Components**

   - All Bryntum components in main app structure
   - Proper folder organization
   - TypeScript types throughout

2. **GraphQL Integration**

   - Custom hooks for data fetching
   - Mapper functions (DB ↔ Bryntum)
   - Error handling and loading states

3. **Real-time Features**

   - WebSocket subscription setup
   - Progress tracking
   - Automatic updates

4. **Tests**

   - Unit tests for mappers
   - Integration tests for hooks
   - E2E tests for workflows

5. **Documentation**
   - README with setup instructions
   - API integration guide
   - Mapper function documentation

### Documentation Deliverables

1. **Implementation Guide**

   - How to add new features
   - How to modify mappers
   - How to extend GraphQL queries

2. **Troubleshooting Guide**
   - Common issues and solutions
   - Debugging tips
   - Performance optimization

---

## Acceptance Criteria

### Functional Requirements

- [ ] Calendar loads real schedule data from GraphQL
- [ ] All visits and employees display correctly
- [ ] Drag-and-drop assignment works and saves to database
- [ ] Visit editing (time, duration) saves to database
- [ ] Optimization triggers Timefold job via GraphQL
- [ ] Real-time progress updates during optimization
- [ ] Calendar updates automatically when solution arrives
- [ ] All filters work with real data
- [ ] Metrics panel shows accurate KPIs
- [ ] Comparison mode works with real schedules
- [ ] Swedish localization preserved
- [ ] All visual indicators display correctly

### Non-Functional Requirements

- [ ] Type-safe throughout (no `any` types)
- [ ] Error handling for all operations
- [ ] Loading states for async operations
- [ ] Performance: <200ms for GraphQL queries
- [ ] No console errors or warnings
- [ ] Responsive design maintained
- [ ] Accessibility standards met

### Code Quality

- [ ] TypeScript strict mode passes
- [ ] ESLint passes with no errors
- [ ] Unit test coverage >80%
- [ ] Integration tests for critical flows
- [ ] Code follows project conventions
- [ ] Comments on complex logic

---

## Timeline & Effort Estimate

Based on our internal analysis:

| Phase       | Task                  | Estimated Hours |
| ----------- | --------------------- | --------------- |
| **Phase 1** | Prototype Integration | 4-6 hours       |
| **Phase 2** | GraphQL Integration   | 8-12 hours      |
| **Phase 3** | Connect Components    | 4-6 hours       |
| **Phase 4** | Real-time Updates     | 2-3 hours       |
| **Phase 5** | Testing & Polish      | 4-6 hours       |
| **Total**   |                       | **22-33 hours** |

**Recommended Timeline:** 2-3 weeks (allowing for review cycles and adjustments)

---

## Dependencies & Prerequisites

### Provided by Caire

- ✅ **Prototype Repository:** [https://github.com/CairePlatform/bryntum-prototype.git](https://github.com/CairePlatform/bryntum-prototype.git) (access will be granted)
- ✅ **Live Demo:** [https://bryntum-vite.vercel.app](https://bryntum-vite.vercel.app) (for visual reference)
- ✅ **Bryntum NPM Token:** Required for installing Bryntum packages (will be provided)
- ✅ **GraphQL API:** (to be provided during project)
- ✅ **Database schema documentation:** `data-model-v2.md`
- ✅ **API documentation:** `BRYNTUM_BACKEND_SPEC.md`
- ✅ **Design system and visual specifications:** See prototype and `schedule-VISUAL_SYSTEM.md`

### Required from Consultant

- ✅ Access to development environment
- ✅ Node.js 18+ and npm/pnpm
- ✅ Git access to repository
- ✅ Development API credentials
- ✅ Understanding of GraphQL and React

---

## Risk Assessment

### Low Risk

- ✅ Prototype already working (UI is proven)
- ✅ Data model is normalized (straightforward mapping)
- ✅ GraphQL API follows standard patterns
- ✅ Clear requirements and acceptance criteria

### Medium Risk

- ⚠️ GraphQL API may need adjustments during integration
- ⚠️ Performance with large datasets (1000+ visits)
- ⚠️ Real-time subscription stability

### Mitigation

- Regular communication and API reviews
- Performance testing with realistic data volumes
- Fallback to polling if WebSocket issues occur

---

## Questions for Clarification

Before providing a quote, please confirm:

1. **API Availability:** When will the GraphQL API be available for testing?
2. **Data Volumes:** What are typical schedule sizes (visits, employees)?
3. **Performance Requirements:** Are there specific performance targets?
4. **Browser Support:** Which browsers must be supported?
5. **Mobile Support:** Is mobile/tablet support required?
6. **Testing Requirements:** What level of test coverage is expected?
7. **Deployment:** How will the code be deployed?
8. **Review Process:** What is the code review and approval process?

---

## Next Steps

1. **Review this PRD** and confirm understanding
2. **Provide Quote** with timeline and cost estimate
3. **Schedule Kickoff** meeting to discuss details
4. **Begin Implementation** once approved

---

## Contact & References

**Prototype:** [https://bryntum-vite.vercel.app](https://bryntum-vite.vercel.app)

**Related Documentation:**

- `bryntum-reference.md` - Technical implementation guide
- `Feature PRD – Bryntum Calendar View.md` - Product requirements
- `BRYNTUM_BACKEND_SPEC.md` - Complete backend API specifications
- `API_DESIGN_V2.md` - Backend API specification
- `data-model-v2.md` - Database schema
- **Alternative Approach:** If no prototype exists, see `BRYNTUM_FROM_SCRATCH_PRD.md` for building from scratch (112-152 hours)

**Questions?** Please reach out for clarification on any aspect of this PRD.

---

**Document Status:** Ready for Quote  
**Last Updated:** 2025-12-08
