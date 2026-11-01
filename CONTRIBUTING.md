# Contributing to LaunchPad

LaunchPad by Team Gamma, built for the Oxygene Graduate Trainee Hackathon (31 October 2026).

## Team and roles

| Member | Role | Focus |
| --- | --- | --- |
| Alex Kinyua | Group Lead | Scope, repo admin, deployment, docs, reviews |
| Judy Chelangot | UI/UX Designer | Design system, flows, phone-first screens |
| Damaris Nzivah | Front-end Developer | Screens, responsiveness |
| David Kinuthia | Full-stack Developer | Data logic, tests, admin, Vercel config |

Focus areas are indicative. During the hackathon everyone contributed across design, build and documentation.

## Lead responsibilities

Alex Kinyua (Group Lead) set scope and priorities, administers the repository and its GitHub workflow (branches, pull requests and reviews), ran the production deployment and domain on Vercel, verified the live site, and maintains the project documentation (README, CONTRIBUTING, demo script).

## How the work was done

We worked together in one room on one shared laptop (pair/mob programming) to save time. The first import commit was pushed from that laptop, so it does not show each member's contribution. Later commits come from each member's own account.

## AI assistance

We used AI assistants for code, copy and design drafts. We reviewed and tested the output ourselves.

## Workflow

- Branch from `main`: `feat/<name>-<topic>` or `docs/<name>-<topic>`.
- Commit messages: `type(area): message`, for example `fix(usher): stop overflow at 375px`.
- Open a pull request. The lead reviews and merges.
- Run `npm test && npm run build` before opening a PR.
- Never commit `.env` files or private keys.

## Run locally

`npm ci`, then `npm run dev`. Tests: `npm test`.
