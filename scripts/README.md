# Scripts Directory

This directory contains utility scripts for the Bryntum prototype project.

## Setup Scripts (Keep - Useful for Developers)

These scripts help external developers set up their environment:

- **`setup-env.sh`** - Interactive script to create `.env` file from `.env.example`
- **`setup-npmrc.sh`** - Creates `.npmrc` file with Bryntum registry configuration
- **`setup-vercel-npmrc.sh`** - Creates `.npmrc` for Vercel deployment builds

**Usage:**

```bash
# Set up environment (creates .env from .env.example)
./scripts/setup-env.sh

# After editing .env with your token, load it:
export BRYNTUM_NPM_TOKEN=$(grep "^BRYNTUM_NPM_TOKEN=" .env | cut -d'=' -f2)

# Set up npmrc (requires BRYNTUM_NPM_TOKEN to be set)
./scripts/setup-npmrc.sh

# setup-vercel-npmrc.sh is used automatically by Vercel during builds
# (configured in vercel.json installCommand)
```

## Data Transformation Scripts (Temporary - One-Time Use)

These scripts were used to transform mock JSON data files during prototype development. They are **not needed** for the actual implementation and can be removed or archived.

**Temporary Scripts:**

- `add-travel-events.js` - Added travel events to mock data
- `apply-status-colors.js` - Applied status colors to mock data
- `apply-visual-system.js` - Applied visual system to mock data
- `convert-to-event-buffers.js` - Converted travel to event buffers
- `fix-event-buffers.js` - Fixed event buffer durations
- `generate-realistic-data.py` - Generated realistic mock data

**Note:** For the actual implementation, use the CSV templates from `docs/` to create mock data:

- `docs/data-requirements-template.csv` - For schedule data
- `docs/movable-visits-data-template.csv` - For pre-planning data

These transformation scripts are only useful if you need to modify the existing `public/data/homecare-complete.json` file, which is not necessary for the implementation.
