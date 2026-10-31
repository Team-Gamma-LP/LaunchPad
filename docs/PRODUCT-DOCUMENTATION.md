# LaunchPad

**Product owner:** Team Gamma · **Version:** Hackathon prototype 1.0 · **Prepared:** 31 October 2026

## Product purpose

LaunchPad gives Team Gamma a repeatable way to run product launches for multiple clients. It connects three moments: inviting an audience, welcoming people at the door, and engaging them during the presentation. The initial brief describes approximately 200 attendees; this prototype seeds 150 invitations and configures capacity as 200.

The pilot is Verdae, with an event on 1 December 2026 at Two Rivers Mall. The 5:00 pm start is a placeholder pending confirmation. The account is assigned to judieysiggy@gmail.com. Four user-supplied emails are the only real guest recipients; remaining addresses are dummy `.invalid` addresses. Display names are synthetic and are not claims about the owners of the test email addresses.

## Problem and value

Printed guest lists interrupt arrivals and make attendance hard to track. Separate poll tools fragment the audience experience. A reusable client workspace reduces the repeated setup Team Gamma would otherwise do for each launch and keeps each client's event brand visible to guests.

The prototype demonstrates the intended workflow. It does not solve shared multi-device state, trustworthy access control, or secure identity. Those require a shared backend or managed services before a real 200-person event.

## People and responsibilities

| Person | Responsibility | Prototype access |
| --- | --- | --- |
| Team Gamma operator | Provision client workspace and support launches | Future onboarding feature; static demo accounts today |
| Client administrator | Configure product/event, team, invitations and polls | Client dashboard |
| Usher | Look up ticket, admit guest, share guest link | Check-in page |
| Guest | Present ticket, discover product, vote | Personal token link |

## Scope and functional requirements

| Feature | Implemented behavior | Boundary |
| --- | --- | --- |
| Marketing page | Explains the value and leads to login | No sales lead submission |
| Login | Email/password comparison against salted password verifiers | Downloadable demo data; not secure authentication |
| Multiple clients | Client-keyed state and separate workspaces | One event per client; logical isolation only |
| Team management | Add, view, edit and delete named usher accounts; generate initial password and welcome email | Deletion or email changes revoke browser-local sessions; no password reset or activation flow |
| Product setup | View and edit name, tagline, story, image URL/upload; delete with its launch | Small uploads to fit browser storage |
| Event setup | View, edit, delete and restore the client launch | One combined event/product per client; deleting pauses guest access and operations while retaining records |
| Guest list | 150 initial records; add, view, edit, delete, search/filter and export | No bulk import; deleted guests lose their token link and their poll responses are removed |
| Invitations | Ticket and event details, individual or batch email | 146 dummy recipients always previewed |
| Check-in | Check-in-code lookup; add-and-admit walk-ins with auto-generated code; enforce admission capacity | No QR scanning or live multi-device consistency |
| Duplicate admission | Refuse repeat admission of an admitted record | No atomic transaction under competing browser writes |
| Guest unlock | Product and polls available after admission | Client-side gate can be bypassed |
| Polls | Create, view, edit, delete, open/close and inspect responses | Choices lock after responses exist; one response per guest token per poll, browser enforced |
| Dashboard | Guests, attendance, votes, ushers, arrivals and pulse | Updates across same-origin tabs through storage events |
| Email outbox | Preview/sent/failed states and full email details | Provider acceptance is not inbox confirmation |
| Terminal logs | Development-only email mirror | Production static build has browser logs only |
| Exports | Download latest JSON snapshots | No restore/import UI |

## User journeys

**Client admin:** Read LaunchPad landing page → login → review overview → configure event/product → create ushers → inspect guest list → prepare/send invitations → create and control polls → monitor attendance and results → export snapshot.

**Usher:** Receive welcome email → login → enter guest ticket → verify guest → admit → admission timestamp and usher email saved → guest-link notification prepared/sent → share link manually if necessary. Previously admitted tickets show their status and cannot be admitted again.

**Guest:** Receive event invitation and ticket → attend launch → present ticket → receive post-admission personal link → view product story → open Live polls → submit one choice → see aggregate results. Before admission, the personal link shows the invitation and ticket only.

## Data contract

`State { version, clients: Record<ClientId, Client> }`

`Client { name, event, guests[], ushers[], polls[], emails[] }`

`Event { title, date, venue, capacity, about, productName, tagline, productAbout, image }`

`Guest { id, name, organization, ticketType, checkInCode, email, realRecipient, token, source?, admittedAt, admittedBy }`

`User { id, clientId, name, email, role, salt, passwordHash }`

`Poll { id, question, options[], open, votes: Record<GuestToken, Option> }`

`Email { id, to, subject, message, createdAt, status, error? }`

The standalone guest JSON and **Export guests** use exactly `Name`, `Organization`, `Ticket type`, and `Check-in-code`. Email is optional contact data in the internal state and full backup, so invitation workflows continue to work. Old `ticket` fields migrate to `checkInCode`, with missing organizations marked `Not provided` and ticket types set to `General admission`. Existing codes, tokens, admissions, votes and customized fields are preserved.

