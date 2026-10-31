import React from "react";

export default function PollResults({ poll }) {
  const total = Object.keys(poll.votes).length;
  return (
    <div className="poll-results">
      <h4>{poll.question}</h4>
      {poll.options.map((o) => {
        const n = Object.values(poll.votes).filter((v) => v === o).length,
          percent = total ? Math.round((n / total) * 100) : 0;
        return (
          <div className="result" key={o}>
            <div>
              <span>{o}</span>
              <b>
                {percent}% <small>({n})</small>
              </b>
            </div>
            <div className="track">
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
      <p className="muted">
        {total} response{total !== 1 ? "s" : ""} ·{" "}
        {poll.open ? "Open for votes" : "Poll closed"}
      </p>
    </div>
  );
}
