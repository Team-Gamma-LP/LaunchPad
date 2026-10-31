import React from "react";
import { fmt } from "../shared";
export default function GuestForm({ guest, onSave, onCancel, submitLabel = "Save guest", busy = false }) {
  return <form className="form-grid record-form" onSubmit={e => { e.preventDefault(); onSave(Object.fromEntries(new FormData(e.currentTarget))); }}>
    <label>Name<input autoFocus required name="name" defaultValue={guest?.name || ""} placeholder="Full name" maxLength={120} /></label>
    <label>Organization<input required name="organization" defaultValue={guest?.organization || ""} placeholder="Company, organization or Independent" maxLength={160} /></label>
    <label>Ticket type<input required name="ticketType" list="ticket-types" defaultValue={guest?.ticketType || "General admission"} maxLength={80} /><datalist id="ticket-types"><option>General admission</option><option>VIP</option><option>Press</option><option>Partner</option><option>Walk-in</option></datalist></label>
    <label>Check-in-code<input readOnly value={guest?.checkInCode || "Assigned automatically"} /></label>
    <label>Email · optional<input type="email" name="email" defaultValue={guest?.email || ""} placeholder="For invitations and the personal guest link" /></label>
    <p className="muted">The check-in-code is unique and stays the same when guest details change.</p>
    <div className="dialog-actions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button className="primary" disabled={busy}>{busy ? "Saving…" : submitLabel}</button></div>
  </form>;
}
export function GuestDetails({ guest }) {
  return <dl className="record-details">{[
    ["Name", guest.name], ["Organization", guest.organization], ["Ticket type", guest.ticketType], ["Check-in-code", guest.checkInCode], ["Email", guest.email || "Not provided"], ["Admission", guest.admittedAt ? fmt(guest.admittedAt) : "Expected"], ["Admitted by", guest.admittedBy || "—"],
  ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}