New guests receive a unique code from a client counter, which is not rolled back on deletion. Editing does not change their code or token. A walk-in is added and admitted together after capacity validation, with timestamp and usher saved. Guest deletion removes that token's poll responses so totals remain consistent. Seeded personal tokens are random 18-byte values; new records use UUIDv4. Passwords use salted PBKDF2-SHA256, 100,000 iterations. Browser-delivered accounts remain demo authentication; email previews retain generated usher passwords.

Launch deletion sets `event.deletedAt` and hides its guest pages. Invitations, new guests, admissions and voting pause until the admin restores the launch. Guest, team, poll and email records remain available to the admin. This recoverable deletion avoids discarding event history during a demo.

## Technical design

React and Vite produce a static browser app. Hash routes support static hosting without server rewrite rules. `#/` is marketing, `#/login` is sign-in, `#/admin` is the admin workspace, `#/usher` is check-in, and `#/guest/{clientId}/{token}` is a personal guest entry point. Session metadata is tab-scoped in sessionStorage. Application state lives in localStorage. Seed data is read only when no valid version-1 state exists. Application changes do not overwrite source JSON; exports produce downloadable files.

EmailJS is an optional external email service called from the browser. Its public configuration is built into the frontend through Vite environment variables. A development-only Vite middleware mirrors email attempts into terminal output. No application backend or database is included.

Static hosting may add a private access gate. An owner-private hosted demo cannot be opened by invited guests who lack that hosting access. Use the local demo for judging or explicitly arrange audience access later. Publishing does not change storage into a shared database.

## Experience and visual identity

### LaunchPad and VERDAE content update

The first page introduces LaunchPad by Team Gamma using the supplied eight-feature overview and five-step workflow. The VERDAE product is the Complete Botanical Skincare Set, consisting of Botanical Cleanser, Botanical Moisturizer and Daily Sunscreen. The tagline is “Your daily ritual, rooted in nature.” SPF/UVA details, skin type, sizes and price remain qualified or unconfirmed exactly as supplied.

Event records now also include `productIncluded: {name,description}[]`, `productSteps: {name,description}[]`, `productInfo: {brand,category,type,skinType,packaging,price,size}`, and `productWhy`. All are edited through Product & event. A shared ProductExperience component renders the saved data for the admin preview and admitted guest Discover page. Existing guest admission requirements remain in effect. The admin preview itself never changes admission status.

Content revision 2 upgrades the original seeded copy while preserving custom admin edits, client records, admissions and poll responses. A storage migration carries earlier browser data to `launchpad.v1`. Email preview mode remains the default while EmailJS setup is deferred.

LaunchPad uses restrained operational styling: deep green, pale neutral surfaces, compact navigation, visible status labels, and clear actions. Guest pages follow the Verdae reference: warm cream, botanical sage, olive, muted gold cues, editorial serif headings, and the supplied product montage. Layouts adapt to narrow screens; ticket search and voting are the primary mobile interactions. Form labels, semantic buttons, focus outlines, and text statuses support accessibility. External Google Fonts have system fallbacks; offline font loading is not required for function.

## Business model hypothesis

Team Gamma can package LaunchPad as an event operations service: a setup fee per launch, an event delivery fee based on guest volume/support, and a recurring plan for clients or agencies running frequent launches. Optional future services include custom branding, managed invitations, event staffing support, analytics exports, CRM integration, and enterprise account management. These are hypotheses; no validated pricing, revenue, adoption, ROI, or market-size claims are made.

The repeatable asset is the event workflow and configurable branded experience. A production system should separate organizations, users, events, and memberships rather than assuming one event per client.

## Success measures for a pilot

- Time from ticket search to admission; target to be established through a timed pilot.
- Duplicate admissions prevented and ticket-search failures.
- Attendance as a share of invitations.
- Poll participation as a share of admitted guests.
- Email provider acceptance, delivery failures, and manual interventions.
- Admin setup time and support effort per launch.

No measured performance results are claimed by the current prototype.

## Production roadmap

1. Validate the user flows with Team Gamma, one client admin and ushers. Confirm event time, approved product copy, image permissions, and privacy requirements.
2. Add managed authentication, server-enforced client/event membership and expiring usher invitations. Replace emailed permanent passwords with activation links.
3. Add a shared managed datastore with atomic check-in and one-vote constraints, event-scoped identifiers, audit logs, real-time subscriptions and backup/restore.
4. Move bulk email orchestration to a server queue with provider webhooks, retries, bounce handling, suppression and delivery reporting. Minimize personal data in logs.
5. Add QR ticket scanning, multi-event workspaces, richer guest management and reporting once pilot needs justify them.

For the hackathon, show all roles in tabs of a single browser. For a live event, do not use this prototype as the authoritative admission or polling system until shared state and trusted access are implemented.
