# Bryntum Implementation Documentation

This directory contains comprehensive documentation for implementing the Bryntum SchedulerPro scheduling UI for the Caire platform.

## Overview

The task is to **build a complete, production-ready Bryntum SchedulerPro scheduling calendar** that integrates with the Caire backend API. You can choose between two implementation approaches:

1. **Prototype Integration** (Faster - 22-33 hours) - Integrate existing working prototype
2. **From Scratch** (Complete - 112-152 hours) - Build everything using Bryntum examples

Both approaches result in the same final product. The choice depends on whether you have access to the existing prototype.

## Quick Start Guide

### For Developers

1. **Choose Your Approach:**
   - Have access to the prototype? → Read [BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md](./BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md)
   - Building from scratch? → Read [BRYNTUM_FROM_SCRATCH_PRD.md](./BRYNTUM_FROM_SCRATCH_PRD.md)

2. **Understand the Backend:**
   - Read [BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md) for complete API specifications
   - Review data flow patterns and mapper requirements

3. **Plan Your Work:**
   - Use [bryntum_timeplan.md](./bryntum_timeplan.md) for detailed task breakdown
   - Reference [bryntum-reference.md](./bryntum-reference.md) for Bryntum example mappings

4. **Start Development (Before Backend is Ready):**
   - Use [data-requirements-template.csv](./data-requirements-template.csv) to create mock data
   - Use [movable-visits-data-template.csv](./movable-visits-data-template.csv) for pre-planning features
   - Build UI components independently while backend is being developed

## Documentation Structure

### Core Requirements & Planning

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[BRYNTUM_FROM_SCRATCH_PRD.md](./BRYNTUM_FROM_SCRATCH_PRD.md)** | Complete PRD for building from scratch (112-152 hours) | If building from scratch |
| **[BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md](./BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md)** | Integration guide for existing prototype (22-33 hours) | If integrating existing prototype |
| **[bryntum_timeplan.md](./bryntum_timeplan.md)** | Detailed task breakdown by category with time estimates | Planning phase - understand scope |
| **[bryntum-reference.md](./bryntum-reference.md)** | Complete catalogue of Bryntum examples mapped to Caire features | Implementation phase - find examples |

### Backend Integration

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[BRYNTUM_BACKEND_SPEC.md](./BRYNTUM_BACKEND_SPEC.md)** | Complete backend API specifications, data flows, mappers | Before integration - understand API |
| **[data-requirements-template.csv](./data-requirements-template.csv)** | CSV template for creating mock data | Early development - create test data |
| **[movable-visits-data-template.csv](./movable-visits-data-template.csv)** | CSV template for pre-planning/movable visits | Pre-planning features development |

## Implementation Approaches

### Approach 1: Prototype Integration (Recommended if Available)

**Timeline:** 2-3 weeks 
**Document:** [BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md](./BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md)

**When to Use:**
- You have access to the existing prototype repository
- You want faster delivery
- UI/UX patterns are already proven

**Process:**
1. Copy prototype components to main app
2. Replace mock data with GraphQL API calls
3. Implement mapper functions (backend ↔ Bryntum)
4. Connect real-time features (WebSocket subscriptions)
5. Test with production data

### Approach 2: From Scratch (Complete Build)

**Timeline:** 14-19 working days (112-152 hours)  
**Document:** [BRYNTUM_FROM_SCRATCH_PRD.md](./BRYNTUM_FROM_SCRATCH_PRD.md)

**When to Use:**
- No access to prototype
- Want to follow Bryntum best practices from the start
- Need complete control over implementation

**Process:**
1. Build core calendar using Bryntum examples
2. Add features incrementally (drag-drop, filters, optimization)
3. Connect to GraphQL API
4. Implement all 11 phases from PRD

## Development Workflow

### Phase 1: Independent UI Development (Before Backend)

**Goal:** Build all UI components and interactions using mock data

**Steps:**

1. **Create Mock Data from CSV Templates:**
   ```bash
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

## Data Templates for Mock Development

### data-requirements-template.csv

**Purpose:** Create mock schedule data for initial development

**Use When:**
- Building UI components before backend is ready
- Testing mapper functions
- Validating data transformations
- Developing independently of backend

**Fields Include:**
- Visit data (visits, clients, time windows, skills)
- Employee data (shifts, breaks, skills, transport)
- Assignment data (who does what)
- Metrics data (for display testing)

**How to Use:**
1. Fill CSV with realistic test data
2. Convert to Bryntum JSON format (resources, events, assignments)
3. Save as `public/data/mock-schedule.json`
4. Load in Bryntum components for development

### movable-visits-data-template.csv

**Purpose:** Create mock pre-planning/movable visits data

**Use When:**
- Building pre-planning features (Category 9)
- Testing movable visit lifecycle
- Developing supply/demand balance features
- Testing multi-week/month views

**Fields Include:**
- Movable visit templates (frequency, time windows)
- Client information
- Contact person details
- Order information from municipality PDFs

**How to Use:**
1. Fill CSV with movable visit patterns
2. Convert to `visit_templates` format
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

### Priority P0 (Critical - MVP)
- Category 1: Core Schedule Viewing (8-12 hours)
- Category 2: Visit Assignment (12-16 hours)
- Category 3: Visit CRUD (20-24 hours)
- Category 3.5: Employee CRUD (16-20 hours)
- Category 8: Real-time Optimization (8-12 hours)
- Category 11: Integration & Infrastructure (16-20 hours)
- Category 12: Testing & Documentation (12-16 hours)

**Total P0:** 11.5-14.5 days (92-120 hours)

### Priority P1 (High - Full Feature Set)
- Category 4: Cross-Service Area (8-12 hours)
- Category 5: Filtering & Search (6-8 hours)
- Category 6: Comparison (16-20 hours)
- Category 7: Analytics (12-16 hours)
- Category 9: Pre-Planning (24-32 hours)

**Total P1:** 8.25-11 days (66-88 hours)

### Priority P2 (Medium - Nice to Have)
- Category 7.5: Advanced Features (6-8 hours)
- Category 10: Export & Reporting (6-8 hours)

**Total P2:** 1.5-2 days (12-16 hours)

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

## Getting Started Checklist

- [ ] Choose implementation approach (prototype integration vs from scratch)
- [ ] Read the relevant PRD document thoroughly
- [ ] Review backend API specifications
- [ ] Understand data flow patterns
- [ ] Set up development environment (Node.js, pnpm, Bryntum token)
- [ ] Create mock data from CSV templates
- [ ] Start with Category 1 (Core Schedule Viewing)
- [ ] Reference Bryntum examples as you build
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

**Last Updated:** 2025-12-16  
**Document Status:** Ready for Implementation
