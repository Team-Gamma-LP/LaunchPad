import React, { useState } from "react";
import { Search, Plus, Download, Mail, ChevronDown } from "lucide-react";
import { download, addGuest, editGuest, deleteGuest, exportGuests } from "../domain";
import { fmt, link } from "../shared";
import RecordDialog, { ConfirmDelete } from "../components/RecordDialog";
import GuestForm, { GuestDetails } from "../components/GuestForm";
export default function Guests({
  c,
  session,
  update,
  sendEmail,
  setNotice,
  busy,
  setBusy,
}) {
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All guests"),
    [record, setRecord] = useState(null);
  const id = session.clientId;
  const filtered = c.guests.filter(
    (g) =>
      [g.name, g.organization, g.ticketType, g.email, g.checkInCode].join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter !== "Admitted" || g.admittedAt),
  );
  async function invite(g) {
    if (c.event.deletedAt) { setNotice("Restore the launch before preparing invitations."); return { status: "skipped" }; }
    return sendEmail(
      id,
      g.email || "(recipient not set)",
      `Your invitation · ${c.event.title}`,
      `Hello ${g.name},\nYou are invited to ${c.event.title}.\n${fmt(c.event.date)}\n${c.event.venue}\nOrganization: ${g.organization}\nTicket type: ${g.ticketType}\nCheck-in-code: ${g.checkInCode}\nPresent this code to an usher. Your personal product and poll link after admission: ${link(id, g)}`,
      g.realRecipient,
    );
  }
  return (
    <>
      <section className="card guest-list-card">
        <div className="section-title">
          <div>
            <h3>Your guest list</h3>
            <p className="muted">
              Your invitation list, from expected arrivals to a room full of
              guests.
            </p>
          </div>
          <div className="row-actions"><button className="primary" disabled={Boolean(c.event.deletedAt)} onClick={() => setRecord({ mode: "add" })}><Plus size={17} /> Add guest</button><button
            className="secondary"
            onClick={() => download("launchpad-guests.json", exportGuests(c.guests))}
          >
            <Download size={16} />
            Export guests
          </button></div>
        </div>
        <details className="recipient-settings">
          <summary>
            <Mail size={17} /> Test invitation recipients{" "}
            <span>{c.guests.filter(g => g.realRecipient).length} email addresses</span>
            <ChevronDown size={16} />
          </summary>
          <div className="recipient-grid">
            {c.guests
              .filter((g) => g.realRecipient)
              .map((g) => (
                <label key={g.id}>
                  {g.name}
                  <input
                    aria-label={`Real email for ${g.name}`}
                    placeholder="Real test email address"
                    type="email"
                    value={g.email}
                    onChange={(e) =>
                      update(
                        (s) =>
                          (s.clients[id].guests.find(
                            (x) => x.id === g.id,
                          ).email = e.target.value),
                      )
                    }
                  />
                </label>
              ))}
          </div>
        </details>
        <div className="toolbar">
          <div className="search">
            <Search size={18} />
            <input
              aria-label="Search guests"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, organization or check-in-code…"
            />
          </div>
          <select
            aria-label="Filter guests"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All guests</option>
            <option>Admitted</option>
          </select>
          <button
            className="primary"
            disabled={busy || Boolean(c.event.deletedAt)}
            onClick={async () => {
              setBusy(true);
              let sent = 0,
                failed = 0;
              for (const g of c.guests) {
                const m = await invite(g);
                sent += m.status === "sent";
                failed += m.status === "failed";
                if (g.realRecipient)
                  await new Promise((r) => setTimeout(r, 1100));
              }
              setBusy(false);
              setNotice(
                `Invitations prepared: ${c.guests.length}. Sent: ${sent}. Failed: ${failed}. Remaining emails are previews.`,
              );
            }}
          >
            {busy ? "Preparing invitations…" : "Prepare / send invitations"}
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Organization</th>
                <th>Ticket type</th>
                <th>Check-in-code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td>
                    <b>{g.name}</b>
                    <small>{g.email || "No email provided"}</small>
                  </td>
                  <td>{g.organization}</td>
                  <td>{g.ticketType}</td>
                  <td className="mono">{g.checkInCode}</td>
                  <td>
                    <span className={`badge ${g.admittedAt ? "success" : ""}`}>
                      {g.admittedAt ? "Admitted" : "Expected"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => setRecord({mode: "view", guest: g})}>View</button>
                      <button onClick={() => setRecord({mode: "edit", guest: g})}>Edit</button>
                      <button className="danger-text" onClick={() => setRecord({mode: "delete", guest: g})}>Delete</button>
                      <button
                        disabled={busy || Boolean(c.event.deletedAt)}
                        onClick={async () => {
                          setBusy(true);
                          const m = await invite(g);
                          setBusy(false);
                          setNotice(
                            `Invitation ${m.status}. See Email outbox.`,
                          );
                        }}
                      >
                        Invite
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard
                            ?.writeText(link(id, g))
                            .then(() =>
                              setNotice("Personal guest link copied."),
                            )
                            .catch(() => setNotice(link(id, g)));
                        }}
                      >
                        Copy link
                      </button>
                      <a
                        href={`#/guest/${id}/${g.token}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Guest view ↗
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="empty">No guests match this search.</p>
          )}
        </div>
      </section>
      {record && record.mode !== "delete" && <RecordDialog title={record.mode === "add" ? "Add a guest" : record.mode === "edit" ? "Edit guest" : "Guest details"} onClose={() => setRecord(null)}>
        {record.mode === "view" ? <><GuestDetails guest={record.guest} /><div className="dialog-actions"><button className="primary" onClick={() => setRecord({...record, mode: "edit"})}>Edit guest</button></div></> : <GuestForm key={record.mode + (record.guest?.id || "new")} guest={record.guest} onCancel={() => setRecord(null)} onSave={data => {
          let saved;
          const result = update(s => { saved = record.mode === "add" ? addGuest(s, id, data) : editGuest(s, id, record.guest.id, data); });
          if (result) { setRecord(null); setNotice(`Guest saved. Check-in-code: ${saved.checkInCode}`); }
        }} />}
      </RecordDialog>}
      {record?.mode === "delete" && <ConfirmDelete title={`Delete ${record.guest.name}?`} description="This removes the guest, their admission and their poll responses. Their personal link will stop working. Email history is retained." onClose={() => setRecord(null)} onConfirm={() => {
        if (update(s => deleteGuest(s, id, record.guest.id))) { setRecord(null); setNotice("Guest deleted. Attendance and poll totals updated."); }
      }} />}
    </>
  );
}
