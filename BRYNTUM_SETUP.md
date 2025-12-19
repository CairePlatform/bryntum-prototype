# Bryntum Setup Guide

This project uses Bryntum Scheduler Pro packages from their private NPM registry. This guide covers everything you need to set up Bryntum authentication and licensing.

## Prerequisites

- Node.js >= 20.0.0
- pnpm (recommended), npm, or yarn
- A Bryntum account with access to Scheduler Pro (trial or licensed)

## License Strategy

This project uses a **two-tier licensing approach** for security and cost efficiency:

- **Local Development**: Developers use **trial licenses** (free, no commercial token needed)
- **Server Deployment**: **Commercial license** is used automatically on Vercel (configured via environment variables)

This approach:
- ✅ Keeps the commercial token secure (only in Vercel, not in developer environments)
- ✅ Allows developers to work without needing access to commercial credentials
- ✅ Reduces risk of token leakage or accidental exposure
- ✅ Automatically handles production deployments on Vercel

## License Types

This project requires access to Bryntum Scheduler Pro packages. 

**💡 For Developers**: Use a **trial license** for local development. You don't need the commercial token.

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
- **Getting a trial token**: Sign up for a free trial at [bryntum.com](https://bryntum.com), then create a token using `npm token create --registry=https://npm.bryntum.com` (see Step 1 below)
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
- **Getting a commercial token**: Purchase a license, then create a token using `npm token create --registry=https://npm.bryntum.com` (see Step 1 below)
- **Use case**: Production applications, commercial products, and SaaS offerings

**Important Notes**:
- Both trial and commercial tokens work the same way for NPM authentication. The token format and usage are identical.
- **Trial licenses are restricted to local development only** - they cannot be used for server deployments or production environments.
- **Commercial licenses are required** for any server deployment (Vercel, AWS, Heroku, Docker containers, etc.).
- The difference is in the license terms and what you're allowed to do with the software.

## Initial Setup

### Step 1: Get Your Bryntum NPM Token

**💡 For Developers: Use a Trial License**

All developers should use a **trial license** for local development. You do not need access to the commercial license token.

**Getting Your Trial Token:**

Tokens are created via command line, not from the dashboard. Follow these steps:

1. **Sign up for a free trial** at [https://bryntum.com](https://bryntum.com) (if you don't have an account)

2. **Log in to npm.bryntum.com**:
   ```bash
   npm login --registry=https://npm.bryntum.com
   ```
   Enter your Bryntum account email and password when prompted.

3. **Create an access token**:
   ```bash
   npm token create --registry=https://npm.bryntum.com
   ```
   Enter your password when prompted. The command will output a table with your token:
   ```
   ┌──────────┬─────────────────────────┐
   │ token    │ eyJhb...                │
   ├──────────┼─────────────────────────┤
   │ user     │ user@example.com       │
   ├──────────┼─────────────────────────┤
   │ readonly │ false                   │
   ├──────────┼─────────────────────────┤
   │ created  │ 2021-07-20T01:02:03.00Z │
   └──────────┴─────────────────────────┘
   ```
   Copy the token value (the `eyJhb...` part).

4. **View existing tokens** (optional):
   ```bash
   npm token list --registry=https://npm.bryntum.com
   ```

5. **Use this token** in your local `.env` file (see Step 2)

For detailed instructions, see the [Bryntum npm repository guide - Access Tokens](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/npm-repository#access-tokens).

**Important Notes:**
- Trial licenses work perfectly for local development
- Trial licenses cannot be used for server deployments (Vercel uses the commercial license automatically)
- The commercial license token is only stored in Vercel environment variables
- Developers don't need access to the commercial token

**For Administrators (Commercial License Setup):**

If you need to set up or update the commercial license on Vercel:

1. **Get the commercial token:**
   - Log in to npm.bryntum.com with the commercial license account:
     ```bash
     npm login --registry=https://npm.bryntum.com
     ```
   - Create a new token:
     ```bash
     npm token create --registry=https://npm.bryntum.com
     ```
   - Copy the token from the output (or view existing tokens with `npm token list --registry=https://npm.bryntum.com`)

2. **Configure in Vercel:**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Set `BRYNTUM_NPM_TOKEN` with the commercial license token
   - Ensure it's available for Production, Preview, and Development environments

3. **Verify deployment:**
   - The repository auto-deploys on push
   - Vercel will use the commercial token automatically during builds

**Token Format:**
- Both trial and commercial tokens work the same way for NPM authentication
- The token format and usage are identical
- For detailed instructions, see the [Bryntum npm repository guide](https://bryntum.com/products/schedulerpro/docs/guide/SchedulerPro/npm-repository)
- For licensing information, visit [Bryntum Licensing](https://bryntum.com/licensing/)

### Step 2: Set Up Your Environment

**Option A: Using .env file (Recommended for convenience)**
```shell
# Copy the example file
cp .env.example .env

# Edit .env and replace 'your-bryntum-npm-token-here' with your trial token
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

> **Important**: Use your own **trial token**. Do not use any commercial token - that's only configured in Vercel for deployments.

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

### Vercel Deployment (Already Configured)

This repository is **automatically deployed to Vercel on push** using a commercial Bryntum license.

**Current Setup:**
- ✅ Repository is connected to Vercel
- ✅ Commercial license token is configured in Vercel environment variables
- ✅ Auto-deploys on every push to the main branch
- ✅ Developers don't need to do anything - deployment happens automatically

**For Administrators - Updating the Commercial License:**

If you need to update the commercial license token on Vercel:

1. **Get the commercial token:**
   - Log in to npm.bryntum.com with the commercial license account:
     ```bash
     npm login --registry=https://npm.bryntum.com
     ```
   - Create or view tokens:
     ```bash
     # Create a new token
     npm token create --registry=https://npm.bryntum.com
     
     # Or view existing tokens
     npm token list --registry=https://npm.bryntum.com
     ```
   - Copy the token from the output

2. **Update in Vercel:**
   - Go to Vercel project → Settings → Environment Variables
   - Find `BRYNTUM_NPM_TOKEN`
   - Update with the new commercial token
   - Ensure it's available for Production, Preview, and Development environments

3. **Redeploy:**
   - The next push will automatically use the updated token
   - Or manually trigger a redeploy from Vercel dashboard

**Important Notes:**
- ⚠️ Trial licenses **cannot** be used for server deployments
- ✅ Commercial license is required for Vercel deployments (already configured)
- ✅ Developers use trial licenses locally (no commercial token needed)
- ✅ Commercial token is only stored in Vercel (secure, not in repository)

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
   - View your tokens: `npm token list --registry=https://npm.bryntum.com`
   - Ensure your account has access to Scheduler Pro (trial or commercial license)
   - **Trial licenses**: 
     - Check if your trial period is still active
     - Remember: Trial licenses only work for local development, not on servers
   - **Commercial licenses**: Verify your license is current and active
   - Create a new token if needed: `npm token create --registry=https://npm.bryntum.com`
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

