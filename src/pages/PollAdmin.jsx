import React, { useState } from "react";
import { Plus } from "lucide-react";
import { savePoll, requireLaunch } from "../domain";
import PollResults from "../components/PollResults";
import RecordDialog, { ConfirmDelete } from "../components/RecordDialog";

export default function PollAdmin({ c, session, update, setNotice }) {
  const [record, setRecord] = useState(null);
  const clientId = session.clientId;
  function save(e, pollId) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (update(s => savePoll(s, clientId, pollId, {question: data.get("question"), options: String(data.get("options")).split("\n")}))) {
      e.target.reset(); setRecord(null); setNotice(pollId ? "Poll updated. Existing responses retained." : "Poll created and open for voting.");
    }
  }
  const fields = p => <><label>Question<input autoFocus={Boolean(p)} required name="question" defaultValue={p?.question || ""} placeholder="What would you like to ask?" /></label><label>Answer choices · one per line<textarea required name="options" defaultValue={p?.options.join("\n") || ""} readOnly={Boolean(p && Object.keys(p.votes).length)} placeholder={"First choice\nSecond choice"} /></label>{p && Object.keys(p.votes).length > 0 && <p className="muted">Answer choices are locked because this poll has responses. Create a new poll for different choices.</p>}</>;
  return <>
    <section className="card poll-composer"><div className="composer-intro"><p className="eyebrow">THE CONVERSATION STARTS HERE</p><h3>Ask the room.</h3><p className="muted">One good question can open up the whole presentation.</p><span className="composer-art" aria-hidden="true">“</span></div><form className="form-grid" onSubmit={e => save(e, null)}>{fields()}<button className="primary" disabled={Boolean(c.event.deletedAt)}>Create poll <Plus size={16} /></button></form></section>
    {!c.polls.length && <section className="card empty">No polls yet. Create your first question above.</section>}
    <div className="poll-grid">{c.polls.map(p => <section className="card" key={p.id}>
      <div className="section-title"><span className={`badge ${p.open ? "success" : ""}`}>{p.open ? "LIVE" : "CLOSED"}</span><button className="secondary" disabled={Boolean(c.event.deletedAt)} onClick={() => update(s => { requireLaunch(s.clients[clientId]); const q=s.clients[clientId].polls.find(x => x.id === p.id); if(!q)throw Error("This poll no longer exists."); q.open=!q.open; })}>{p.open ? "Close poll" : "Open poll"}</button></div>
      <PollResults poll={p} /><div className="row-actions record-controls"><button onClick={() => setRecord({mode:"view", poll:p})}>View</button><button disabled={Boolean(c.event.deletedAt)} onClick={() => setRecord({mode:"edit", poll:p})}>Edit</button><button className="danger-text" onClick={() => setRecord({mode:"delete", poll:p})}>Delete</button></div>
    </section>)}</div>
    {record && record.mode !== "delete" && <RecordDialog title={record.mode === "edit" ? "Edit poll" : "Poll details"} onClose={() => setRecord(null)}>{record.mode === "view" ? <><p><span className="badge">{record.poll.open ? "Open for voting" : "Voting closed"}</span></p><PollResults poll={c.polls.find(p=>p.id===record.poll.id) || record.poll} /><div className="dialog-actions"><button className="primary" disabled={Boolean(c.event.deletedAt)} onClick={() => setRecord({...record, mode:"edit"})}>Edit poll</button></div></> : <form className="form-grid record-form" onSubmit={e => save(e, record.poll.id)}>{fields(record.poll)}<div className="dialog-actions"><button type="button" className="secondary" onClick={() => setRecord(null)}>Cancel</button><button className="primary">Save poll</button></div></form>}</RecordDialog>}
    {record?.mode === "delete" && <ConfirmDelete title="Delete this poll?" description={`“${record.poll.question}” and all ${Object.keys(record.poll.votes).length} responses will be removed from the dashboard and guest pages.`} onClose={() => setRecord(null)} onConfirm={() => { if(update(s => {s.clients[clientId].polls=s.clients[clientId].polls.filter(p=>p.id!==record.poll.id);})) {setRecord(null);setNotice("Poll and its responses deleted.");} }} />}
  </>;
}
