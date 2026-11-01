# LaunchPad

**Every launch. One organized platform.** Mobile-first guest check-in and live audience polling for product launches, built by Team Gamma for the Oxygene Graduate Trainee Hackathon (Brief A).

**Live demo:** https://launchpad-team-gamma.vercel.app  ·  **Walkthrough:** [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md)

## The problem

Oxygene's ushers lose time searching printed guest lists at the door, and the client wants audience polls during the presentation. LaunchPad connects the two: a fast usher check-in, and a poll screen that opens on each guest's phone once they are admitted.

## What it does

| Brief must-have | LaunchPad |
| --- | --- |
| Usher screen to search guests and mark them checked in (typed code stands in for QR) | Usher portal: search by check-in code or name, admit, duplicate admission refused |
| Attendee mobile poll screen | Personal guest link that unlocks after admission: product story and live polls, one vote per poll |
| Organizer view with check-in count and live poll results | Admin dashboard with attendance, arrivals and results |

Also built: guest list management (150 seeded guests), usher team, product and event setup, poll admin, and an email outbox that previews invitations.

## Try it in two minutes

1. Open the live demo and click a **demo role button** on the login page (no password needed).
2. Follow [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md) for a five-minute walkthrough.

## Team Gamma

| Member | Role |
| --- | --- |
| Alex Kinyua | Group Lead: scope, documentation, GitHub workflow and reviews, deployment and release verification |
| Judy Chelangot | UI/UX Designer |
| Damaris Nzivah | Front-end Developer |
| David Kinuthia | Full-stack Developer |

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
- **Typed code instead of QR scanning.** As the brief allows.
- **Future work:** pricing at launch, multi-event workspaces, QR scanning, delivery reporting.

## More documentation

[Implementation notes](docs/IMPLEMENTATION-NOTES.md) · [Product documentation](docs/PRODUCT-DOCUMENTATION.md) · [Test report](docs/TEST-REPORT.md) · [Contributing](CONTRIBUTING.md)
