import { insist, list, integer, unique, offsetInstant } from './lib/validation.mjs';
export function schedule({ people, from, to, duration = 45, step = 15 }) {
  list(people, 'people', 12); insist(people.length > 0, 'Need at least one participant'); unique(people);
  const begin = offsetInstant(from), end = offsetInstant(to);
  insist(end > begin && end - begin <= 14 * 86400000, 'Use a horizon of at most 14 days'); integer(duration, 'duration', 1, 1440); integer(step, 'step', 1, 1440);
  const participants = people.map(p => {
    const format = new Intl.DateTimeFormat('en-CA', { timeZone: p.timeZone, dateStyle: 'short', timeStyle: 'short', hourCycle: 'h23' });
    const hour = new Intl.DateTimeFormat('en-US', { timeZone: p.timeZone, hour: '2-digit', hourCycle: 'h23' });
    const intervals = values => list(values || [], 'intervals', 200).map(i => { const a = offsetInstant(i.start), b = offsetInstant(i.end); insist(b > a, 'Interval must have positive duration'); return { start: a, end: b }; });
    return { ...p, format, hour, available: intervals(p.available), busy: intervals(p.busy) };
  });
  const candidates = [];
  for (let t = begin; t + duration * 60000 <= end; t += step * 60000) {
    const finish = t + duration * 60000;
    if (!participants.every(p => p.available.some(i => t >= i.start && finish <= i.end) && !p.busy.some(i => t < i.end && i.start < finish))) continue;
    const local = participants.map(p => {
      const h = Number(p.hour.format(t)), loss = h < 9 ? 9 - h : h >= 18 ? h - 17 : 0;
      return { id: p.id, timeZone: p.timeZone, start: p.format.format(t), end: p.format.format(finish), loss };
    });
    candidates.push({ start: new Date(t).toISOString(), end: new Date(finish).toISOString(), worstLoss: Math.max(...local.map(p => p.loss)), totalLoss: local.reduce((s, p) => s + p.loss, 0), local });
  }
  candidates.sort((a, b) => a.worstLoss - b.worstLoss || a.totalLoss - b.totalLoss || a.start.localeCompare(b.start));
  return { status: candidates.length ? 'found' : 'no-common-window', candidates, ranking: 'worst-participant-first-v1' };
}
export const run = schedule;
export function validate(x) { run(x); }
