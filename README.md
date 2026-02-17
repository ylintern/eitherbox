# Welcome to your Lovable project

## Project info

**URL**: yieldlounge.com

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.


## Runtime API configuration

Copy `.env.example` to `.env` (or `.env.local`) and fill in your own keys:

```sh
cp .env.example .env
cp .dev.vars.example .dev.vars
```


For local Worker secret testing, use `.dev.vars` (already gitignored):

```sh
# never commit this file
cp .dev.vars.example .dev.vars
```

The frontend now calls Worker backend endpoints for live data:
- `/api/uniswap/quote` for token quote rates (`chain=unichain|ethereum|base`)
- `/api/onchain/pools` for tracked Unichain pool snapshots (RPC-backed)
- `/api/wallet/overview` for wallet balances and position placeholders

For deployed Workers, keep CoinGecko credentials server-side only:

```sh
wrangler secret put COINGECKO_API_KEY
wrangler secret put ALCHEMY_UNICHAIN_URL
wrangler secret put GOLDSKY_RPC_URL
wrangler secret put GRAPH_API_KEY
wrangler secret put UNISWAP_API_KEY
```

Notes:
- Keep **Uniswap TWAP/oracles** as the primary onchain price reference.
- Use Uniswap Trading API + The Graph for live quotes (trading API first, then chain-aware subgraph lookup), with CoinGecko as a safe fallback if upstream quote providers fail.
- Never commit real keys to git; use environment variables and Worker secrets only.
- If credentials have ever been shared in chat or logs, rotate them immediately and replace them in your local env / provider dashboard.

### Uniswap integration modules

A dedicated scaffold now lives under `src/uniswapintegration/`:
- `types/` for integration request/response contracts
- `services/` for backend quote API calls
- `hooks/` for React quote-fetch lifecycle
- `constants/` for supported token lists

These modules are now wired into Swap/Pool/Yield tabs and can be extended with Uniswap ABI position + TWAP/oracle readers in the next step.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/91d0f1cd-055c-452f-b675-cea94ff507d7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Deploy to Cloudflare Workers (eitherbox)

This repository is configured to deploy as a Cloudflare Worker named **`eitherbox`** using static assets from `dist/`.

### Why the previous build failed
Cloudflare auto-detected Bun and ran `bun install --frozen-lockfile`. The existing Bun lockfile format was outdated for the runtime in Cloudflare, which caused:

- `Outdated lockfile version: failed to parse lockfile: 'bun.lockb'`
- `error: lockfile had changes, but lockfile is frozen`

To avoid that path, the Bun lockfile was removed so Cloudflare uses npm lockfiles instead.

### Local commands

```sh
npm run build
npm run cf:preview
npm run cf:deploy
```

### Required Cloudflare settings

- **Worker name:** `eitherbox`
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`

If deploying from CI/CD, authenticate first with:

```sh
npx wrangler login
```
