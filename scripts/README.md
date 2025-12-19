# Scripts Directory

This directory contains utility scripts for the Bryntum prototype project.

## Setup Scripts

This directory contains utility scripts for the Bryntum prototype project:

- **`setup-npmrc.sh`** - Creates `.npmrc` file with Bryntum registry configuration (works for both local dev and Vercel)

**Usage:**

```bash
# Set up .env file (optional, for convenience)
cp .env.example .env
# Edit .env with your Bryntum token, then:
export BRYNTUM_NPM_TOKEN=$(grep "^BRYNTUM_NPM_TOKEN=" .env | cut -d'=' -f2)

# Set up npmrc (requires BRYNTUM_NPM_TOKEN to be set)
./scripts/setup-npmrc.sh

# Note: setup-npmrc.sh is also used automatically by Vercel during builds
# (configured in vercel.json installCommand)
```

## Data Files

All active data files are located in `public/data/2.0/`:

- `mockup_data.json` - Baseline schedule data
- `mockup_data_optimized.json` - Optimized schedule data (default)
- `mockup_metrics.json` - Schedule and employee metrics
- `mockup_scenarios.json` - Optimization scenario configurations
- `mockup_movable_templates.json` - Pre-planning visit templates
- `mockup_data_week.json` - Week view schedule data
- `mockup_data_unplanned.json` - Unplanned visits data

For creating new mock data, use the CSV templates from `docs/`:

- `docs/data-requirements-template.csv` - For schedule data
- `docs/movable-visits-data-template.csv` - For pre-planning data
