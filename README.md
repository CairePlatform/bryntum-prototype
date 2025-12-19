# Bryntum Scheduler Prototype

A standalone prototype application using Bryntum Scheduler Pro for home care scheduling visualization and optimization.

## Quick Start

Get up and running in 4 steps:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bryntum-prototype
```

### 2. Get Your Bryntum NPM Token

**For Local Development: Use a Trial License**

Developers should use a **trial license** for local development. The commercial license is only used on Vercel (automatically configured) and developers don't need access to it.

To get your trial token:

1. **Sign up for a free trial** at [bryntum.com](https://bryntum.com) (if you don't have an account)
2. **Log in to npm.bryntum.com** (you'll need your Bryntum account credentials):
   ```bash
   npm login --registry=https://npm.bryntum.com
   ```
   Enter your Bryntum account email and password when prompted.

3. **Create an access token**:
   ```bash
   npm token create --registry=https://npm.bryntum.com
   ```
   Enter your password when prompted, then copy the token from the output.

4. **View existing tokens** (optional):
   ```bash
   npm token list --registry=https://npm.bryntum.com
   ```

> **Note**: 
> - Trial licenses work perfectly for local development
> - The commercial license is automatically used on Vercel (configured via environment variables)
> - Developers don't need access to the commercial token
> - See [Bryntum npm repository guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/npm-repository#access-tokens) for detailed instructions

### 3. Configure Bryntum Token

**Option A: Using .env file (Recommended for convenience)**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and replace 'your-bryntum-npm-token-here' with your trial token
# Then load it in your current shell:
export BRYNTUM_NPM_TOKEN=$(grep "^BRYNTUM_NPM_TOKEN=" .env | cut -d'=' -f2)
```

**Option B: Direct export (temporary)**

```bash
export BRYNTUM_NPM_TOKEN="your-actual-token-here"
```

> **Important**: Use your own **trial token**. Do not use any commercial token - that's only configured in Vercel for deployments.

### 4. Install Dependencies & Start Development Server

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:5173/`

## Tech Stack

- [React](https://react.dev/) [18.2.0]
- [Vite](https://vitejs.dev/guide/) [4.3.9]
- [Bryntum Scheduler Pro](https://bryntum.com/products/schedulerpro/)

## Prerequisites

- **Node.js >= 20.0.0**
- **pnpm** (recommended), npm, or yarn
- **Bryntum account** with access to Scheduler Pro (trial or licensed)

## Troubleshooting

### Authentication Errors During Installation

If you see authentication errors when running `pnpm install`:

1. **Verify your token is set:**
   ```bash
   echo $BRYNTUM_NPM_TOKEN
   ```
   If empty, export it again (see Step 3 above).

2. **Verify token validity:**
   - View your tokens: `npm token list --registry=https://npm.bryntum.com`
   - Ensure your account has access to Scheduler Pro
   - Create a new token if needed: `npm token create --registry=https://npm.bryntum.com`

3. **Check .npmrc file:**
   The project should automatically use the `BRYNTUM_NPM_TOKEN` environment variable. If issues persist, see [BRYNTUM_SETUP.md](./BRYNTUM_SETUP.md) for detailed troubleshooting.

### Environment Variable Not Persisting

If you need to set the token every time you open a new terminal, add it to your shell profile:

```bash
# Add to ~/.zshrc or ~/.bashrc
export BRYNTUM_NPM_TOKEN="your-token-here"
```

Or use a `.env` file and source it in your shell profile.

## Building for Production

```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This repository is **automatically deployed to Vercel on push** using a commercial Bryntum license.

- **Local Development**: Developers use trial licenses (see Step 2 above)
- **Vercel Deployment**: Commercial license is configured via Vercel environment variables
- **No Action Required**: The commercial token is already set up in Vercel and is not needed locally

See [BRYNTUM_SETUP.md](./BRYNTUM_SETUP.md) for more details on licensing strategy.

## Next Steps

Once the development server is running, you can:

- Explore the codebase in `src/`
- Check out the components in `src/components/`
- Review the project documentation in `docs/`
- Read the [Bryntum Scheduler Pro documentation](https://bryntum.com/products/schedulerpro/docs/)

## Documentation

### Project Documentation

- **[docs/README.md](./docs/README.md)** - Documentation index and overview
- **[docs/BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md](./docs/BRYNTUM_PROTOTYPE_INTEGRATION_PRD.md)** - Integration requirements
- **[docs/BRYNTUM_FROM_SCRATCH_PRD.md](./docs/BRYNTUM_FROM_SCRATCH_PRD.md)** - Product requirements
- **[docs/bryntum_timeplan.md](./docs/bryntum_timeplan.md)** - Project timeline and planning

### Setup & Configuration

- **[BRYNTUM_SETUP.md](./BRYNTUM_SETUP.md)** - Complete guide for Bryntum authentication, licensing, and troubleshooting

### External Resources

- [Bryntum Scheduler Pro documentation](https://bryntum.com/products/schedulerpro/docs/)
- [Bryntum React integration guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/integration/react/guide)
- [Bryntum Scheduler Pro examples](https://bryntum.com/products/schedulerpro/examples/)

## License

This project uses Bryntum Scheduler Pro, which requires a license. See [BRYNTUM_SETUP.md](./BRYNTUM_SETUP.md) for licensing information.
