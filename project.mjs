import { field, table, column, view, metric, item, csvArtifact, textArtifact, summary } from './lib/product-kit.mjs';
const stamp = iso => iso.replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
export const product = {
  category: 'Team scheduling', projectNoun: 'Scheduling project', runLabel: 'Find meeting options',
  outcome: 'Maintain participant availability, compare ranked options, select one and export a calendar event.',
  fields: [
    table('people','Participants',[column('id','Participant ID'),column('timeZone','IANA time zone'),column('available','Available intervals','intervals'),column('busy','Busy intervals','intervals')]),
    field('from','Horizon start (ISO with offset)'),field('to','Horizon end (ISO with offset)'),
    field('duration','Meeting length (minutes)','number'),field('step','Candidate step (minutes)','number'),
    field('selectedStart','Selected candidate (ISO start)', 'text', { help: 'Choose a returned candidate in Results, then save and run again to attach the selection.' }),
  ],
  describe(result,input) {
    const selected=result.candidates.find(c=>c.start===input.selectedStart);
    return summary([metric('Available options',result.candidates.length),metric('Selection',selected?'Selected':'Pending')],[
      view('Ranked meeting options',[column('start','Start UTC'),column('end','End UTC'),column('worstLoss','Worst participant loss'),column('totalLoss','Total loss')],result.candidates.slice(0,100)),
      view('Selected option in local time',[column('id','Participant'),column('timeZone','Zone'),column('start','Start local'),column('end','End local')],selected?.local || []),
    ],[item('selection','Select and review a meeting time',selected ? `${selected.start} — ${selected.end}`:'Select one of the returned candidates.',!selected)],{type:'schedule',candidates:result.candidates.slice(0,20),selected:input.selectedStart});
  },
  artifacts(result,input,context) {
    const output=[csvArtifact('options','Meeting options',[column('start','Start UTC'),column('end','End UTC'),column('worstLoss','Worst loss'),column('totalLoss','Total loss')],result.candidates)];
    const selected=result.candidates.find(c=>c.start===input.selectedStart);
    if(selected)output.push(textArtifact('calendar','Selected calendar event','ics','text/calendar',`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Window Scheduler//EN\r\nBEGIN:VEVENT\r\nUID:${context.runId}@window.local\r\nDTSTAMP:${stamp(context.createdAt)}\r\nDTSTART:${stamp(selected.start)}\r\nDTEND:${stamp(selected.end)}\r\nSUMMARY:Reviewed meeting window\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`));
    return output;
  },
};
