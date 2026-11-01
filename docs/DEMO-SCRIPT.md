# Demo script (about 5 minutes)

Use **one browser** and separate tabs, because state is stored in that browser's localStorage and is not shared across devices.

## Direct links

Open the app once first so the seed data loads in your browser.

| Screen | Link |
| --- | --- |
| Landing | https://launchpad-team-gamma.vercel.app/ |
| Login (use the role buttons) | https://launchpad-team-gamma.vercel.app/#/login |
| Guest view, ticket VD-0001 | https://launchpad-team-gamma.vercel.app/#/guest/verdae/22b99ec25f47bef7cab1afa9b03896bcccf9 |

The admin and usher screens need a signed-in tab, so reach them through the login page.

## Demo logins

These are public throwaway demo credentials. The login page's role buttons skip typing them.

| Role | Email | Password |
| --- | --- | --- |
| Client admin | admin@verdae.demo | Launch123! |
| Usher | usher@verdae.demo | Welcome123! |
| Second client admin | admin@studio.demo | Launch123! |

## Steps

1. **Landing page (30s).** Open the live demo. Say: ushers waste time on printed lists, and the client wants polls. LaunchPad does both.
2. **Admin tab (45s).** Click the admin demo button. Show the dashboard: 150 guests, capacity 200, two open polls. Open the guest list and the email outbox, where invitations appear as previews.
3. **Guest tab (30s).** In the guest list, open the guest view for **VD-0001** in a new tab. It shows the ticket and stays locked until check-in.
4. **Usher tab (60s).** Open a new tab and sign in as the usher (sign out first if it opens the admin workspace). Search **VD-0001** and press **Admit**. Try to admit the same ticket again: it is refused.
5. **Guest tab (45s).** Switch back. The page has unlocked. Open the product story, then **Live polls**, and vote. The voting controls disappear after one response.
6. **Admin tab (45s).** Return to the dashboard. The check-in count and poll results have updated.
7. **Optional (30s).** Sign in as the second client admin to show separate client workspaces. This is logical separation only, not a security boundary.

## Say this honestly

- One browser is the shared state today. A shared backend is the next step for multi-phone events.
- Authentication is demo-grade and email is preview-only.
- The typed code stands in for QR scanning, as the brief allows.

## If something goes wrong

- The guest tab stays locked: confirm it is the same browser and origin as the usher tab.
- State looks wrong: clear this site's storage and reload to reseed the 150 guests.
