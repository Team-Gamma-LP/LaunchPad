import React, { useState } from "react";
import { ArrowUpRight, ArrowRight, Leaf } from "lucide-react";
import { vote } from "../domain";
import { fmt } from "../shared";
import PollResults from "../components/PollResults";
import ProductExperience from "../components/ProductExperience";
export default function Guest({ state, route, update, setNotice }) {
  const [, , clientId, token] = route.split("/"),
    c = state.clients[clientId],
    g = c?.guests.find((g) => g.token === token),
    [tab, setTab] = useState("Discover");
  if (!g)
    return (
      <div className="checkin">
        <h1>Invitation not found.</h1>
        <p>Please ask an usher to check your ticket.</p>
        <a href="#/">LaunchPad</a>
      </div>
    );
  if (c.event.deletedAt) return <main className="checkin"><h1>This launch is unavailable.</h1><p>Please contact the event host for an update.</p><a href="#/">LaunchPad</a></main>;
  return (
    <div className="guest-page">
      <header>
        <a className="verdae-logo" href={route}>
          {c.event.productInfo?.brand || "VERDAE"}
          <small>{c.event.tagline}</small>
        </a>
        <nav>
          {["Discover", "Live polls"].map((t) => (
            <button
              className={tab === t ? "selected" : ""}
              key={t}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
        <span className="guest-welcome">Welcome, {g.name.split(" ")[0]}</span>
      </header>
      {!g.admittedAt ? (
        <main className="guest-wait">
          <Leaf size={36} />
          <p className="eyebrow">YOU’RE ON THE LIST</p>
          <h1>Your evening awaits.</h1>
          <p>{c.event.title}</p>
          <p>
            {fmt(c.event.date)} · {c.event.venue}
          </p>
          <div className="paper-ticket">
            <small>YOUR INVITATION</small>
            <strong>{g.checkInCode}</strong>
            <p>{g.name} · {g.organization}</p><p>{g.ticketType}</p>
            <p>
              Present this code to an usher to unlock the product experience and
              polls.
            </p>
          </div>
          <p>{c.event.about}</p>
          <small>
            Using another phone? This prototype needs your local guest record
            admitted on that device too.
          </small>
        </main>
      ) : tab === "Discover" ? (
        <>
          <ProductExperience
            event={c.event}
            onPolls={() => setTab("Live polls")}
          />
          <section className="guest-story">
            <p className="eyebrow">WELCOME TO THE LAUNCH</p>
            <h2>
              A moment for you.
              <br />A conversation with us.
            </h2>
            <p>{c.event.about}</p>
            <button
              className="text-button"
              onClick={() => setTab("Live polls")}
            >
              Tell us what you think <ArrowRight size={17} />
            </button>
          </section>
        </>
      ) : (
        <main className="guest-polls">
          <span className="guest-poll-flower" aria-hidden="true">
            ✳
          </span>
          <p className="eyebrow">YOUR VOICE, IN THE ROOM</p>
          <h1>Let’s grow this together.</h1>
          <p className="muted">
            Choose an answer, then see how the room feels.
          </p>
          {!c.polls.length && (
            <p>Polls will appear here when your host creates them.</p>
          )}
          {c.polls.map((p) => (
            <section className="card" key={p.id}>
              <span className={`badge ${p.open ? "success" : ""}`}>
                {p.open ? "LIVE POLL" : "CLOSED"}
              </span>
              <h2>{p.question}</h2>
              {Object.hasOwn(p.votes, token) || !p.open ? (
                <>
                  <p className="muted">
                    {Object.hasOwn(p.votes, token)
                      ? `Your response: ${p.votes[token]}`
                      : "Voting has ended."}
                  </p>
                  <PollResults poll={p} />
                </>
              ) : (
                <div className="vote-options">
                  {p.options.map((o) => (
                    <button
                      key={o}
                      onClick={() => {
                        if (update((s) => vote(s, clientId, token, p.id, o)))
                          setNotice("Thank you. Your response is in.");
                      }}
                    >
                      {o}
                      <ArrowRight size={17} />
                    </button>
                  ))}
                </div>
              )}
            </section>
          ))}
        </main>
      )}
      <footer>
        <span>VERDAE · {c.event.tagline}</span>
        <span>Experience by LaunchPad / Team Gamma</span>
      </footer>
    </div>
  );
}
