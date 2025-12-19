# Bryntum Implementation Timeplan

> **Purpose:** Comprehensive timeplan for building the Caire scheduling UI with Bryntum SchedulerPro  
> **Last Updated:** 2025-01-27  
> **Production Repository:** [https://github.com/CairePlatform/beta-appcaire](https://github.com/CairePlatform/beta-appcaire)  
> **Total Estimated Time:** 8 weeks (4 weeks basic + 4 weeks all features)  
> **Related Documents:**
>
> - [Data Model v2.0](../../03-data/data-model-v2.md)
> - [Umbrella PRD](../prd-umbrella.md)
> - [Bryntum Reference](./bryntum-reference.md) - Complete catalogue of all Bryntum examples
> - [Bryntum Prototype Integration PRD](./BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md) - Reference document (prototype structure)
> - [Bryntum From Scratch PRD](./BRYNTUM_FROM_SCRATCH_PRD.md) - **Primary development guide**
> - [Backend Spec](./BRYNTUM_BACKEND_SPEC.md)
> - [Data Requirements Template](./data-requirements-template.csv) - CSV template for creating mock data for initial development
> - [Movable Visits Data Template](./movable-visits-data-template.csv) - CSV template for pre-planning/movable visits (from PDF extraction)

---

## Executive Summary

### Development Timeline

**Phase 1: Basic Features (4 weeks)**
- Foundation + Core Supply/Demand features
- Essential scheduling functionality

**Phase 2: All Features (Additional 4 weeks)**
- Enhanced tools + Advanced planning + Polish
- Complete feature set

| Phase                     | Categories      | Weeks | Hours             |
| ------------------------- | --------------- | ----- | ----------------- |
| **Phase 1: Basic**        | 1, 2, 3, 3.5, 8, 11, 12 | 4     | ~160-200          |
| **Phase 2: Complete**     | 4, 5, 6, 7, 7.5, 9, 10 | 4     | ~160-200          |
| **TOTAL**                 | 12 categories   | **8** | **~320-400 hours** |

---

## Initial Development Setup

**Mock Data for Development:** Use `data-requirements-template.csv` to create initial Bryntum JSON data files for development before backend API is available. This allows you to:

1. **Start UI development immediately** - Build Bryntum components with realistic data structure
2. **Test mapper functions** - Validate data transformation logic (CSV → Bryntum format)
3. **Develop without backend dependency** - Work on Categories 1-7 while backend is being prepared
4. **Validate data model understanding** - Ensure all required fields are mapped correctly

The CSV template includes all fields needed for visits, employees, shifts, breaks, and assignments. Convert CSV rows to Bryntum JSON format (resources, events, assignments, calendars) using the mapper functions described in `BRYNTUM_BACKEND_SPEC.md`.

---

## Supply/Demand Management Principle

All Bryntum UI features are tools for managing **supply** (employees) and **demand** (visits) to achieve optimal balance.

### Supply (Employees)

From `employees`, `employee_shifts`, `employee_breaks`, `schedule_employees` tables:

| Property                  | Table.Field                                  | Description                               |
| ------------------------- | -------------------------------------------- | ----------------------------------------- |
| **Cost - Contract Type**  | `employees.contractType`                     | full_time, part_time, hourly              |
| **Cost - Monthly Salary** | `employees.monthlySalary`                    | Fixed monthly cost                        |
| **Cost - Hourly Rate**    | `employees.hourlySalary`                     | Hourly rate for calculations              |
| **Capacity - Shifts**     | `employee_shifts.minStartTime`, `maxEndTime` | Working hours                             |
| **Capacity - Breaks**     | `employee_breaks.*`                          | Lunch, rest periods                       |
| **Skills**                | `employee_skills.skillName`, `level`         | Certifications                            |
| **Transport Mode**        | `employees.transportMode`                    | DRIVING, CYCLING, WALKING, PUBLIC_TRANSIT |
| **Service Area**          | `service_areas.id` via schedule_employees    | Geographic assignment                     |

### Demand (Visits)

From `visits`, `clients`, `visit_templates`, `solution_assignments` tables:

| Property                 | Table.Field                                         | Description               |
| ------------------------ | --------------------------------------------------- | ------------------------- |
| **Revenue**              | `service_areas.revenuePerHour`                      | Per-hour billing rate     |
| **Duration**             | `visits.duration`                                   | Minutes required          |
| **Time Windows (Hard)**  | `visits.minStartTime`, `maxStartTime`, `maxEndTime` | Must-respect constraints  |
| **Time Windows (Soft)**  | `visits.preferredTimeWindows`                       | Waiting time reduction    |
| **Skills Required**      | `visit_skills.skillName`                            | Required certifications   |
| **Preferred Caregivers** | `visit_preferences.*`                               | Client preferences        |
| **Continuity**           | `client_solution_metrics.continuityScore`           | Same caregiver %          |
| **Contact Person %**     | `client_solution_metrics.contactPersonPercentage`   | Preferred staff match     |
| **Priority**             | `visits.priority`                                   | low, normal, high, urgent |
| **Movable Status**       | `visits.isMovable`                                  | Can move across days      |
| **Pinned Status**        | `visits.pinned`                                     | Locked to employee/time   |

### Key Distinction: Movable vs Pinned

| Flag        | Scope            | Description                                          | Used For                   |
| ----------- | ---------------- | ---------------------------------------------------- | -------------------------- |
| `isMovable` | Planning horizon | Recurring visit with lifecycle, can move across days | Demand balancing over time |
| `pinned`    | Single schedule  | Locked to specific employee/time                     | Optimization control       |

- **Movable visits** = flexible demand for long-term balancing (usually non-mandatory)
- **Pinned visits** = frozen in optimization (optimizer respects assignment)
- **Unpinned visits** = can be optimized (moved, reassigned)

### Resource Management Rules

1. **NEVER delete** employees or clients from database - only add/remove from schedule instances
2. **Add Employee**: Fetch available from DB (per service area, with constraints)
3. **Add Visit**: Fetch from DB or create new (some can exist only within schedule)
4. **New Clients/Visits**: Create from "add new client", "movable visits", "pre-planning"

### Save Options (All Changes)

| Option                 | Scope            | Effect                                           |
| ---------------------- | ---------------- | ------------------------------------------------ |
| **This instance only** | Current schedule | Change applies only here                         |
| **Save as template**   | Future schedules | Update all future slingor and/or visit templates |

### Optimization Behavior

- **Unpinned visits**: Can be optimized (moved, reassigned)
- **Pinned visits**: Frozen (optimizer respects current assignment)

---

## Category 1: Core Schedule Viewing & Navigation

**Use Case:** View Daily/Weekly/Monthly Schedule to assess supply/demand balance  
**Priority:** P0 (Critical - Foundation)  
**Estimated Time:** 1-1.5 days (8-12 hours)  
**Dependencies:** None

**Reference Documents:**

- Data Model: See `data-model-v2.md` (schedules, visits, employees, employee_shifts tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (GraphQL queries section)
- Implementation: See `BRYNTUM_FROM_SCRATCH_PRD.md` (Phase 1) or `BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md` (Phase 1: Prototype Integration - copy components from prototype)
- Mock Data: Use `data-requirements-template.csv` to create initial Bryntum JSON data for development before backend is available

### Bryntum Examples

| Example         | URL                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Timeline        | [timeline](https://bryntum.com/products/schedulerpro/examples/timeline/)                         |
| Columns         | [columns](https://bryntum.com/products/schedulerpro/examples-scheduler/columns/)                 |
| Row Height      | [rowheight](https://bryntum.com/products/schedulerpro/examples-scheduler/rowheight/)             |
| Configuration   | [configuration](https://bryntum.com/products/schedulerpro/examples-scheduler/configuration/)     |
| Time Resolution | [timeresolution](https://bryntum.com/products/schedulerpro/examples-scheduler/timeresolution/)   |
| Infinite Scroll | [infinite-scroll](https://bryntum.com/products/schedulerpro/examples-scheduler/infinite-scroll/) |

### Features

| Feature                                            | Hours |
| -------------------------------------------------- | ----- |
| Timeline view with drag & drop                     | 2     |
| Employee columns (name, role, contract, transport) | 1     |
| View presets (1 day, 3 days, 1 week)               | 1     |
| Zoom in/out controls                               | 0.5   |
| Infinite scroll for long horizons                  | 0.5   |
| Row height adjustment                              | 0.25  |
| Swedish localization                               | 1     |

### Acceptance Criteria

- [ ] Schedule loads within 2 seconds for 100+ visits
- [ ] Can view daily, 3-day, and weekly views
- [ ] Employee columns show: name, role, arbetstid (HH:mm), contract type, transport mode
- [ ] Zoom controls work smoothly
- [ ] UI is fully localized in Swedish

---

## Category 2: Visit Assignment & Management

**Use Case:** Assign Unplanned Visits (Demand) to Employees (Supply)  
**Priority:** P0 (Critical - Core functionality)  
**Estimated Time:** 1.5-2 days (12-16 hours)  
**Dependencies:** Category 1

**Reference Documents:**

- Data Model: See `data-model-v2.md` (visits, solution_assignments, visit_skills, employee_skills tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Data Flow: Save Schedule Changes)
- Implementation: See `BRYNTUM_FROM_SCRATCH_PRD.md` (Phase 2) or `BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md` (Phase 2: GraphQL Integration)

### Bryntum Examples

| Example                      | URL                                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Drag Unplanned Tasks         | [drag-unplanned-tasks](https://bryntum.com/products/schedulerpro/examples/drag-unplanned-tasks/)                 |
| Drag From Grid               | [drag-from-grid](https://bryntum.com/products/schedulerpro/examples/drag-from-grid/)                             |
| Skill Matching               | [skill-matching](https://bryntum.com/products/schedulerpro/examples/skill-matching/)                             |
| Highlight Event Calendars    | [highlight-event-calendars](https://bryntum.com/products/schedulerpro/examples/highlight-event-calendars/)       |
| Highlight Resource Calendars | [highlight-resource-calendars](https://bryntum.com/products/schedulerpro/examples/highlight-resource-calendars/) |

### Features

| Feature                             | Hours |
| ----------------------------------- | ----- |
| Unplanned visits panel (Oplanerade) | 2     |
| Drag from panel to employee row     | 2     |
| Skill matching validation           | 2     |
| Highlight valid employees on drag   | 1     |
| Travel time display (eventBuffer)   | 2     |
| Validation messages                 | 1     |

### Acceptance Criteria

- [ ] Unplanned visits panel shows count and list
- [ ] Drag from panel assigns visit to employee
- [ ] Invalid assignments (skill mismatch) are blocked with explanation
- [ ] Valid drop targets are highlighted during drag
- [ ] Travel time shows before/after visits with transport mode icon

---

## Category 3: Visit CRUD Operations (Demand Management)

**Use Case:** Create, Read, Update, Delete Visits to manage demand  
**Priority:** P0 (Critical - Core functionality)  
**Estimated Time:** 2.5-3 days (20-24 hours)  
**Dependencies:** Category 1, 2

**Reference Documents:**

- Data Model: See `data-model-v2.md` (visits, clients, visit_skills, visit_templates tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Data Flow: Save Schedule Changes, Mapper Functions)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 3)

### Bryntum Examples

| Example         | URL                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Task Editor     | [taskeditor](https://bryntum.com/products/schedulerpro/examples/taskeditor/)                     |
| Event Menu      | [eventmenu](https://bryntum.com/products/schedulerpro/examples-scheduler/eventmenu/)             |
| Custom Tooltips | [custom-tooltips](https://bryntum.com/products/schedulerpro/examples-scheduler/custom-tooltips/) |
| Constraints     | [constraints](https://bryntum.com/products/schedulerpro/examples/constraints/)                   |
| Validation      | [validation](https://bryntum.com/products/schedulerpro/examples-scheduler/validation/)           |
| Event Styles    | [eventstyles](https://bryntum.com/products/schedulerpro/examples-scheduler/eventstyles/)         |
| Recurrence      | [recurrence](https://bryntum.com/products/schedulerpro/examples/recurrence/)                     |

### Features

| Feature                                | Hours |
| -------------------------------------- | ----- |
| Double-click to edit visit             | 2     |
| Right-click context menu               | 1     |
| Visit tooltip with full details        | 1     |
| Status color coding (6 statuses)       | 1     |
| Pin/unpin toggle with lock icon        | 1     |
| Time window constraints                | 2     |
| Movable visit indicator (🔄)           | 1     |
| Edit all demand properties             | 3     |
| Save options UI (instance vs template) | 2     |
| Create new visit within schedule       | 2     |
| Delete visit from schedule             | 1     |
| Recurrence pattern editing             | 2     |

### Acceptance Criteria

- [ ] Can edit all visit properties in dialog
- [ ] Can pin/unpin visits with visual feedback
- [ ] Status colors distinguish 6 visit types
- [ ] Time windows are enforced during drag/resize
- [ ] Save options allow instance vs template scope
- [ ] Movable visits show recurrence indicator

---

## Category 3.5: Employee CRUD Operations (Supply Management)

**Use Case:** Add/Remove/Edit Employees in schedule to manage supply  
**Priority:** P0 (Critical - Core functionality)  
**Estimated Time:** 2-2.5 days (16-20 hours)  
**Dependencies:** Category 1, 3

**Reference Documents:**

- Data Model: See `data-model-v2.md` (employees, schedule_employees, employee_shifts, employee_breaks, employee_skills tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Data Flow: Save Schedule Changes, Resource Management Rules)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 3)

**Note:** NEVER delete employees from database - only add/remove from schedule instances. See Supply/Demand Management Principle section for details.

### Bryntum Examples

| Example                   | URL                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Resource Non-Working Time | [resource-non-working-time](https://bryntum.com/products/schedulerpro/examples/resource-non-working-time/) |
| Resource Time Ranges      | [resourcetimeranges](https://bryntum.com/products/schedulerpro/examples-scheduler/resourcetimeranges/)     |
| Non-Working Time          | [non-working-time](https://bryntum.com/products/schedulerpro/examples/non-working-time/)                   |
| Grouping                  | [grouping](https://bryntum.com/products/schedulerpro/examples/grouping/)                                   |
| Calendar Editor           | [calendar-editor](https://bryntum.com/products/schedulerpro/examples/calendar-editor/)                     |

### Features

| Feature                                    | Hours |
| ------------------------------------------ | ----- |
| Employee management modal (CRUD)           | 3     |
| Group by role/contract/transport           | 1     |
| Non-working time toggle (🌙 Natt/helg)     | 0.5   |
| Break toggle (☕ Pauser)                   | 0.5   |
| Skill filter (🎯 Kompetens)                | 1     |
| Contract type columns (Heltid/Timanställd) | 0.5   |
| Add employee to schedule                   | 2     |
| Remove employee from schedule              | 1     |
| Edit shift times                           | 2     |
| Edit breaks                                | 2     |
| Edit skills                                | 2     |
| Save options UI (instance vs template)     | 2     |
| Cost display (salary info)                 | 1     |

### Acceptance Criteria

- [ ] Can add existing employees to schedule (not create new)
- [ ] Can remove employees from schedule (not delete from DB)
- [ ] Can edit shift times for employees in schedule
- [ ] Can edit breaks for employees in schedule
- [ ] Cost information (salary) is displayed
- [ ] Save options allow instance vs template scope
- [ ] Group by role/contract/transport works

---

## Category 4: Cross-Service Area Integration

**Use Case:** Optimize across multiple service areas to balance supply/demand  
**Priority:** P1 (High - Important for efficiency)  
**Estimated Time:** 1-1.5 days (8-12 hours)  
**Dependencies:** Category 1, 3, 3.5

**Reference Documents:**

- Data Model: See `data-model-v2.md` (service_areas, service_area_solution_metrics tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Data Flow: Save Schedule Changes)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 4)

### Bryntum Examples

| Example                 | URL                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Drag Between Schedulers | [drag-between-schedulers](https://bryntum.com/products/schedulerpro/examples-scheduler/drag-between-schedulers/) |
| Multi Groups            | [multi-groups](https://bryntum.com/products/schedulerpro/examples-scheduler/multi-groups/)                       |
| Grouping                | [grouping](https://bryntum.com/products/schedulerpro/examples/grouping/)                                         |
| Field Filters           | [fieldfilters](https://bryntum.com/products/schedulerpro/examples-scheduler/fieldfilters/)                       |

### Features

| Feature                            | Hours |
| ---------------------------------- | ----- |
| Service area filter (multi-select) | 2     |
| Group by service area              | 1     |
| Cross-area visit assignment        | 3     |
| Cross-area employee sharing        | 2     |
| Area boundary visualization        | 2     |
| Multi-area optimization trigger    | 2     |

### Acceptance Criteria

- [ ] Can filter schedule by one or multiple service areas
- [ ] Can drag visits between service areas with validation
- [ ] Can assign employees to work in multiple areas
- [ ] Travel time impact is shown when crossing areas
- [ ] Multi-area optimization considers all selected areas

---

## Category 5: Schedule Filtering & Search

**Use Case:** Filter and Search to analyze supply/demand balance  
**Priority:** P1 (High - Important for usability)  
**Estimated Time:** 0.75-1 day (6-8 hours)  
**Dependencies:** Category 1

**Reference Documents:**

- Data Model: See `data-model-v2.md` (visits, employees, employee_skills, service_areas tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (GraphQL Operations)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 4)

### Bryntum Examples

| Example       | URL                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------ |
| Field Filters | [fieldfilters](https://bryntum.com/products/schedulerpro/examples-scheduler/fieldfilters/) |
| Layers        | [layers](https://bryntum.com/products/schedulerpro/examples-scheduler/layers/)             |
| Filtering     | [filtering](https://bryntum.com/products/schedulerpro/examples-scheduler/filtering/)       |

### Features

| Feature                      | Hours |
| ---------------------------- | ----- |
| Filter by visit status       | 1     |
| Filter by mandatory/optional | 0.5   |
| Filter by priority           | 0.5   |
| Filter by movable status     | 0.5   |
| Filter by pinned status (🔒) | 0.5   |
| Filter by employee skills    | 1     |
| Filter by service area       | 1     |
| Search by visit/client name  | 1     |
| Layers (toggle visit types)  | 1     |

### Acceptance Criteria

- [ ] Can filter by all visit status types
- [ ] Can filter by pinned/unpinned
- [ ] Can filter by movable/fixed
- [ ] Can filter by employee skills
- [ ] Can search by visit or client name
- [ ] Filters use OR logic for multiple selections

---

## Category 6: Schedule & Service Area Comparison

**Use Case:** Compare schedules and service areas for supply/demand balance evaluation and rebalancing  
**Priority:** P1 (High - Important for optimization workflow)  
**Estimated Time:** 2-2.5 days (16-20 hours)  
**Dependencies:** Category 1, 4, 8

**Reference Documents:**

- Data Model: See `data-model-v2.md` (schedules, solutions, solution_metrics, service_area_solution_metrics tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Metrics Calculation & Display section)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 5)

**Note:** Supports split view (side-by-side) and multiple rows comparison. Can compare schedule types (planned vs optimized), revisions, and service areas. Includes drag & drop rebalancing between areas with validation.

### Bryntum Examples

| Example                 | URL                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Planned vs Actual       | [planned-vs-actual](https://bryntum.com/products/schedulerpro/examples/planned-vs-actual/)                       |
| Partners                | [partners](https://bryntum.com/products/schedulerpro/examples-scheduler/partners/)                               |
| Split                   | [split](https://bryntum.com/products/schedulerpro/examples-scheduler/split/)                                     |
| Drag Between Schedulers | [drag-between-schedulers](https://bryntum.com/products/schedulerpro/examples-scheduler/drag-between-schedulers/) |

### Features

| Feature                                         | Hours |
| ----------------------------------------------- | ----- |
| Compare button (🔀 Jämför)                      | 0.5   |
| Split view layout                               | 2     |
| Multiple rows comparison                        | 2     |
| Schedule type comparison (planned vs optimized) | 3     |
| Revision comparison                             | 2     |
| Service area comparison                         | 3     |
| Metrics delta display                           | 2     |
| Delta highlighting (changed visits)             | 2     |
| Drag between areas with validation              | 3     |
| Cost/Revenue/Profit per area                    | 2     |

### Acceptance Criteria

- [ ] Can compare planned vs optimized schedules
- [ ] Can compare two service areas
- [ ] Metrics delta is displayed with +/- indicators
- [ ] Changed visits are highlighted
- [ ] Can drag visits/employees between areas with validation
- [ ] Split view and multiple rows view both work

---

## Category 7: Analytics & Metrics Display

**Use Case:** View supply/demand metrics and analytics to identify imbalances  
**Priority:** P1 (High - Important for decision making)  
**Estimated Time:** 1.5-2 days (12-16 hours)  
**Dependencies:** Category 1, Backend API

**Reference Documents:**

- Data Model: See `data-model-v2.md` (solution_metrics, employee_solution_metrics, client_solution_metrics, service_area_solution_metrics tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Metrics Calculation & Display section)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 6)

**Note:** All metrics are calculated and stored in backend. Frontend only displays pre-calculated metrics from database.

### Bryntum Examples

| Example              | URL                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Resource Histogram   | [resourcehistogram](https://bryntum.com/products/schedulerpro/examples/resourcehistogram/)           |
| Resource Utilisation | [resourceutilization](https://bryntum.com/products/schedulerpro/examples/resourceutilization/)       |
| Timeline Histogram   | [timelinehistogram](https://bryntum.com/products/schedulerpro/examples-scheduler/timelinehistogram/) |
| Embedded Chart       | [embedded-chart](https://bryntum.com/products/schedulerpro/examples/embedded-chart/)                 |
| Charts & Sparklines  | [charts](https://bryntum.com/products/schedulerpro/examples-scheduler/charts/)                       |
| Tree Summary Heatmap | [tree-summary-heatmap](https://bryntum.com/products/schedulerpro/examples/tree-summary-heatmap/)     |

### Features

| Feature                           | Hours |
| --------------------------------- | ----- |
| KPI metrics panel (📊 KPI)        | 2     |
| Resource histogram (capacity)     | 2     |
| Resource utilization per employee | 2     |
| Timeline histogram (demand curve) | 2     |
| Efficiency percentage display     | 1     |
| Supply hours total                | 0.5   |
| Demand hours total                | 0.5   |
| Balance indicator                 | 1     |
| Unassigned visits count           | 0.5   |
| Continuity score                  | 1     |
| Sparkline trends                  | 2     |

### Acceptance Criteria

- [ ] Efficiency percentage is displayed prominently
- [ ] Supply and demand hours are visible
- [ ] Balance indicator shows surplus/deficit
- [ ] Per-employee utilization is shown
- [ ] Demand curve shows visit hours per time slot
- [ ] Continuity score is calculated and displayed

---

## Category 7.5: Advanced Scheduling Features

**Use Case:** Display working hours, breaks, and dependencies to visualize supply constraints  
**Priority:** P2 (Medium - Nice to have)  
**Estimated Time:** 0.75-1 day (6-8 hours)  
**Dependencies:** Category 1

**Reference Documents:**

- Data Model: See `data-model-v2.md` (employee_shifts, employee_breaks tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Mapper Functions: mapEmployeeToCalendar)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 7)

### Bryntum Examples

| Example              | URL                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Non-Working Time     | [non-working-time](https://bryntum.com/products/schedulerpro/examples/non-working-time/)               |
| Time Ranges          | [resourcetimeranges](https://bryntum.com/products/schedulerpro/examples-scheduler/resourcetimeranges/) |
| Working Time         | [workingtime](https://bryntum.com/products/schedulerpro/examples-scheduler/workingtime/)               |
| Highlight Time Spans | [highlight-time-spans](https://bryntum.com/products/schedulerpro/examples/highlight-time-spans/)       |

### Features

| Feature                        | Hours |
| ------------------------------ | ----- |
| Non-working time shading       | 1     |
| Lunch break visualization      | 1     |
| Time window highlighting       | 2     |
| Shift boundaries               | 1     |
| Dependencies (visit sequences) | 2     |

---

## Category 8: Real-time Optimization

**Use Case:** Run and Monitor AI Optimization to automatically balance supply and demand  
**Priority:** P0 (Critical - Core value proposition)  
**Estimated Time:** 1-1.5 days (8-12 hours)  
**Dependencies:** Category 1, Backend API, GraphQL Integration

### Data Model References

| Table                  | Fields Used                             | Purpose               |
| ---------------------- | --------------------------------------- | --------------------- |
| `solutions`            | status, submittedAt, completedAt, score | Job tracking          |
| `scenarios`            | name, configData, isDefault             | Optimization settings |
| `solver_configs`       | configJson                              | Timefold parameters   |
| `solution_assignments` | After optimization                      | Results               |
| `solution_events`      | After optimization                      | Event log             |

### Bryntum Examples

| Example    | URL                                                                                    | Implementation    |
| ---------- | -------------------------------------------------------------------------------------- | ----------------- |
| WebSockets | [websockets](https://bryntum.com/products/schedulerpro/examples-scheduler/websockets/) | Real-time updates |

### Features

| Feature                          | Hours | Implementation Notes                                                       |
| -------------------------------- | ----- | -------------------------------------------------------------------------- |
| Optimization button              | 1     | Button to trigger optimization job via GraphQL mutation                    |
| Scenario selection modal         | 2     | Modal with 5 preset scenarios (A-E) plus custom option                     |
| Editable scenario settings       | 2     | UI to edit scenario weights and constraints                                |
| Progress bar during optimization | 2     | Progress bar updated via WebSocket subscription                            |
| Real-time schedule updates       | 3     | Automatically update schedule when optimization completes (WebSocket push) |
| Error handling                   | 1     | Display errors gracefully when optimization job fails                      |
| Job status polling (fallback)    | 1     | Poll job status if WebSocket connection fails                              |

### Optimization Scenarios

| Scenario       | Description     | Weights                 |
| -------------- | --------------- | ----------------------- |
| A - Balanced   | Default balance | 50/50/50                |
| B - Efficiency | Minimize travel | Travel: 80, Service: 60 |
| C - Continuity | Same caregivers | Continuity: 90          |
| D - Speed      | Fast completion | Termination: 60s        |
| E - Cost       | Minimize cost   | Cost: 90                |
| Custom         | User-defined    | Editable                |

### Acceptance Criteria

- [ ] Can select optimization scenario
- [ ] Progress is shown during optimization
- [ ] Schedule updates automatically when complete
- [ ] Errors are displayed gracefully
- [ ] Can cancel running optimization

---

## Category 9: Pre-Planning & Movable Visits

**Use Case:** Plan Weekly/Monthly Schedules with Movable Visits across time horizon  
**Priority:** P1 (High - Advanced feature)  
**Estimated Time:** 3-4 days (24-32 hours)  
**Dependencies:** Category 1, 2, 3, 3.5, 4, 7, 8

**Reference Documents:**

- Data Model: See `data-model-v2.md` (visit_templates, schedule_groups, templates, monthly_allocations tables)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Data Flow: Pre-Planning Data Flow)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 9)

**Note:** Supports 1-12 week planning horizons. Includes movable visit lifecycle management, supply/demand balance dashboard, unused hours tracking, and two-stage pre-planning optimization.

### Bryntum Examples

| Example              | URL                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Timeline             | [timeline](https://bryntum.com/products/schedulerpro/examples/timeline/)                             |
| Timeline Histogram   | [timelinehistogram](https://bryntum.com/products/schedulerpro/examples-scheduler/timelinehistogram/) |
| Recurrence           | [recurrence](https://bryntum.com/products/schedulerpro/examples/recurrence/)                         |
| Drag Unplanned Tasks | [drag-unplanned-tasks](https://bryntum.com/products/schedulerpro/examples/drag-unplanned-tasks/)     |
| Highlight Time Spans | [highlight-time-spans](https://bryntum.com/products/schedulerpro/examples/highlight-time-spans/)     |
| Tree Summary Heatmap | [tree-summary-heatmap](https://bryntum.com/products/schedulerpro/examples/tree-summary-heatmap/)     |

### Features

| Feature                           | Hours |
| --------------------------------- | ----- |
| Multi-week timeline view          | 4     |
| Movable visits panel              | 4     |
| Lifecycle status indicators       | 2     |
| Demand curve visualization        | 4     |
| Supply capacity overlay           | 3     |
| Capacity heatmap                  | 3     |
| Unused hours tracking             | 3     |
| Optimal placement recommendations | 4     |
| Drag movable to day               | 3     |
| Convert to fixed visit            | 2     |
| Pre-planning optimization         | 4     |
| Schedule health dashboard         | 4     |

### Acceptance Criteria

- [ ] Can view multi-week timeline (1-12 weeks)
- [ ] Movable visits are shown with lifecycle status
- [ ] Demand/supply curves are visualized
- [ ] Can drag movable visits to specific days
- [ ] AI recommendations are shown
- [ ] Can convert to fixed visits
- [ ] Unused hours are tracked per client

---

## Category 10: Export & Reporting

**Use Case:** Export Schedules to Various Formats  
**Priority:** P2 (Medium - Nice to have)  
**Estimated Time:** 0.75-1 day (6-8 hours)  
**Dependencies:** Category 1

**Reference Documents:**

- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (REST Endpoints: File Operations)
- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 10)

### Bryntum Examples

| Example             | URL                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Export              | [export](https://bryntum.com/products/schedulerpro/examples-scheduler/export/)               |
| Print               | [print](https://bryntum.com/products/schedulerpro/examples-scheduler/print/)                 |
| Export to Excel     | [exporttoexcel](https://bryntum.com/products/schedulerpro/examples-scheduler/exporttoexcel/) |
| Export to iCalendar | [exporttoics](https://bryntum.com/products/schedulerpro/examples-scheduler/exporttoics/)     |

### Features

| Feature                     | Hours |
| --------------------------- | ----- |
| Export menu (💾 Exportera)  | 0.5   |
| Export to PDF               | 1     |
| Export to Excel             | 1     |
| Print                       | 0.5   |
| Export to iCalendar         | 1     |
| Export with filters applied | 1     |
| Custom report generation    | 2     |

### Acceptance Criteria

- [ ] Can export to PDF with current view
- [ ] Can export to Excel with all data
- [ ] Can print schedule
- [ ] Export respects current filters

---

## Category 11: Integration & Infrastructure

**Use Case:** Backend Integration and Data Transformation  
**Priority:** P0 (Critical - Foundation)  
**Estimated Time:** 2-2.5 days (16-20 hours)  
**Dependencies:** Backend API availability

**Reference Documents:**

- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (GraphQL Operations Overview, Mapper Functions Required sections)
- Implementation: See `BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md` (Phase 2: GraphQL Integration)
- Mock Data: Use `data-requirements-template.csv` to create test data and validate mapper functions before backend integration

**Note:** Includes GraphQL client setup, all mapper functions (schedule, employee, visit, assignment, metrics), change tracking, save handlers, and error handling. See BRYNTUM_BACKEND_SPEC.md for complete list of required GraphQL operations and mapper specifications. Use the data requirements template CSV to create mock Bryntum JSON data for initial development and mapper testing.

### Features

| Feature                  | Hours |
| ------------------------ | ----- |
| GraphQL client setup     | 2     |
| Schedule data mapper     | 4     |
| Employee/Resource mapper | 2     |
| Visit/Event mapper       | 3     |
| Assignment mapper        | 1     |
| Metrics mapper           | 2     |
| Change tracking          | 2     |
| Save handler             | 2     |
| Optimization handler     | 2     |
| Error handling           | 2     |

### Acceptance Criteria

- [ ] Schedule loads from real database
- [ ] Changes are saved to database
- [ ] Optimization connects to Timefold
- [ ] Real-time updates work via WebSocket
- [ ] Errors are handled gracefully

---

## Category 12: Testing & Documentation

**Use Case:** Comprehensive Testing and Documentation  
**Priority:** P0 (Critical - Quality assurance)  
**Estimated Time:** 1.5-2 days (12-16 hours)  
**Dependencies:** All categories

**Reference Documents:**

- Implementation: See `BRYNTUM_MAIN_PRD.md` (Phase 11: Testing & Documentation)
- Backend API: See `BRYNTUM_BACKEND_SPEC.md` (Error Handling, Performance Considerations)

**Note:** Testing includes unit tests (Vitest), integration tests (Vitest), E2E tests (Playwright), and visual regression tests. Documentation includes API documentation and Swedish user guide.

### Features

| Feature                     | Hours |
| --------------------------- | ----- |
| Unit tests for mappers      | 3     |
| Integration tests for hooks | 3     |
| E2E test: Create schedule   | 2     |
| E2E test: Assign visits     | 2     |
| E2E test: Run optimization  | 2     |
| E2E test: Compare schedules | 2     |
| API documentation           | 2     |
| User documentation          | 2     |

### Acceptance Criteria

- [ ] > 80% unit test coverage for mappers
- [ ] All critical workflows have E2E tests
- [ ] API is documented
- [ ] User guide is available in Swedish

---

## Priority Matrix

### P0 - Critical (Must Have for MVP)

| Category     | Name                         | Days          | Hours      |
| ------------ | ---------------------------- | ------------- | ---------- |
| 1            | Core Schedule Viewing        | 1-1.5         | 8-12       |
| 2            | Visit Assignment             | 1.5-2         | 12-16      |
| 3            | Visit CRUD                   | 2.5-3         | 20-24      |
| 3.5          | Employee CRUD                | 2-2.5         | 16-20      |
| 8            | Real-time Optimization       | 1-1.5         | 8-12       |
| 11           | Integration & Infrastructure | 2-2.5         | 16-20      |
| 12           | Testing & Documentation      | 1.5-2         | 12-16      |
| **Total P0** |                              | **11.5-14.5** | **92-120** |

### P1 - High (Important for Full Feature Set)

| Category     | Name               | Days        | Hours     |
| ------------ | ------------------ | ----------- | --------- |
| 4            | Cross-Service Area | 1-1.5       | 8-12      |
| 5            | Filtering & Search | 0.75-1      | 6-8       |
| 6            | Comparison         | 2-2.5       | 16-20     |
| 7            | Analytics          | 1.5-2       | 12-16     |
| 9            | Pre-Planning       | 3-4         | 24-32     |
| **Total P1** |                    | **8.25-11** | **66-88** |

### P2 - Medium (Nice to Have)

| Category     | Name               | Days      | Hours     |
| ------------ | ------------------ | --------- | --------- |
| 7.5          | Advanced Features  | 0.75-1    | 6-8       |
| 10           | Export & Reporting | 0.75-1    | 6-8       |
| **Total P2** |                    | **1.5-2** | **12-16** |

---

## Timeline & Milestones

```
Days 1-3: Foundation (Categories 1, 11) - 2-3 days (16-24 hours)
├── Set up Bryntum in app
├── Implement basic timeline
├── Create GraphQL hooks
└── Build core mappers

Days 4-8: Core Supply/Demand (Categories 2, 3, 3.5, 8) - 4-5 days (32-40 hours)
├── Unplanned visits panel
├── Drag & drop assignment
├── Visit CRUD operations
├── Employee CRUD operations
├── Optimization integration
└── Save options (instance vs template)

Days 9-12: Enhanced Tools (Categories 4, 5, 6, 7, 7.5) - 3-4 days (24-32 hours)
├── Cross-service area
├── Filtering & search
├── Comparison mode
├── Analytics & metrics
└── Advanced features

Days 13-16: Advanced Planning (Category 9) - 3-4 days (24-32 hours)
├── Multi-week timeline
├── Movable visits management
├── Demand/supply visualization
├── Pre-planning optimization
└── Unused hours tracking

Days 17-19: Polish (Categories 10, 12) - 2-3 days (16-24 hours)
├── Export features
├── Testing
├── Documentation
└── Bug fixes
```

---

## Risk Assessment

### High Risk

| Risk                        | Impact                 | Mitigation                     |
| --------------------------- | ---------------------- | ------------------------------ |
| WebSocket connection issues | Real-time updates fail | Implement polling fallback     |
| Complex data mapping        | Incorrect display      | Extensive unit tests           |
| Cross-area validation       | Invalid assignments    | Comprehensive validation rules |

### Medium Risk

| Risk                             | Impact           | Mitigation                      |
| -------------------------------- | ---------------- | ------------------------------- |
| Performance with large schedules | Slow UI          | Virtual scrolling, lazy loading |
| Comparison mode complexity       | Delayed delivery | Start simple, iterate           |
| Pre-planning scope               | Feature creep    | Strict MVP definition           |

### Low Risk

| Risk              | Impact            | Mitigation            |
| ----------------- | ----------------- | --------------------- |
| Export features   | Minor delay       | Use Bryntum built-ins |
| Localization gaps | Some English text | Translation review    |

---

## Success Metrics

| Metric              | Target         | Measurement             |
| ------------------- | -------------- | ----------------------- |
| Page Load Time      | < 2 seconds    | Performance monitoring  |
| Drag & Drop Latency | < 100ms        | User testing            |
| Optimization Time   | < 3 minutes    | Job completion tracking |
| User Efficiency     | 50% time saved | Before/after comparison |
| Error Rate          | < 1%           | Error tracking          |

---

## Summary

**Total Estimated Time:** 14-19 working days (112-152 hours)

**Priority Breakdown:**

- **P0 (Critical - MVP):** 11.5-14.5 days (92-120 hours) - Must have
- **P1 (High):** 8.25-11 days (66-88 hours) - Important, can defer if needed
- **P2 (Medium):** 1.5-2 days (12-16 hours) - Nice to have, can remove

**Timeline:** Sequential phases with some parallel work possible. Total calendar time: 14-19 days.

---

## Appendix: Bryntum Example URLs

**Note:** This is a subset of examples used in the timeplan. For the complete catalogue of all Bryntum examples with detailed notes on how they map to Caire features, see `bryntum-reference.md`.

### Examples Referenced in Timeplan

**Core Examples:**

- Timeline: https://bryntum.com/products/schedulerpro/examples/timeline/
- Drag Unplanned: https://bryntum.com/products/schedulerpro/examples/drag-unplanned-tasks/
- Task Editor: https://bryntum.com/products/schedulerpro/examples/taskeditor/
- Event Menu: https://bryntum.com/products/schedulerpro/examples-scheduler/eventmenu/
- Skill Matching: https://bryntum.com/products/schedulerpro/examples/skill-matching/

**Comparison & Analytics:**

- Planned vs Actual: https://bryntum.com/products/schedulerpro/examples/planned-vs-actual/
- Partners: https://bryntum.com/products/schedulerpro/examples-scheduler/partners/
- Resource Histogram: https://bryntum.com/products/schedulerpro/examples/resourcehistogram/
- Timeline Histogram: https://bryntum.com/products/schedulerpro/examples-scheduler/timelinehistogram/

**Advanced Features:**

- Nested Events: https://bryntum.com/products/schedulerpro/examples/nested-events/
- Recurrence: https://bryntum.com/products/schedulerpro/examples/recurrence/
- WebSockets: https://bryntum.com/products/schedulerpro/examples-scheduler/websockets/
- Maps: https://bryntum.com/products/schedulerpro/examples/maps/

**Export:**

- Export: https://bryntum.com/products/schedulerpro/examples-scheduler/export/
- Print: https://bryntum.com/products/schedulerpro/examples-scheduler/print/
- Excel: https://bryntum.com/products/schedulerpro/examples-scheduler/exporttoexcel/

**Additional Examples (see bryntum-reference.md for full list):**

- Undo/Redo, State, Multi Assign, Travel Time, Custom Layouts, Localization, and 50+ more examples are documented in `bryntum-reference.md` with notes on how they map to Caire features.

---

_Document generated based on Caire platform requirements and Bryntum SchedulerPro capabilities._
