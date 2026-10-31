import { createId } from "../crypto.js";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { passwordHash, editUsher, deleteUsher } from "../domain";
import RecordDialog, { ConfirmDelete } from "../components/RecordDialog";

export default function Team({ c, session, update, sendEmail, setNotice, busy, setBusy }) {
  const [record, setRecord] = useState(null);
  const clientId = session.clientId;
  async function save(data) {
    const name = String(data.name || "").trim(), email = String(data.email || "").trim().toLowerCase();
    if (!name || !email) return setNotice("Enter a name and email.");
    const editing = record.mode === "edit";
    setBusy(true);
    try {
      const admins = await fetch("/demo-accounts.json").then(r => {if(!r.ok)throw Error("Account details could not be loaded. Please try again.");return r.json();});
      if (admins.some(u => u.email.toLowerCase() === email)) throw Error("This email belongs to an admin. Use a different usher email.");
      let password, salt, passwordDigest;
      if (!editing) { password = "Welcome-" + createId().slice(0, 8) + "!"; salt = createId(); passwordDigest = await passwordHash(password, salt); }
      const saved = update(s => {
        if (Object.values(s.clients).some(client => client.ushers.some(u => u.id !== (editing ? record.member.id : null) && u.email.toLowerCase() === email))) throw Error("An usher already uses this email. Choose a different email.");
        if (editing) {
          editUsher(s, clientId, record.member.id, { name, email });
        } else s.clients[clientId].ushers.push({ id: createId(), name, email, clientId, role: "usher", salt, passwordHash: passwordDigest });
      });
      if (!saved) return;
      setRecord(null);
      if (editing) setNotice("Team member updated. Their password stays the same; use the new email to sign in.");
      else {
        const m = await sendEmail(clientId, email, "Your LaunchPad usher account", `Hello ${name}, welcome to the ${c.name} team.\nLogin: ${location.origin}${location.pathname}#/login\nEmail: ${email}\nDemo password: ${password}\nOpen the usher workspace to check in guests.`, true);
        setNotice(`Usher created. Welcome email ${m.status}. Credentials appear in Email outbox.`);
      }
    } catch (e) { setNotice(e.message); } finally { setBusy(false); }
  }
  return <section className="card team-card">
    <div className="section-title"><div><p className="eyebrow">THE PEOPLE BEHIND THE WELCOME</p><h3>Your welcome team.</h3><p className="muted">Give every usher a name, an account and a clear place on the team.</p></div><button className="primary" onClick={() => setRecord({mode: "add"})}><Plus size={17} /> Add team member</button></div>
    {!c.ushers.length && <p className="empty">No team members yet. Add an usher to start welcoming guests.</p>}
    <div className="list">{c.ushers.map(u => <div className="arrival team-arrival" key={u.id}>
      <span className="avatar">{(u.name || "U")[0]}</span><div><b>{u.name || "Event usher"}</b><small>{u.email}</small><small>Usher · {c.name}</small></div>
      <div className="row-actions"><button onClick={() => setRecord({mode: "view", member: u})}>View</button><button onClick={() => setRecord({mode: "edit", member: u})}>Edit</button><button className="danger-text" onClick={() => setRecord({mode: "delete", member: u})}>Delete</button></div>
    </div>)}</div>
    {record && record.mode !== "delete" && <RecordDialog title={record.mode === "add" ? "Add team member" : record.mode === "edit" ? "Edit team member" : "Team member details"} onClose={() => !busy && setRecord(null)}>
      {record.mode === "view" ? <><dl className="record-details">{[["Name",record.member.name],["Email",record.member.email],["Role","Usher"],["Client",c.name]].map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><div className="dialog-actions"><button className="primary" onClick={() => setRecord({...record, mode: "edit"})}>Edit team member</button></div></> : <form className="form-grid record-form" key={record.mode} onSubmit={e => { e.preventDefault(); save(Object.fromEntries(new FormData(e.currentTarget))); }}>
        <label>Name<input autoFocus name="name" required maxLength={120} defaultValue={record.member?.name || ""} /></label>
        <label>Email<input name="email" type="email" required defaultValue={record.member?.email || ""} /></label>
        <p className="muted">{record.mode === "add" ? "A password is generated and included in their welcome email preview." : "Changing the email ends any session using the old email. The existing password stays the same."}</p>
        <div className="dialog-actions"><button className="secondary" type="button" disabled={busy} onClick={() => setRecord(null)}>Cancel</button><button className="primary" disabled={busy}>{busy ? "Saving…" : record.mode === "add" ? "Create usher & email" : "Save team member"}</button></div>
      </form>}
    </RecordDialog>}
    {record?.mode === "delete" && <ConfirmDelete title={`Delete ${record.member.name || "team member"}?`} description="This removes their usher account and ends access in open tabs. Past check-in records and email history are retained." onClose={() => setRecord(null)} onConfirm={() => {
      if(update(s => deleteUsher(s, clientId, record.member.id))) { setRecord(null); setNotice("Team member deleted. Their usher access has been removed."); }
    }} />}
  </section>;
}
