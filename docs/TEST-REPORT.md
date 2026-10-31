# Prototype validation

Validated locally on 31 October 2026.

## Management and guest-schema update

- Automated coverage includes unique guest codes after deletion, stable codes/tokens on edit, walk-in admission timestamps, capacity rejection without partial additions, guest deletion and vote cleanup, poll edit restrictions, session revocation after team edits/deletion, and migration from the previous guest schema.
- Production build passes. The guest JSON has 150 unique Check-in-codes and exactly the four requested export fields.
- Browser checks: admin guest add/view/edit; generated code shown in the list; delete confirmation/cancellation; team add/view/edit; poll create/view/edit; voted choices locked; launch view/save/delete/restore; an open guest page becomes unavailable on deletion and returns after restore.
- Browser walk-in test: added a guest with Name, Organization and Ticket type, received a new Check-in-code, was immediately marked admitted, and appeared in the admin list through a storage update. The welcome notification remained an email preview.
- Phone-width walk-in form reviewed for contained layout and scrolling. Desktop guest table retains contained horizontal scrolling for all fields and actions. No physical-device or production concurrency test is claimed.
- Guest/team/poll destructive operations are covered in domain tests. Browser checks for permanent deletion stopped at the confirmation; only recoverable launch deletion was completed in the browser.
- UI test records are explicitly named Demo and exist only on the isolated 127.0.0.1 browser origin. The source seed remains 150 guests. Email mode remained preview.

## Login interaction update

- Build passes. Browser review confirmed email/password start empty and remain empty after logout; no demo password is displayed on the login page.
- Each demo button opens its role's workspace directly: Verdae admin → Verdae dashboard, Event usher → ticket check-in, Second client → Team Gamma Studio dashboard. No separate Sign in click is required.
- The login component no longer contains hardcoded account emails or passwords; demo shortcuts read their account records from the fixture/state.

## Local-network HTTP login fix

- Nine automated tests pass. New coverage checks the fallback against all seeded admin credentials and the seeded usher, rejects incorrect passwords, compares native/JS/Node PBKDF2 outputs with Unicode input, and checks UUIDv4 formatting and uniqueness without randomUUID.
- Production build passes with the JavaScript password fallback split into lazy-loaded chunks.
- Browser login succeeded as both the Verdae admin and demo usher at `http://172.22.2.25:5173/`, exercising the non-localhost HTTP origin that caused the reported issue. Physical-device testing was not performed.
- No stored password hashes or existing passwords were changed. No emails were sent during this fix.

## Visual refinement validation

- Custom hero and transparent logo generated, saved into the project and visually inspected. Both loaded successfully in the browser. The hero replaces the Verdae collage on the platform landing page and is reused on login.
- Production build and all five existing domain/migration tests pass after the visual changes.
- Desktop browser review: landing, login, admin overview, guest list, poll composer, team, product editor, email outbox and admitted guest product/poll screens.
- Phone-width layout checks: landing, admin overview, guest list, guest polls and usher check-in. Measured page widths equal content widths on those screens, with table overflow contained within the table area.
- Verified landing body typography at 16px and headline at 51px at phone width. Check-in input typography is 17px.
- Usher ticket search still resolves VD-0005 and shows its existing admitted status. Existing admissions and poll responses are preserved. No emails were sent as part of the visual refinement.
- CSS includes reduced-motion handling and visible keyboard focus indicators. No full accessibility audit or physical-device testing is claimed.

## LaunchPad update validation

- Build and all five automated tests passed, including two migration tests for preserved activity, custom product edits and idempotency.
- Root-page browser review confirmed LaunchPad/Team Gamma branding, all eight feature descriptions and all five workflow steps.
- Existing stored Verdae guest data loaded with the new product defaults, preserving an existing admission and poll response.
- Full admin product editor and preview verified. A temporary price edit was saved, observed in the admin preview and actual admitted guest page, then restored to the supplied “To be determined” value. The open guest tab received the restored value.
- Guest content includes the supplied description, three products, three usage steps, all product information fields and the product rationale.
- The VERDAE page was visually inspected at a mobile viewport with no horizontal overflow (375 CSS pixels).
- Email sending remains in preview mode. No emails were sent during this update.

## Passed

- Production build: `npm run build`.
- Three automated domain tests: case-insensitive ticket admission and duplicate rejection; client-scoped lookup; admission/open-poll/valid-option/one-vote rules.
- Local preview returns HTTP 200.
- Browser sign-in as Verdae admin and demo usher.
- Admin displays 150 guests, capacity 200, two open polls and one seeded usher.
- Event displays 1 December 2026 at Two Rivers Mall.
- Guest VD-0005 initially displays the ticket and locked experience.
- Usher search finds the guest; admission sets the timestamp and prevents another Admit action.
- Admission creates a personal-link email preview; the full email is mirrored into the local development terminal.
- Already-open guest tab unlocks through browser storage updates.
- Guest submits a poll response and sees 100% for their selected option, with one total response; voting controls disappear for that poll.
- Admin subsequently shows one admission and one poll response.
- Verdae guest page visually reviewed at a phone-sized viewport; measured content width equals available width (375 CSS pixels), with no horizontal overflow. Desktop dashboard visually reviewed.

Browser testing used a dummy email recipient. The source seed remains clean with zero admissions and votes; only the local testing browser contains the demonstration activity.

## Not verified / limitations

- EmailJS integration was tested using the supplied service/public key and corrected template ID `template_dbb8hft`, with a browser invitation attempt to dmuriu0@gmail.com. The template is now recognized, but EmailJS returned “The recipients address is empty”. The template must map its To Email field to `{{to_email}}`; the application supplies this parameter. No successful real delivery is claimed. An earlier display-name template value was rejected as not found. A separate terminal test was refused by the account's browser-only API policy; that policy was left unchanged.
- No multi-device sync or production security testing is claimed; those are outside the frontend-only architecture.
- Team onboarding, product upload, bulk invitation delivery and JSON downloads are implemented but have not received full end-to-end browser coverage.
- No load, concurrency, accessibility audit, cross-browser matrix or physical-device testing was performed.
- Static deployment cannot mirror emails to a terminal. That feature is development-only.
- Google Fonts require network access for the selected typography; fallbacks are present.
