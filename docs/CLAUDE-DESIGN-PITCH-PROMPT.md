# Prompt for Claude Design

Create a polished 10-slide hackathon pitch deck for **LaunchPad by Team Gamma**, presented in five minutes. Give each slide a clear headline, concise on-slide copy, a visual composition, and short presenter notes. If supported, create the actual editable presentation. Use a 16:9 format.

## Audience and story

We are pitching judges and Team Gamma's Events Manager. Team Gamma runs product launches for clients. At a launch with about 200 guests, ushers waste time searching printed lists and the client wants audience polls during the presentation. Our prototype connects invitation, arrival, product discovery and audience participation. LaunchPad is Team Gamma's reusable product for multiple clients; Verdae is the featured client brand, not the platform name.

## Visual direction

Use the attached Verdae mood board as reference. Platform slides should feel like a confident operations product: deep forest green #173E32, warm off-white #F6F7F4, sage #879F64 and a restrained pale lime #D8EE9D. Guest experience slides should shift to warm cream #F3F0E5, botanical olive #485839, sage and subtle muted gold. Pair an editorial serif for Verdae with a clean sans serif for LaunchPad. Use generous margins, large headlines, strong contrast, sparse copy and product screenshots. Prefer screenshot-led layouts and a simple guest journey over generic icon grids. No invented customer logos, testimonials, clinical claims or financial statistics.

## Slide plan and content

1. **Big launch. Smooth arrival. Real connection.** LaunchPad by Team Gamma. Subtitle: From the first guest at the door to the last audience poll. Show a cropped product view and Verdae imagery.
2. **The first impression starts at the door.** Printed lists slow down ushers; attendance becomes hard to see; audience feedback lives elsewhere. Illustrate the fragmented event journey. Context: the brief is approximately 200 guests, not a proven market metric.
3. **One launch. Every touchpoint.** Show the connected journey: invite → find ticket → admit → discover product → vote → learn from the room. Explain the value in one sentence per role.
4. **The control room for a considered launch.** Admin workspace screenshot: product/event setup, usher team, guest list, attendance and poll responses. Position Team Gamma as the service operator and the client as workspace admin.
5. **A warm welcome, in one quick search.** Show the usher's phone: ticket VD-0001, guest confirmation, Admit guest, admitted status. Emphasize duplicate check-in protection within the prototype. Do not claim measured check-in speed.
6. **Let the product story continue on their phone.** Show Verdae guest product page and poll page. Event: 1 December 2026, Two Rivers Mall. Start time is still a demo assumption. Describe admission-gated personal links and one response per guest token per poll.
7. **A working prototype with a clear boundary.** React + Vite; 150 seeded guest records; four configured real test recipients; browser storage; optional EmailJS; email preview/outbox and local terminal logs. Explicitly state: this version shares state only across tabs in the same browser, has demo authentication and is not ready for synchronized multi-phone event operations. No database or app backend is implemented. Email delivery requires EmailJS setup and testing.
8. **Build once. Configure for the next client.** Explain client-keyed workspaces and product branding. Label business model as a hypothesis: per-launch setup/service fee plus recurring packages for repeat clients. Potential add-ons: custom branding, managed invitations and reporting. Do not invent prices, traction or market size.
9. **From hackathon demo to event-ready.** Roadmap: pilot usability validation → managed identity and trusted roles → shared real-time state and atomic admission/voting → reliable email queue and delivery reporting → multi-event support/QR. Show what is already built versus planned.
10. **Make the moment count.** Ask: partner with Team Gamma on a supervised pilot and validate arrival speed, staff effort and audience participation. Add a clearly labeled demo URL/QR placeholder until we provide the actual link. Close with LaunchPad by Team Gamma.

## Live demo cue

Add presenter notes for a 60–90 second demo: admin opens guest list → invitation appears in outbox → usher searches VD-0001 and admits → same-browser guest tab unlocks → guest votes → admin dashboard reflects the response. Explain the single-browser boundary honestly. Use placeholders labeled “Insert actual screenshot” until genuine screenshots are supplied; do not invent evidence of successful delivery or production deployment.

## Deliverable requirements

Keep slides readable from the back of a room. Use no more than three concise points on a slide. Provide a 30-second opening, a short closing ask, and optional Q&A answers for: Why frontend-only? How do multiple phones sync? Are credentials secure? How does Team Gamma earn revenue? What would you build next? State that production identity, cross-device data and email reliability belong to the roadmap. Distinguish completed prototype behavior, unverified capabilities and future plans throughout.
