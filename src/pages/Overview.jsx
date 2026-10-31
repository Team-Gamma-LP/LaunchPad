import React from "react";
import Motion from "../components/Motion";
import {
  ArrowUpRight,
  ArrowRight,
  Leaf,
  Users,
  BarChart3,
  Check,
  Ticket,
} from "lucide-react";

import { Icon, fmt, link } from "../shared";
import PollResults from "../components/PollResults";
export default function Overview({ c, session, setTab }) {
  const admitted = c.guests.filter((g) => g.admittedAt),
    votes = c.polls.reduce((n, p) => n + Object.keys(p.votes).length, 0);
  return (
    <Motion className="overview-screen">
      <div className="event-banner" data-reveal>
        <div>
          <span className="event-chip">{c.event.deletedAt ? "LAUNCH DELETED · GUEST ACCESS PAUSED" : "UPCOMING EVENT · DEMO"}</span>
          <h2>{c.event.title}</h2>
          <p>
            {fmt(c.event.date)} <span>·</span> {c.event.venue}
          </p>
          <button
            className="light-button"
            onClick={() => setTab("Product & event")}
          >
            Manage event <ArrowUpRight size={17} />
          </button>
        </div>
        <img src={c.event.image} alt="Verdae launch mood board" />
      </div>
      <div className="stats">
        {[
          [
            "Invited guests",
            c.guests.length,
            `${Math.max(0, c.event.capacity - admitted.length)} spaces remaining · ${c.event.capacity} capacity`,
            Users,
          ],
          [
            "Checked in",
            admitted.length,
            `${c.guests.length ? Math.round((admitted.length / c.guests.length) * 100) : 0}% of your guest list`,
            Ticket,
          ],
          [
            "Poll responses",
            votes,
            `${c.polls.filter((p) => p.open).length} polls currently open`,
            BarChart3,
          ],
          ["Event ushers", c.ushers.length, "Ready to welcome guests", Users],
        ].map(([label, n, sub, I]) => (
          <article key={label} data-reveal>
            <div>
              {label}
              <Icon icon={I} />
            </div>
            <strong>{n}</strong>
            <small>{sub}</small>
          </article>
        ))}
      </div>
      <div className="overview-grid">
        <section className="card" data-reveal>
          <div className="section-title">
            <h3>Audience pulse</h3>
            <button
              className="text-button"
              onClick={() => setTab("Live polls")}
            >
              Manage polls <ArrowUpRight size={15} />
            </button>
          </div>
          {c.polls[0] ? (
            <PollResults poll={c.polls[0]} />
          ) : (
            <p className="empty">
              Create your first poll to hear from the room.
            </p>
          )}
        </section>
        <section className="card">
          <div className="section-title">
            <h3>Recent arrivals</h3>
            <span className="badge">{admitted.length} admitted</span>
          </div>
          {admitted.length ? (
            admitted
              .slice()
              .sort((a, b) => b.admittedAt.localeCompare(a.admittedAt))
              .slice(0, 5)
              .map((g) => (
                <div className="arrival" key={g.id}>
                  <span className="avatar">{g.name[0]}</span>
                  <div>
                    <b>{g.name}</b>
                    <small>{g.checkInCode} · {g.ticketType}</small>
                  </div>
                  <span className="muted">
                    {new Date(g.admittedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
          ) : (
            <div className="empty">
              <Ticket size={30} />
              <h4>The welcome starts here.</h4>
              <p>Check in your first guest from the usher workspace.</p>
            </div>
          )}
        </section>
      </div>
      <section className="next-step">
        <span className="ticket-icon">
          <Leaf />
        </span>
        <div>
          <h3>A beautiful experience, beyond the door.</h3>
          <p>
            Your admitted guests get a personal link to the Verdae story and
            live polls.
          </p>
        </div>
        <button className="secondary" onClick={() => setTab("Guest list")}>
          View guest list <ArrowRight size={16} />
        </button>
      </section>
    </Motion>
  );
}
