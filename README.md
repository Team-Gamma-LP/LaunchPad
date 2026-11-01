# LaunchPad

**Every launch. One organized platform.** Mobile-first guest check-in and live audience polling for product launches, built by Team Gamma for the Oxygene Graduate Trainee Hackathon (Brief A).

**Live demo:** https://launchpad-team-gamma.vercel.app  ·  **Walkthrough:** [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md)

## The problem

Oxygene's ushers lose time searching printed guest lists at the door, and the client wants audience polls during the presentation. LaunchPad connects the two: a fast usher check-in, and a poll screen that opens on each guest's phone once they are admitted.

## What it does

| Screen | Used by | What it does |
| --- | --- | --- |
| **Usher check-in** | Ushers | Look up a guest by check-in code, admit them, or add and admit a walk-in; duplicate admission refused |
| **Guest poll** | Attendees | Personal link unlocks after admission: product story and live polls, one vote per poll |
| **Organizer dashboard** | Client admin | Check-in count, recent arrivals and poll results |

All three Brief A must-haves are covered; a typed code stands in for QR scanning. Also built: guest list management (150 seeded guests), usher team, product and event setup, poll admin, and an email outbox that previews invitations.

## Try it in two minutes

1. Open the live demo and click a **demo role button** on the login page (no password needed).
2. Follow [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md) for a five-minute walkthrough.

## Team Gamma

| Member | Role | Focus |
| --- | --- | --- |
| Alex Kinyua | Group Lead | Scope, repo admin, deployment, docs, reviews |
| Judy Chelangot | UI/UX Designer | Design system, flows, phone-first screens |
| Damaris Nzivah | Front-end Developer | Screens, responsiveness |
| David Kinuthia | Full-stack Developer | Data logic, tests, admin, Vercel config |

We built LaunchPad together on one shared laptop, so the first commit does not show who did what. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Run locally

Requires Node.js 20.19+ or 22.12+.

    npm ci
    npm run dev      # http://localhost:5173
    npm test
    npm run build

Stack: React, Vite, browser localStorage. Deployed as a static site on Vercel.

## Honest limitations and next steps

- **No shared backend.** Data lives in each browser's localStorage, so check-ins and votes do not sync across phones. Demo all roles in tabs of one browser. A shared backend with real-time sync is the first production step.
- **Demo authentication only.** Accounts ship as downloadable seed data.
- **Email is preview only.** Delivery through EmailJS was not verified.
- **Typed code instead of QR scanning.** The usher looks up guests by exact check-in code. Name search is not built.
- **Future work:** pricing at launch, multi-event workspaces, QR scanning, delivery reporting.

## More documentation

[Implementation notes](docs/IMPLEMENTATION-NOTES.md) · [Product documentation](docs/PRODUCT-DOCUMENTATION.md) · [Test report](docs/TEST-REPORT.md) · [Contributing](CONTRIBUTING.md)
