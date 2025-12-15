# Bryntum Scheduler Prototype

A standalone prototype application using Bryntum Scheduler Pro for home care scheduling visualization and optimization.

This example uses Bryntum Scheduler Pro wrapped in the provided `BryntumSchedulerPro` wrapper.
Drag unplanned tasks from a list onto the Scheduler component.

This application was generated with:

- [React](https://react.dev/) [18.2.0]
- [Vite](https://vitejs.dev/guide/) [4.3.9]

## Deployment

This repository is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration for:
- Build commands using pnpm
- Output directory (dist)
- SPA routing configuration
- Cache headers for static assets

To deploy to Vercel:
1. Ensure you have the `BRYNTUM_NPM_TOKEN` environment variable set in Vercel
2. Connect this repository to Vercel
3. Deploy automatically on push or manually via Vercel CLI

# Bryntum Repository access setup

**IMPORTANT NOTE!** These access instructions are mandatory when using the private Bryntum NPM repository.

This application uses npm packages from the Bryntum private NPM repository. You must be logged-in to this repository as
a licensed or trial user to access the packages.

Please check [Online npm repository guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/npm-repository) for the detailed information on the
sign-up/login process.

# React integration guide

Please check the [Bryntum React integration online guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/integration/react/guide) for detailed
integration information and help.

# Installation

Use the following command to install the example packages after the successful login.

Using **npm**:

```shell
npm install
```

Using **yarn**:

```shell
yarn install
```

Using **pnpm** (recommended):

```shell
pnpm install
```

# Running a development server

To build example and start development server run this command:

Using **npm**:

```shell
npm run start
```

Using **yarn**:

```shell
yarn run start
```

Using **pnpm**:

```shell
pnpm dev
```

Navigate to `http://localhost:5173/` or `http://127.0.0.1:5173/` in your browser. We recommend to use latest versions of
modern browsers like Chrome, FireFox, Safari or Edge. The app will automatically reload if you change any of
the source files.

# Creating a production build

To build production code for the example run this command:

Using **npm**:

```shell
npm run build
```

Using **yarn**:

```shell
yarn run build
```

Using **pnpm**:

```shell
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

# Distribution zip references

- Bryntum API docs. Open `docs/index.html` in your browser.
- Bryntum Repository guide `docs/guides/npm-repository.md`.
- Bryntum React integration guide `docs/guides/integration/react/guide.md`.

# Online References

- [Vite](https://vitejs.dev/guide/)
- [React Framework](https://react.dev/)
- [Bryntum React integration guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/integration/react/guide)
- [Bryntum Scheduler Pro documentation](https://bryntum.com/products/schedulerpro/docs/)
- [Bryntum Scheduler Pro examples](https://bryntum.com/products/schedulerpro/examples/)
- [Bryntum npm repository guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/npm-repository)
- [Bryntum support Forum](https://forum.bryntum.com/)
- [Contacts us](https://bryntum.com/contact/)
