# Implementation notes

Technical detail moved out of the main README. See the README for the overview and docs/DEMO-SCRIPT.md for the walkthrough.

A frontend-only React hackathon prototype for product-launch invitations, usher check-in, a branded guest experience, and audience polls.

## Vercel deployment

[Deploy LaunchPad to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTeam-Gamma-LP%2FLaunchPad)

Import this repository with the project root set to the directory containing `package.json` and `vercel.json`. The configuration runs `npm ci`, then `npm test && npm run build`, and serves `dist`. Navigation uses hash routes (`#/login`, `#/admin`, `#/usher` and personal guest links), so no SPA rewrite is required.

Set `VITE_EMAIL_MODE=preview` for the public demo. Do not upload `.env` files or private keys. To make the deployed demo accessible without a Vercel login, review the project's Deployment Protection settings and verify its production URL in a signed-out browser. The `public` option in `vercel.json` controls visibility of build logs/source and does not disable visitor authentication.

**Live demo:** https://launchpad-team-gamma.vercel.app

Each visitor still has separate browser-local guests, admissions, usher accounts and poll results. A public deployment does not add shared storage or production authentication.

## LaunchPad content update

### Guest and event management update

- **Guest list:** Add guest, View, Edit and Delete. Name, Organization and Ticket type are required; email is optional. The Check-in-code is generated automatically and remains stable on edit. Deleting a guest removes their admission and votes, and invalidates their guest link.
- **Usher portal:** **Add & admit walk-in** collects the same details, assigns a unique code and admits the guest immediately. Admission respects event capacity.
- **Team:** Add named ushers, view details, edit name/email and delete accounts. Email changes and deletion end sessions using the old account details. Existing admission history remains.
- **Product & event:** View launch, Edit launch, Delete launch and Restore & edit launch. Deletion hides the product/event from guests and pauses invitations, admission and voting while retaining the client records.
- **Polls:** View, Edit and Delete alongside existing create/open/close controls. Answer choices cannot change after a response has been recorded; existing responses are retained on allowed edits.
- **Guest JSON:** `public/guests-150.json` and **Export guests** contain exactly `Name`, `Organization`, `Ticket type`, `Check-in-code`. Full backups retain optional email and internal IDs/admission data.

Saved browser data upgrades automatically to content revision 3. Existing codes, guest links, check-ins, votes and custom product edits are retained. Missing organization values become **Not provided**; the admin can edit them. New guest/team/poll records continue to be browser-local.

### Access from another device on the same network

Open the development server's printed **Network** URL on the other device (currently `http://<your-LAN-IP>:5173/` on this Wi-Fi connection). `localhost` on a phone refers to the phone itself. The IP can change between networks. Refresh the device after updating this project.

Password checks work on local-network HTTP: secure origins use native SubtleCrypto; HTTP origins use `@noble/hashes` PBKDF2-HMAC-SHA256 with the same salt encoding, 100,000 iterations and 32-byte output as existing accounts. Event IDs use native randomUUID when available and cryptographically random UUIDv4 values from getRandomValues otherwise. Existing demo passwords do not change.

This compatibility fix does not add shared storage. Seeded accounts are available on each device; new usher accounts, check-ins and poll responses still live in the browser where they were created.

### Product content

The root page is the LaunchPad by Team Gamma introduction, with all eight feature descriptions and the five-step workflow. VERDAE is the featured client product. In **Product & event**, choose **Edit launch** to edit the full product copy, image and event settings. Saving returns to **View launch**, which shows the saved guest experience. The editor also offers **Preview guest page**. Previewing does not admit a guest or change attendance.

The supplied default is the **VERDAE Complete Botanical Skincare Set** with the tagline **Your daily ritual, rooted in nature.** The original botanical reference image is retained. New records use the updated copy. Existing browser state is migrated without removing guest records, admission timestamps, votes or custom product edits. Older platform storage is read once into `launchpad.v1`; it is retained as a fallback copy.

## Work in VS Code

The login form starts with empty email and password fields. Manual sign-in uses entered credentials. The demo role buttons open the corresponding demo workspace immediately using its account record; no password entry or separate Sign in click is needed, and no demo passwords are displayed on the login page.

The visual system is defined in `src/design-system.css`: Instrument Sans for body copy and forms, Space Grotesk for interface headings, DM Mono for ticket codes and numerical details, and Cormorant Garamond for editorial/Verdae headings. A shared Brand component uses the generated LaunchPad mark, with a live-text wordmark. The campaign hero and login background use the generated event venue image. Font families have system fallbacks.

The landing page and overview use viewport-triggered section reveals. Screen changes, ticket lookup, result bars, buttons, images and navigation have short transitions. `prefers-reduced-motion` removes motion. Main body text is 17px on desktop and 16px on phones, and inputs remain at least 16px. Test-recipient controls are grouped in a disclosure above the guest list. See `docs/ASSET-PROMPTS.md` for the exact image-generation prompts.

Open `LaunchPad.code-workspace`. Dependencies are installed in this checkout. Run `npm run dev` in the integrated terminal, or select **Terminal → Run Task → LaunchPad: Start development server**. Use **Ctrl+Shift+B** to build. Once the server is running, the Run and Debug panel offers **LaunchPad: Debug in Edge**.

The source is organized for editing:

```text
src/
  main.jsx          React entry point
  App.jsx           Routes, local state, authentication and email orchestration
  shared.jsx        Shared display, link and seed helpers
  domain.js         Check-in, voting, password hashing and exports
  domain.test.js    Domain rule tests
  design-system.css Platform and Verdae visual system
  pages/            Landing, login, admin sections, usher and guest views
  components/       Reusable poll result display
public/             Seed records, demo accounts, guest JSON and Verdae image
docs/               Product documentation, pitch prompt and validation notes
.vscode/            Development, build, test and debugger shortcuts
```

EmailJS setup is deferred. `VITE_EMAIL_MODE=preview` is the default in the environment files, so email actions produce previews and development terminal logs. Later, finish the provider template setup and explicitly set `VITE_EMAIL_MODE=live` in `.env.local`, then restart or rebuild.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the printed URL, normally <http://localhost:5173>. `npm test` checks domain rules; `npm run build` produces the static site in `dist/`. `npm run preview` serves that build.

## Storage and exports

`public/seed.json` initializes browser storage on first visit. `public/guests-150.json` is the requested standalone guest file. `public/demo-accounts.json` contains salted PBKDF2 password verifiers. New usher records use the same hashing method. A browser cannot keep any downloaded JSON secret; these are not secure authentication or authorization mechanisms.

Browser changes are saved under `launchpad.v1`. Export JSON downloads a full snapshot; Export guests downloads the current guest list. Browsers cannot silently overwrite the source JSON file. Export is the persistence handoff. Import/restore is not implemented. To reset, export anything needed and clear this site's browser storage; the next load uses the seed again.

Phones, different browsers, different origins and private windows do not share localStorage. Even opening the same server from a phone does not share attendance or votes with the laptop. Demo using multiple tabs in one browser. There is no atomic coordination across simultaneous tab writes, so this is unsuitable for concurrent production check-in.

## Terminal email output

Each email attempt is logged in the browser console and displayed in Email outbox. During `npm run dev`, a Vite development-only logging middleware mirrors email details into the terminal. It does not authenticate users, store application data, or send email. The production app is static and has no logging endpoint; deployed browsers cannot print into a remote terminal without a server. Demo email logs include generated passwords and personal guest links: use disposable credentials and treat exports and logs as private.
