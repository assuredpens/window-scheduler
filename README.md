# Window Scheduler

Maintain participant availability, compare ranked options, select one and export a calendar event.

A Kite scheduling agent can buy a ranked report without giving the service access to calendar accounts.

## Start a project

Requires Node.js 20.11 or newer.

```sh
npm ci
npm test
npm start
# Open http://127.0.0.1:3000
```

Create a named scheduling project, replace the editable example inputs and save your brief. No analysis or payment happens automatically.

## Workflow

Maintain participant time zones and dated availability/busy intervals, run a bounded horizon, choose a returned candidate, save and rerun, then review the local-time report and export a calendar event. No invitation is sent.

### Inputs

- **Participants**
- **Horizon start (ISO with offset)**
- **Horizon end (ISO with offset)**
- **Meeting length (minutes)**
- **Candidate step (minutes)**
- **Selected candidate (ISO start)**: Choose a returned candidate in Results, then save and run again to attach the selection.

### Deliverables

Ranked-option CSV and an ICS event after selecting an available candidate. Every completed run also includes an audit JSON with result, input hash, rule version and review decisions. Draft downloads are labeled; release requires current inputs, no blocking issues and an explicit acceptance for every review item.

## What makes this a project workspace

- A named brief and persistent business inputs, not a disposable request.
- Structured forms, source-file import where applicable, business tables and visual previews.
- Immutable analysis runs, scenario duplication, result comparison and historical input restoration.
- Per-item review notes, blocked release for unresolved issues, archived projects and reviewed exports.
- Encrypted local persistence, restart recovery and revision checks that prevent stale edits overwriting newer work.

Project inputs and snapshots remain until removed. Preserve the private `.workspace-data` directory and its encryption key. The application is single-operator and single-process; it has no multitenant accounts or external approval signatures. Default retention limits are 50 projects, 10 runs per project, 64 MB per project and 256 MB overall. See [workspace operations and API](docs/PROJECT-GUIDE.md).

## Kite integration

`npm run check:kite` verifies the configured Kite chain and reads its current block. The service descriptor is at `/kite-service.json`.

Free local analysis returns no payment receipt. With explicitly configured paid mode, a project run prepares a task-bound x402 v2 quote; an operator signs with compatible wallet tooling, the service verifies authorization, computes the business output, requests settlement and delivers only after confirmed success. The workspace collects the delivered result against its saved input hash.

Missing payment configuration fails closed. The task-specific nonce signing extension still requires client interoperability testing. No live wallet-funded payment, stock Passport compatibility, official registry certification or Electric Capital acceptance is claimed. See [Kite setup and verification limits](docs/KITE-INTEGRATION.md).

Remote or paid-mode project management requires a private `WORKSPACE_ACCESS_TOKEN` of at least 32 characters. Bind locally by default, and configure HTTPS before remote use. `.env.example` is a configuration reference; the application does not load it automatically.

## Verification and scope

`npm test` runs business regressions, this project's acceptance tests, project-storage/review/access tests, and payment-state tests with a **fake facilitator**. [Verification record](docs/VERIFICATION.json) distinguishes these from historical live read-only network probes.

Inputs now require dated instants with explicit offsets. IANA zones render local dates, and candidate ranking minimizes the worst participant loss first.

No calendar login, invitations or automatic resolution of local DST ambiguities. Input instants need Z or an explicit offset.

Developed with AI assistance as a Kite integration evaluation project. [Common infrastructure](docs/SHARED-INFRASTRUCTURE.md) is shared across the evaluation repositories; each project has its own business engine, forms, release criteria and exports. Licensed under MIT.
