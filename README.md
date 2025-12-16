# Bryntum Scheduler Prototype

A standalone prototype application using Bryntum Scheduler Pro for home care scheduling visualization and optimization.

This example uses Bryntum Scheduler Pro wrapped in the provided `BryntumSchedulerPro` wrapper.
Drag unplanned tasks from a list onto the Scheduler component.

## Tech Stack

- [React](https://react.dev/) [18.2.0]
- [Vite](https://vitejs.dev/guide/) [4.3.9]
- [Bryntum Scheduler Pro](https://bryntum.com/products/schedulerpro/)

## Prerequisites

- Node.js >= 20.0.0
- pnpm (recommended), npm, or yarn
- Bryntum account with access to Scheduler Pro (trial or licensed)

## Getting Started

### 1. Clone the Repository

```shell
git clone <repository-url>
cd bryntum-prototype
```

### 2. Set Up Bryntum Authentication

This project uses Bryntum packages from their private NPM registry. You need to configure authentication before installing dependencies.

**📖 See [BRYNTUM_SETUP.md](./BRYNTUM_SETUP.md) for complete setup instructions.**

Quick start:

```shell
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Bryntum NPM token
# Then export it:
export BRYNTUM_NPM_TOKEN=$(grep "^BRYNTUM_NPM_TOKEN=" .env | cut -d'=' -f2)
```

### 3. Install Dependencies

```shell
pnpm install
```

### 4. Run Development Server

```shell
pnpm dev
```

Navigate to `http://localhost:5173/` in your browser.

## Building for Production

```shell
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This repository is configured for deployment on Vercel. See [BRYNTUM_SETUP.md](./BRYNTUM_SETUP.md) for deployment instructions and license requirements.

**⚠️ Note**: Trial licenses cannot be used for server deployments. A commercial license is required for production deployments.

## Documentation

### Project Documentation

- **[docs/PRD.md](./docs/PRD.md)** - Product Requirements Document
- **[docs/TIMEPLAN.md](./docs/TIMEPLAN.md)** - Project timeline and planning
- **[docs/DATA.md](./docs/DATA.md)** - Example data documentation and structure
- **[docs/README.md](./docs/README.md)** - Documentation index

### Setup & Configuration

- **Bryntum Setup**: [BRYNTUM_SETUP.md](./BRYNTUM_SETUP.md) - Complete guide for Bryntum authentication and licensing

### External Resources

- [Bryntum Scheduler Pro documentation](https://bryntum.com/products/schedulerpro/docs/)
- [Bryntum React integration guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/integration/react/guide)
- [Bryntum Scheduler Pro examples](https://bryntum.com/products/schedulerpro/examples/)

## License

This project uses Bryntum Scheduler Pro, which requires a license. See [BRYNTUM_SETUP.md](./BRYNTUM_SETUP.md) for licensing information.
