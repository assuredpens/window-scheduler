import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

function free(participant, start, end) { return (participant.available ?? []).some(slot => start >= slot.start && end <= slot.end) && !(participant.busy ?? []).some(slot => start < slot.end && slot.start < end); }

export function findWindows(participants, from, to, duration = 45, step = 15) {
  const results = [];
  for (let start = from; start + duration <= to; start += step) {
    const end = start + duration;
    if (!participants.every(person => free(person, start, end))) continue;
    const localHours = participants.map(person => ((start + (person.offsetMinutes ?? 0)) % 1440 + 1440) % 1440 / 60);
    const discomfort = localHours.reduce((sum, hour) => sum + (hour < 8 ? 8 - hour : hour > 18 ? hour - 18 : 0), 0);
    results.push({ start, end, score: discomfort, local: participants.map((person, i) => ({ name: person.name, minute: ((start + (person.offsetMinutes ?? 0)) % 1440 + 1440) % 1440, dateOffset: Math.floor((start + (person.offsetMinutes ?? 0)) / 1440) })) });
  }
  return results.sort((a, b) => a.score - b.score || a.start - b.start);
}

function html() { return `<!doctype html><meta charset="utf-8"><title>空档 · 跨时区约时单</title><style>body{font:16px system-ui;margin:0;background:#fffaf3;color:#342c49}main{max-width:1000px;margin:auto;padding:32px}textarea{width:100%;min-height:180px;font:14px ui-monospace;padding:10px;box-sizing:border-box}section{background:white;border:1px solid #d8cde5;padding:18px;margin:16px 0}button{background:#6b3cb8;color:#fff;border:0;padding:10px 14px;border-radius:3px}pre{white-space:pre-wrap;background:#eee1fc;padding:12px}</style><main><p>空档 / 跨时区约时单</p><h1>把确实能参加的时间排出来。</h1><p>输入统一使用 UTC 分钟；每个人的 offset 明确写出，不猜测夏令时。</p><section><label>参与者 JSON<textarea id="people">[{"name":"Mina","offsetMinutes":0,"available":[{"start":480,"end":1080}],"busy":[]},{"name":"Leo","offsetMinutes":480,"available":[{"start":0,"end":900}],"busy":[{"start":600,"end":660}]},{"name":"Chen","offsetMinutes":-300,"available":[{"start":540,"end":1200}],"busy":[]}]</textarea></label><label>会议时长 <input id="duration" value="45" type="number"> 分钟</label></section><button id="run">寻找共同空档</button><pre id="out">等待输入</pre></main><script>run.onclick=async()=>{const r=await fetch('/api/windows',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({people:JSON.parse(people.value),from:480,to:1200,duration:Number(duration.value)})});out.textContent=JSON.stringify(await r.json(),null,2)}</script>`; }

if (process.argv[1] === fileURLToPath(import.meta.url)) createServer((req, res) => { if (req.method === 'GET') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html()); return; } let body = ''; req.on('data', c => { body += c; }); req.on('end', () => { try { const input = JSON.parse(body); res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(findWindows(input.people, input.from, input.to, input.duration))); } catch (error) { res.writeHead(400, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: error.message })); } }); }).listen(process.env.PORT || 3000);
