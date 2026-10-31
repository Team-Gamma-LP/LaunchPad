import Brand from "../components/Brand";
import React, { useState } from "react";
import { ArrowUpRight, ArrowRight, Search, Check, Ticket } from "lucide-react";
import { admit, addGuest } from "../domain";
import { fmt, link } from "../shared";
import RecordDialog from "../components/RecordDialog";
import GuestForm from "../components/GuestForm";
export default function Usher({
  c,
  session,
  update,
  sendEmail,
  setNotice,
  logout,
  busy,
  setBusy,
}) {
  const [query, setQuery] = useState(""),
    [found, setFound] = useState(null),
    [walkIn, setWalkIn] = useState(false);
  const g = c.guests.find((g) => g.id === found);
  async function welcome(guest) {
    return sendEmail(session.clientId, guest.email || "(recipient not set)", `Welcome to ${c.name}`, `Hello ${guest.name}, you are checked in!\nOrganization: ${guest.organization}\nTicket type: ${guest.ticketType}\nCheck-in-code: ${guest.checkInCode}\nDiscover the product and join the live polls:\n${link(session.clientId, guest)}`, guest.realRecipient);
  }
  return (
    <div className="usher-page">
      <header>
        <Brand />
        <button className="secondary" onClick={logout}>
          Log out
        </button>
      </header>
      <main className="checkin">
        {c.event.deletedAt && <section className="card"><h2>This launch is unavailable.</h2><p>Ask the admin to restore the launch before admitting guests.</p></section>}
        <span className="checkin-emblem" aria-hidden="true">
          <Ticket size={32} />
        </span>
        <p className="eyebrow">{c.name.toUpperCase()} · WELCOME TEAM</p>
        <h1>
          A warm welcome.
          <br />
          One quick search.
        </h1>
        <p className="muted">
          Enter the check-in-code from your guest’s invitation.
        </p>
        <form
          className="ticket-search"
          onSubmit={(e) => {
            e.preventDefault();
            const match = c.guests.find(
              (g) => g.checkInCode.toLowerCase() === query.trim().toLowerCase(),
            );
            setFound(match?.id || null);
            if (!match)
              setNotice("No ticket found. Check the code and try again.");
          }}
        >
          <label className="sr-only" htmlFor="ticket">
            Check-in-code
          </label>
          <Search />
          <input
            id="ticket"
            placeholder="e.g. VD-0001"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="primary">
            Find guest <ArrowRight size={16} />
          </button>
        </form>
        <div className="walkin-entry"><span className="muted">Arriving without an invitation?</span><button className="secondary" disabled={busy || Boolean(c.event.deletedAt)} onClick={() => setWalkIn(true)}>Add & admit walk-in</button></div>
        {g && (
          <section className="card checkin-result" key={g.id}>
            <span className="avatar">{g.name[0]}</span>
            <h2>{g.name}</h2>
            <p>
              {g.organization} · {g.ticketType}
            </p>
            <p className="mono"><b>{g.checkInCode}</b></p>
            <span className={`badge ${g.admittedAt ? "success" : ""}`}>
              {g.admittedAt ? "Already admitted" : "Ready for check-in"}
            </span>
            {g.admittedAt ? (
              <>
                <p>Admitted {fmt(g.admittedAt)}</p>
                <a
                  className="primary"
                  href={`#/guest/${session.clientId}/${g.token}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open guest experience <ArrowUpRight size={17} />
                </a>
                <button
                  className="secondary"
                  onClick={() =>
                    (navigator.clipboard ? navigator.clipboard.writeText(link(session.clientId, g)) : Promise.reject())
                      .then(() => setNotice("Guest link copied."))
                      .catch(() => setNotice(link(session.clientId, g)))
                  }
                >
                  Copy personal link
                </button>
              </>
            ) : (
              <button
                className="primary wide"
                disabled={busy || Boolean(c.event.deletedAt)}
                onClick={async () => {
                  setBusy(true);
                  let admitted;
                  const s = update((s) => {
                    admitted = admit(
                      s,
                      session.clientId,
                      g.checkInCode,
                      session.email,
                    );
                  });
                  if (s) {
                    const m = await welcome(admitted);
                    setNotice(
                      `Guest admitted. Personal-link email ${m.status}.`,
                    );
                  }
                  setBusy(false);
                }}
              >
                Admit guest <Check size={18} />
              </button>
            )}
          </section>
        )}
        <div className="checkin-count">
          <strong>{c.guests.filter((g) => g.admittedAt).length}</strong> /{" "}
          {c.guests.length} guests welcomed
        </div>
        <p className="demo-note">
          Browser-local demo · Keep guest and admin tabs in this browser for
          shared updates.
        </p>
      </main>
      {walkIn && <RecordDialog title="Welcome a walk-in guest" onClose={() => !busy && setWalkIn(false)}><p className="muted">Enter their details. We’ll generate a check-in-code and admit them immediately.</p><GuestForm guest={{ticketType: "Walk-in"}} busy={busy} submitLabel="Generate code & admit" onCancel={() => setWalkIn(false)} onSave={async data => {
        setBusy(true);
        try {
          let guest;
          const result = update(s => { guest = addGuest(s, session.clientId, data, session.email); });
          if (result) { setFound(guest.id); setQuery(guest.checkInCode); setWalkIn(false); const mail = await welcome(guest); setNotice(`Walk-in admitted. Check-in-code: ${guest.checkInCode}. Guest-link email ${mail.status}.`); }
        } finally { setBusy(false); }
      }} /></RecordDialog>}
    </div>
  );
}
