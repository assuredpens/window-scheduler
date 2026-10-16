import assert from 'node:assert/strict';
import { findWindows } from './app.mjs';
const people = [{ name: 'A', offsetMinutes: 0, available: [{ start: 480, end: 720 }], busy: [] }, { name: 'B', offsetMinutes: 480, available: [{ start: 480, end: 720 }], busy: [{ start: 600, end: 645 }] }];
const result = findWindows(people, 480, 720, 45, 15);
assert.ok(result.every(item => !(item.start < 645 && 600 < item.end)));
assert.ok(result.length > 0);
assert.equal(result[0].local.length, 2);
console.log('window: ok');
