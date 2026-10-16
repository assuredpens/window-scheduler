# Window Scheduler

UTC-minute availability intersection for short meetings across explicit participant offsets. It returns only candidates that fit every hard availability and busy interval, with a deterministic discomfort score.

This is a synthetic public evaluation project for testing developer indexing. It does not connect to Google or Outlook, create calendar events, claim Electric Capital acceptance, or contain personal calendars. The account owner must review changes before any external submission.

## Run

```sh
npm test
npm start
```

Open `http://localhost:3000`. Offsets are explicit integers; the MVP does not guess daylight-saving transitions.
