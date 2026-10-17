import test from 'node:test'; import assert from 'node:assert/strict'; import { schedule } from './core.mjs';
const person = { id: 'a', timeZone: 'Asia/Shanghai', available: [{ start: '2026-10-20T08:00:00Z', end: '2026-10-20T12:00:00Z' }], busy: [{ start: '2026-10-20T09:00:00Z', end: '2026-10-20T10:00:00Z' }] };
test('hard occupancy and full duration respected', () => { const r = schedule({ people: [person], from: '2026-10-20T08:00:00Z', to: '2026-10-20T12:00:00Z' }); assert.ok(r.candidates.every(c => !(c.start < '2026-10-20T10:00:00.000Z' && c.end > '2026-10-20T09:00:00.000Z'))); assert.ok(r.candidates.every(c => Date.parse(c.end) - Date.parse(c.start) === 45 * 60000)); });
test('local dates are rendered and results deterministic', () => {
  const x = { people: [person], from: '2026-10-20T08:00:00Z', to: '2026-10-20T12:00:00Z' };
  assert.deepEqual(schedule(x), schedule(x)); assert.ok(schedule(x).candidates[0].local[0].start.includes('26'));
});
test('ambiguous local wall times require offsets', () => assert.throws(() => schedule({ people: [], from: '2026-11-01T01:30', to: '2026-11-01T03:30' })));
test('explicit DST overlap instants stay distinct', () => {
  const r = schedule({ people: [{ id: 'a', timeZone: 'America/New_York', available: [{ start: '2026-11-01T01:00-04:00', end: '2026-11-01T02:00-05:00' }] }], from: '2026-11-01T01:00-04:00', to: '2026-11-01T02:00-05:00', duration: 30 });
  assert.ok(r.candidates.some(c => c.start === '2026-11-01T05:00:00.000Z')); assert.ok(r.candidates.some(c => c.start === '2026-11-01T06:00:00.000Z'));
});
