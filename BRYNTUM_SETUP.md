# Bryntum Setup Guide

This project uses Bryntum Scheduler Pro packages from their private NPM registry. This guide covers everything you need to set up Bryntum authentication and licensing.

## Prerequisites

- Node.js >= 20.0.0
- pnpm (recommended), npm, or yarn
- A Bryntum account with access to Scheduler Pro (trial or licensed)

## License Types

This project requires access to Bryntum Scheduler Pro packages. 

**💡 Recommendation**: Start with a **trial license** to evaluate the software. If you need to deploy to servers or use in production, you'll need a commercial license.

You can use either:

### Trial License
- **Free** - Available for evaluation purposes
- **Duration**: Typically 30-45 days (check current terms)
- **Limitations**: 
  - **Local development only** - Cannot be used on servers or in deployed environments
  - For evaluation and development only
  - Not for production use
  - May have watermarks or feature limitations
  - **Server deployment requires a commercial license**
- **Getting a trial token**: Sign up for a free trial at [bryntum.com](https://bryntum.com) to get your NPM token
- **Use case**: Perfect for local testing, prototyping, and evaluating Bryntum features on your development machine
- **⚠️ Important**: Trial licenses will **not work** when deploying to servers (Vercel, AWS, Heroku, etc.). You must have a commercial license for any server deployment.

### Commercial License
- **Paid** - Requires purchasing a license
- **Types available**:
  - **End-User License (EUL)**: For internal company applications where end-users don't pay for access
  - **OEM License**: For commercial products and SaaS applications redistributed to third parties
- **Benefits**:
  - Full production use
  - No watermarks
  - All features unlocked
  - Premium support (depending on license type)
  - Free upgrades during subscription period
- **Getting a commercial token**: Purchase a license and access your NPM token from your Bryntum account dashboard
- **Use case**: Production applications, commercial products, and SaaS offerings

**Important Notes**:
- Both trial and commercial tokens work the same way for NPM authentication. The token format and usage are identical.
- **Trial licenses are restricted to local development only** - they cannot be used for server deployments or production environments.
- **Commercial licenses are required** for any server deployment (Vercel, AWS, Heroku, Docker containers, etc.).
- The difference is in the license terms and what you're allowed to do with the software.

## Initial Setup

### Step 1: Get Your Bryntum NPM Token

**💡 Recommended: Start with a Trial License**

For most developers, we recommend starting with a **trial license** to evaluate Bryntum Scheduler Pro:

**For Trial License:**
- Sign up for a free trial at [https://bryntum.com](https://bryntum.com)
- Navigate to your account dashboard
- Find the NPM token section
- Generate or copy your trial authentication token
- **Note**: Trial licenses work for local development only and cannot be used for server deployments

**For Commercial License:**

If you need to deploy to servers or use in production, you'll need a commercial license:

- **If your organization already has a commercial license:**
  - Contact your administrator or IT department to obtain the commercial NPM token
  - The administrator should have access to the Bryntum account dashboard
  - They can generate or provide you with the commercial authentication token
  - Make sure to get a token that has access to Scheduler Pro packages

- **If you need to purchase a commercial license:**
  - Visit [Bryntum Licensing](https://bryntum.com/licensing/) to purchase a license
  - After purchase, log in to your Bryntum account
  - Navigate to your account dashboard
  - Find the NPM token section
  - Generate or copy your commercial authentication token

**Both license types:**
- The token format and usage are identical
- For detailed instructions, see the [Bryntum npm repository guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/npm-repository)
- For licensing information, visit [Bryntum Licensing](https://bryntum.com/licensing/)

### Step 2: Set Up Your Environment

**Option A: Using .env file (Recommended)**
```shell
# Use the setup script (easiest):
./scripts/setup-env.sh

# Or manually:
cp .env.example .env

# Edit .env and replace 'your-bryntum-npm-token-here' with your actual token
# Then export it in your shell:
export BRYNTUM_NPM_TOKEN=$(grep "^BRYNTUM_NPM_TOKEN=" .env | cut -d'=' -f2)
```

**Option B: Export directly in your shell**
```shell
export BRYNTUM_NPM_TOKEN="your-actual-token-here"
```

**Option C: Add to your shell profile (for permanent setup)**
```shell
# Add to ~/.zshrc or ~/.bashrc
export BRYNTUM_NPM_TOKEN="your-actual-token-here"
```

### Step 3: Verify the Token is Set

```shell
echo $BRYNTUM_NPM_TOKEN
```

### Step 4: Install Dependencies

The `.npmrc` file will automatically use the `BRYNTUM_NPM_TOKEN` environment variable for authentication.

```shell
pnpm install
```

If you see authentication errors, verify that:
- The `BRYNTUM_NPM_TOKEN` environment variable is set
- Your token is valid and has access to Scheduler Pro packages
- You've logged in to your Bryntum account

## Deployment

**⚠️ License Requirement for Server Deployment**: Trial licenses **cannot** be used for server deployments. You must have a **commercial license** to deploy this application to any server environment (Vercel, AWS, Heroku, etc.). Trial licenses are restricted to local development only.

### Vercel Deployment

This repository is configured for deployment on Vercel. To deploy:

1. **Ensure you have a commercial Bryntum license** (trial licenses will not work on servers)
2. Set the `BRYNTUM_NPM_TOKEN` environment variable in Vercel with your **commercial license token**
3. Connect this repository to Vercel
4. Deploy automatically on push or manually via Vercel CLI

For more information on configuring npm for Bryntum packages, see the [Bryntum npm repository guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/npm-repository#configure-npm).

## Troubleshooting

### Authentication Errors During Installation

If you encounter authentication errors when running `pnpm install`:

1. **Verify your token is set:**
   ```shell
   echo $BRYNTUM_NPM_TOKEN
   ```
   If this is empty, the token is not set in your current shell session.

2. **Check your .npmrc file:**
   The `.npmrc` file should contain:
   ```
   @bryntum:registry=https://npm.bryntum.com
   //npm.bryntum.com/:_authToken=${BRYNTUM_NPM_TOKEN}
   //npm.bryntum.com/:strict-ssl=false
   ```

3. **Re-export the token:**
   ```shell
   # If using .env file:
   export BRYNTUM_NPM_TOKEN=$(grep "^BRYNTUM_NPM_TOKEN=" .env | cut -d'=' -f2)
   
   # Or set it directly:
   export BRYNTUM_NPM_TOKEN="your-token-here"
   ```

4. **Verify token validity:**
   - Log in to [bryntum.com](https://bryntum.com) and check your account
   - Ensure your account has access to Scheduler Pro (trial or commercial license)
   - **Trial licenses**: 
     - Check if your trial period is still active
     - Remember: Trial licenses only work for local development, not on servers
   - **Commercial licenses**: Verify your license is current and active
   - Generate a new token if needed
   - Note: Both trial and commercial tokens work the same way for authentication, but trial licenses cannot be used for server deployments

### Packages Already Installed

If packages are already installed in `node_modules`, the app will run even without the token set. However, you'll need the token to:
- Install new packages
- Update existing packages
- Run fresh installs (after deleting `node_modules`)

### Environment Variable Not Persisting

If you need to set the token every time you open a new terminal:

1. Add it to your shell profile (`~/.zshrc` or `~/.bashrc`):
   ```shell
   export BRYNTUM_NPM_TOKEN="your-token-here"
   ```

2. Or use a `.env` file and source it:
   ```shell
   # Add to your shell profile:
   if [ -f .env ]; then
     export BRYNTUM_NPM_TOKEN=$(grep "^BRYNTUM_NPM_TOKEN=" .env | cut -d'=' -f2)
   fi
   ```

## Additional Resources

- [Bryntum npm repository guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/npm-repository)
- [Bryntum Licensing](https://bryntum.com/licensing/)
- [Bryntum React integration guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/integration/react/guide)
- [Bryntum Scheduler Pro documentation](https://bryntum.com/products/schedulerpro/docs/)
- [Bryntum support Forum](https://forum.bryntum.com/)

