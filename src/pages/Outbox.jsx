import React from "react";

import { fmt } from "../shared";
export default function Outbox({ c }) {
  return (
    <section className="card outbox-card">
      <div className="section-title">
        <h3>Email outbox</h3>
        <span className="badge">{c.emails.length} messages</span>
      </div>
      <p className="muted">
        Preview means no email was sent. Sent means EmailJS accepted the
        request; delivery is not guaranteed. Failed messages can be retried from
        Guests or Team.
      </p>
      {!c.emails.length && (
        <p className="empty">Your email previews will appear here.</p>
      )}
      {c.emails.map((m) => (
        <details className="email" key={m.id}>
          <summary>
            <b>{m.subject}</b>
            <span>{m.to}</span>
            <span className={`badge ${m.status === "sent" ? "success" : ""}`}>
              {m.status}
            </span>
          </summary>
          <pre>{m.message}</pre>
          {m.error && <p className="error">{m.error}</p>}
          <small>{fmt(m.createdAt)}</small>
        </details>
      ))}
    </section>
  );
}
