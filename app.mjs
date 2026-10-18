import { fileURLToPath } from 'node:url';
import { start } from './lib/server.mjs';
import { run, validate } from './core.mjs';
import { product } from './project.mjs';
export * from './core.mjs';
export const spec = { ...{
  "slug": "window",
  "repo": "window-scheduler",
  "owner": "assuredpens",
  "title": "Window Scheduler",
  "purpose": "Find fair meeting windows across explicit time zones",
  "workflow": "A Kite scheduling agent can buy a ranked report without giving the service access to calendar accounts.",
  "colors": [
    "#fffaf3",
    "#342c49",
    "#6b3cb8"
  ],
  "required": [
    "people",
    "from",
    "to"
  ],
  "sample": {
    "people": [
      {
        "id": "mina",
        "timeZone": "Europe/London",
        "available": [
          {
            "start": "2026-10-20T08:00:00Z",
            "end": "2026-10-20T15:00:00Z"
          }
        ],
        "busy": []
      },
      {
        "id": "chen",
        "timeZone": "Asia/Shanghai",
        "available": [
          {
            "start": "2026-10-20T08:00:00Z",
            "end": "2026-10-20T12:00:00Z"
          }
        ],
        "busy": []
      }
    ],
    "from": "2026-10-20T08:00:00Z",
    "to": "2026-10-20T15:00:00Z",
    "duration": 45
  },
  "changed": "Inputs now require dated instants with explicit offsets. IANA zones render local dates, and candidate ranking minimizes the worst participant loss first.",
  "limits": "No calendar login, invitations or automatic resolution of local DST ambiguities. Input instants need Z or an explicit offset.",
  "version": "0.3.0",
  "inputSchema": {
    "type": "object",
    "required": [
      "people",
      "from",
      "to"
    ],
    "properties": {
      "people": {
        "type": "array"
      },
      "from": {
        "type": "string"
      },
      "to": {
        "type": "string"
      },
      "duration": {
        "type": "integer"
      }
    }
  }
}, run, validate, product };
if (process.argv[1] === fileURLToPath(import.meta.url)) start(spec);

