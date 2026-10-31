import React from "react";
export default function Brand({ light = false }) {
  return (
    <a
      className={`brand${light ? " light" : ""}`}
      href="#/"
      aria-label="LaunchPad home"
    >
      <span className="brand-symbol">
        <img src="/launchpad-mark.png" alt="" width="40" height="40" />
      </span>
      <span className="brand-word">
        Launch<span>Pad</span>
        <small>BY TEAM GAMMA</small>
      </span>
    </a>
  );
}
