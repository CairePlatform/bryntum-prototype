# Bryntum Implementation Documentation

This directory contains comprehensive documentation for implementing the Bryntum SchedulerPro scheduling UI for the Caire platform.

## Overview

The task is to **build a complete, production-ready Bryntum SchedulerPro scheduling calendar** that integrates with the Caire backend API.

### Development Approach

**This repository (`bryntum-prototype`) serves as a reference and UX prototype** for:
- UX/UI design discussions and decisions
- Demonstrating feature requirements and interactions
- Providing visual reference for the development team
- Testing Bryntum component configurations and patterns

**Production development** will start **from scratch** in the private repository:
- **Repository:** [https://github.com/CairePlatform/beta-appcaire](https://github.com/CairePlatform/beta-appcaire)
- **Timeline:** 
  - **Phase 1 (Basic Features):** 4 weeks
  - **Phase 2 (All Features):** Additional 4 weeks (8 weeks total)
- **Approach:** Build using Bryntum examples and best practices, referencing this prototype for UX guidance

## Quick Start Guide

### For Developers Building in beta-appcaire

1. **Review This Prototype:**
   - Explore the live demo: [https://bryntum-vite.vercel.app](https://bryntum-vite.vercel.app)
   - Review this repository's code structure and components
   - Use as UX/UI reference for design decisions
   - Understand feature requirements and interactions

2. **Read the Implementation Guide:**
   - **Primary Document:** [BRYNTUM_FROM_SCRATCH_PRD.md](./BRYNTUM_FROM_SCRATCH_PRD.md) - Complete build guide
   - **Reference Document:** [BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md](./BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md) - For understanding prototype structure (not for integration)

3. **Understand the Backend:**
   - Read [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md) for complete API specifications
   - Review data flow patterns and mapper requirements

4. **Plan Your Work:**
   - Use [bryntum_timeplan.md](./bryntum_timeplan.md) for detailed task breakdown
   - Reference [bryntum-reference.md](./bryntum-reference.md) for Bryntum example mappings
   - **Timeline:** 4 weeks for basic features, then up to 4 more weeks for all features

5. **Start Development (Before Backend is Ready):**
   - Use existing mockup data in `public/data/2.0/` (see Mockup Data section below)
   - Use [data-requirements-template.csv](./data-requirements-template.csv) to create additional mock data
   - Use [movable-visits-data-template.csv](./movable-visits-data-template.csv) for pre-planning features
   - Build UI components independently while backend is being developed

## Documentation Structure

### Core Requirements & Planning

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[BRYNTUM_FROM_SCRATCH_PRD.md](./BRYNTUM_FROM_SCRATCH_PRD.md)** | Complete PRD for building from scratch (4 weeks basic, +4 weeks all features) | **Primary guide for production development** |
| **[BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md](./BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md)** | Reference guide for understanding prototype structure | For understanding prototype code (not for integration) |
| **[bryntum_timeplan.md](./bryntum_timeplan.md)** | Detailed task breakdown by category with time estimates | Planning phase - understand scope |
| **[bryntum-reference.md](./bryntum-reference.md)** | Complete catalogue of Bryntum examples mapped to Caire features | Implementation phase - find examples |

### Backend Integration

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md)** | Complete backend API specifications, data flows, mappers | Before integration - understand API |
| **[data-requirements-template.csv](./data-requirements-template.csv)** | CSV template for creating mock data | Early development - create test data |
| **[movable-visits-data-template.csv](./movable-visits-data-template.csv)** | CSV template for pre-planning/movable visits | Pre-planning features development |
| **Mockup Data (2.0)** | Pre-built mockup data files in `public/data/2.0/` | Development and testing - see Mockup Data section |

## Implementation Approach

### Production Development Strategy

**Repository:** [https://github.com/CairePlatform/beta-appcaire](https://github.com/CairePlatform/beta-appcaire) (private)

**Timeline:**
- **Phase 1 (Basic Features):** 4 weeks
- **Phase 2 (All Features):** Additional 4 weeks (8 weeks total)

**Primary Document:** [BRYNTUM_FROM_SCRATCH_PRD.md](./BRYNTUM_FROM_SCRATCH_PRD.md)

**Process:**
1. Start fresh in beta-appcaire repository
2. Build core calendar using Bryntum examples and best practices
3. Reference this prototype (`bryntum-prototype`) for UX/UI guidance
4. Add features incrementally (drag-drop, filters, optimization)
5. Connect to GraphQL API
6. Implement all phases from PRD

### This Prototype's Role

**This repository (`bryntum-prototype`) is NOT for integration.** It serves as:

- **UX/UI Reference:** Visual design and interaction patterns
- **Feature Demonstration:** Shows how features should work
- **Requirements Clarification:** Helps stakeholders understand requirements
- **Component Patterns:** Examples of Bryntum component configurations
- **Mock Data Reference:** Data structure examples in `public/data/2.0/`

**Reference Document:** [BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md](./BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md) - Use to understand prototype structure, not for integration

## Development Workflow

### Phase 1: Independent UI Development (Before Backend)

**Goal:** Build all UI components and interactions using mock data

**Steps:**

1. **Use Existing Mockup Data or Create New:**
   ```bash
   # Option 1: Use existing mockup data in public/data/2.0/
   # - mockup_data.json (baseline schedule)
   # - mockup_data_optimized.json (optimized schedule)
   # - mockup_metrics.json (schedule metrics)
   # - mockup_scenarios.json (optimization scenarios)
   # - mockup_movable_templates.json (pre-planning templates)
   
   # Option 2: Create new data from CSV templates:
   # Use data-requirements-template.csv to create:
   # - public/data/mock-schedule.json (Bryntum format)
   # - public/data/mock-employees.json
   # - public/data/mock-visits.json
   ```

2. **Build Bryntum Components:**
   - Start with core timeline (Category 1)
   - Add drag & drop (Category 2)
   - Implement visit CRUD (Category 3)
   - Add filters and grouping (Category 5)
   - Build comparison mode (Category 6)
   - Add metrics panels (Category 7)
   - Implement optimization UI (Category 8)
   - Add pre-planning features (Category 9)

3. **Reference Bryntum Examples:**
   - Use [bryntum-reference.md](./bryntum-reference.md) to find relevant examples
   - Each feature maps to specific Bryntum examples with URLs
   - Follow implementation patterns from examples

4. **Test with Mock Data:**
   - All interactions should work with mock JSON files
   - Validate data transformations
   - Test edge cases (unassigned visits, missing data, etc.)

### Phase 2: Backend Integration (When API is Ready)

**Goal:** Connect UI to real backend API

**Steps:**

1. **Review Backend Spec:**
   - Read [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md) thoroughly
   - Understand GraphQL operations (queries, mutations, subscriptions)
   - Review data flow patterns

2. **Implement Mapper Functions:**
   - `mapScheduleToBryntum()` - Backend → Bryntum format
   - `mapBryntumChangesToUpdate()` - Bryntum → Backend format
   - `mapEmployeeToResource()` - Employee → Resource
   - `mapVisitToEvent()` - Visit → Event
   - See [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md) for complete list

3. **Create GraphQL Hooks:**
   - `useSchedule()` - Fetch schedule data
   - `useUpdateSchedule()` - Save changes
   - `useOptimization()` - Trigger optimization
   - `useOptimizationProgress()` - Real-time progress

4. **Replace Mock Data:**
   - Remove JSON file loading
   - Connect to GraphQL queries
   - Test with real database data

5. **Add Real-time Features:**
   - WebSocket subscriptions for optimization progress
   - Automatic calendar updates on completion
   - Error handling and loading states

## Mockup Data (2.0)

The project includes a comprehensive set of mockup data files in `public/data/2.0/` that are actively used for development and testing.

### Available Mockup Data Files

| File | Purpose | Status | Used In |
|------|---------|--------|---------|
| `mockup_data.json` | Baseline schedule data (unoptimized) | ✅ Active | Revision 1 (baseline) |
| `mockup_data_optimized.json` | Optimized schedule data | ✅ Active | Default load, Revision 2 & 3 |
| `mockup_metrics.json` | Schedule and employee metrics | ✅ Active | Metrics panel display |
| `mockup_scenarios.json` | Optimization scenario configurations | ✅ Active | Optimization modal |
| `mockup_movable_templates.json` | Pre-planning visit templates | 📦 Available | Not yet integrated |
| `mockup_data_week.json` | Week view schedule data | 📦 Available | Not yet integrated |
| `mockup_data_unplanned.json` | Unplanned visits data | 📦 Available | Not yet integrated |

### Data Structure

All schedule data files (`mockup_data*.json`) follow the Bryntum CrudManager format:
- `success`: Boolean indicating load success
- `project`: Project configuration (calendar settings)
- `calendars`: Working time calendars (workweek, day-shift, extended-shift)
- `resources`: Employee/resource data (id, name, role, skills, service areas)
- `events`: Visit/appointment data (id, name, duration, time windows, skills)
- `assignments`: Resource-event assignments

**Metrics Data** (`mockup_metrics.json`):
- `scheduleMetrics`: Overall schedule KPIs (service hours, travel time, utilization, costs)
- `employeeMetrics`: Per-employee metrics (utilization, visit count, skill match)

**Scenarios Data** (`mockup_scenarios.json`):
- Array of optimization scenarios with:
  - `weights`: Objective function weights
  - `constraints`: Optimization constraints (time windows, skills, overtime)

### Current Implementation

**Active Usage:**
- Default scheduler loads `mockup_data_optimized.json` (via `AppConfig.tsx`)
- Revision selector maps to different data files:
  - Revision 1 → `mockup_data.json` (baseline)
  - Revision 2 → `mockup_data_optimized.json` (optimized)
  - Revision 3 → `mockup_data_optimized.json` (manual)
- Metrics panel loads `mockup_metrics.json` on mount
- Optimization modal loads `mockup_scenarios.json` for scenario selection

**Future Integration:**
- `mockup_movable_templates.json` - For pre-planning features (Category 9)
- `mockup_data_week.json` - For week/month view testing
- `mockup_data_unplanned.json` - For unplanned visits panel testing

## Data Templates for Mock Development

### data-requirements-template.csv

**Purpose:** Create additional mock schedule data for initial development

**Use When:**
- Building UI components before backend is ready
- Testing mapper functions
- Validating data transformations
- Developing independently of backend
- Need to extend existing mockup data

**Fields Include:**
- Visit data (visits, clients, time windows, skills)
- Employee data (shifts, breaks, skills, transport)
- Assignment data (who does what)
- Metrics data (for display testing)

**How to Use:**
1. Fill CSV with realistic test data
2. Convert to Bryntum JSON format (resources, events, assignments)
3. Save as `public/data/2.0/mockup_data_custom.json` or similar
4. Load in Bryntum components for development

### movable-visits-data-template.csv

**Purpose:** Create mock pre-planning/movable visits data

**Use When:**
- Building pre-planning features (Category 9)
- Testing movable visit lifecycle
- Developing supply/demand balance features
- Testing multi-week/month views
- Extending `mockup_movable_templates.json`

**Fields Include:**
- Movable visit templates (frequency, time windows)
- Client information
- Contact person details
- Order information from municipality PDFs

**How to Use:**
1. Fill CSV with movable visit patterns
2. Convert to `visit_templates` format matching `mockup_movable_templates.json` structure
3. Generate concrete visits for planning horizon
4. Test pre-planning optimization workflow

## Key Concepts

### Supply/Demand Management

All Bryntum features are tools for managing:
- **Supply** = Employees (capacity, skills, availability)
- **Demand** = Visits (required hours, skills, time windows)

See [bryntum_timeplan.md](./bryntum_timeplan.md) "Supply/Demand Management Principle" section.

### Data Flow

1. **Backend** stores normalized data (Prisma + PostgreSQL)
2. **GraphQL API** provides queries/mutations/subscriptions
3. **Mapper Functions** transform between backend and Bryntum formats
4. **Bryntum Components** display and allow editing
5. **Changes** flow back through mappers to GraphQL mutations

See [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md) "Data Flow Patterns" section.

### Metrics Calculation

**Important:** All metrics are calculated and stored in the backend, not the frontend.

- Backend calculates metrics after schedule changes
- Backend calculates metrics after optimization completes
- Frontend only fetches and displays pre-calculated metrics
- Financial metrics (cost, revenue, profit) respect RBAC

See [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md) "Metrics Calculation & Display" section.

## Task Breakdown

### Phase 1: Basic Features (4 weeks)

**Priority P0 (Critical - MVP):**
- Category 1: Core Schedule Viewing (8-12 hours)
- Category 2: Visit Assignment (12-16 hours)
- Category 3: Visit CRUD (20-24 hours)
- Category 3.5: Employee CRUD (16-20 hours)
- Category 8: Real-time Optimization (8-12 hours)
- Category 11: Integration & Infrastructure (16-20 hours)
- Category 12: Testing & Documentation (12-16 hours)

**Total Phase 1:** ~4 weeks (92-120 hours)

### Phase 2: All Features (Additional 4 weeks)

**Priority P1 (High - Full Feature Set):**
- Category 4: Cross-Service Area (8-12 hours)
- Category 5: Filtering & Search (6-8 hours)
- Category 6: Comparison (16-20 hours)
- Category 7: Analytics (12-16 hours)
- Category 9: Pre-Planning (24-32 hours)

**Priority P2 (Medium - Nice to Have):**
- Category 7.5: Advanced Features (6-8 hours)
- Category 10: Export & Reporting (6-8 hours)

**Total Phase 2:** ~4 weeks (66-88 hours + 12-16 hours = 78-104 hours)

**Total Project:** ~8 weeks (170-224 hours)

See [bryntum_timeplan.md](./bryntum_timeplan.md) for complete breakdown.

## Bryntum Examples Reference

The [bryntum-reference.md](./bryntum-reference.md) document provides:

- **Complete catalogue** of all Bryntum examples
- **Mapping** to Caire features
- **Implementation status** (done/ux added/missing)
- **URLs** to all examples
- **UX patterns** (toggle/filter/panel/modal/mode)

**Key Examples:**
- Timeline (base calendar)
- Drag Unplanned Tasks (unassigned visits panel)
- Skill Matching (validation during drag)
- Planned vs Actual (comparison mode)
- Resource Histogram (capacity visualization)
- WebSockets (real-time optimization)
- And 50+ more...

## Backend API Reference

The [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md) provides:

- **71 GraphQL operations** (queries, mutations, subscriptions)
- **15 REST endpoints** (webhooks, file operations, health checks)
- **Data flow patterns** for all operations
- **Mapper function specifications** (10+ required mappers)
- **Metrics calculation** requirements
- **Error handling** patterns
- **Performance considerations**

## Success Criteria

### Functional Requirements
- ✅ Calendar loads real schedule data from GraphQL
- ✅ All visits and employees display correctly
- ✅ Drag-and-drop assignment works and saves to database
- ✅ Visit editing saves to database
- ✅ Optimization triggers Timefold job via GraphQL
- ✅ Real-time progress updates during optimization
- ✅ Calendar updates automatically when solution arrives
- ✅ All filters work with real data
- ✅ Metrics panel shows accurate KPIs
- ✅ Comparison mode works with real schedules
- ✅ Pre-planning features work correctly
- ✅ Swedish localization preserved

### Non-Functional Requirements
- ✅ Type-safe throughout (no `any` types)
- ✅ Error handling for all operations
- ✅ Loading states for async operations
- ✅ Performance: <200ms for GraphQL queries
- ✅ No console errors or warnings
- ✅ Responsive design maintained
- ✅ Accessibility standards met

## Prototype Implementation Status

> **Note:** This section describes what's implemented in **this prototype repository** (`bryntum-prototype`), which serves as a reference. Production development will start fresh in `beta-appcaire`.

### ✅ Implemented Features (in Prototype)

**Core Scheduling:**
- ✅ Timeline calendar view with employee rows and visit events
- ✅ Drag-and-drop visit assignment and reassignment
- ✅ Visit editing (time, duration via drag/resize)
- ✅ Revision management (baseline, optimized, manual)
- ✅ Service area filtering with multi-select
- ✅ Employee management (CRUD with modal)
- ✅ Unplanned visits panel with drag-to-assign

**Filtering & Grouping:**
- ✅ Grouping by role, contract type, transport mode
- ✅ Skill filter dropdown
- ✅ Mandatory/Optional visit filter
- ✅ Priority filter
- ✅ Night/weekend toggle
- ✅ Time zoom controls (+/- buttons)

**Optimization:**
- ✅ Optimization scenario modal (5 presets + custom)
- ✅ Editable scenario weights and constraints
- ✅ Metrics panel (service hours, travel time, utilization, unassigned visits)
- ⏳ Real-time optimization progress (UI ready, needs WebSocket backend)

**Comparison:**
- ✅ Side-by-side revision comparison
- ✅ Metrics comparison panel
- ✅ Service area filtering in comparison mode

**Export & UI:**
- ✅ Export menu (PDF/Excel/Print)
- ✅ Resource utilization visualization
- ✅ Tree summary heatmap
- ✅ Swedish localization

### 📦 Available but Not Yet Integrated

- `mockup_movable_templates.json` - Pre-planning visit templates (for Category 9)
- `mockup_data_week.json` - Week view data (for extended time ranges)
- `mockup_data_unplanned.json` - Dedicated unplanned visits dataset

### 🔄 Pending Backend Integration

- GraphQL API connection (currently using mockup data)
- WebSocket subscriptions for real-time optimization progress
- Save changes to database (create revisions)
- Load real schedule data from backend
- Mapper functions (backend ↔ Bryntum format)

See [bryntum-reference.md](./bryntum-reference.md) for detailed implementation status of all 60 features.

## Getting Started Checklist (for beta-appcaire development)

- [ ] Review this prototype repository and live demo
- [ ] Read [BRYNTUM_FROM_SCRATCH_PRD.md](./BRYNTUM_FROM_SCRATCH_PRD.md) thoroughly
- [ ] Review backend API specifications in [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md)
- [ ] Understand data flow patterns
- [ ] Set up development environment in beta-appcaire (Node.js, Yarn, Bryntum token)
- [ ] Use mockup data from this prototype's `public/data/2.0/` as reference
- [ ] Plan Phase 1 (4 weeks) - Basic features
- [ ] Start with Category 1: Core Schedule Viewing
- [ ] Reference Bryntum examples from [bryntum-reference.md](./bryntum-reference.md)
- [ ] Use this prototype as UX/UI reference throughout development
- [ ] Test each feature with mock data before backend integration
- [ ] Implement mapper functions when backend is ready
- [ ] Connect to GraphQL API
- [ ] Add real-time features (WebSocket subscriptions)
- [ ] Test with production data
- [ ] Complete testing and documentation

## Questions?

If you have questions about:
- **Requirements:** See the PRD documents
- **Backend API:** See [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md)
- **Bryntum Examples:** See [bryntum-reference.md](./bryntum-reference.md)
- **Task Breakdown:** See [bryntum_timeplan.md](./bryntum_timeplan.md)
- **Data Format:** See CSV templates

## Related Documentation

- [Main README](../README.md) - Project overview and setup
- [BRYNTUM_SETUP.md](../BRYNTUM_SETUP.md) - Bryntum authentication guide

---

**Document Status:** Reference Documentation - Prototype for UX/UI Guidance  
**Production Repository:** [https://github.com/CairePlatform/beta-appcaire](https://github.com/CairePlatform/beta-appcaire)  
**Timeline:** 4 weeks (basic) + 4 weeks (all features) = 8 weeks total
