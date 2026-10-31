import Brand from "../components/Brand";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { passwordHash } from "../domain";

export default function Login({ state, login, setNotice }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false);
  async function openDemoAccount(clientId, role) {
    setBusy(true);
    try {
      let accounts;
      if (role === "admin") {
        const response = await fetch("/demo-accounts.json");
        if (!response.ok)
          throw Error("Demo accounts could not be loaded. Please try again.");
        accounts = await response.json();
      } else {
        accounts = state.clients[clientId]?.ushers || [];
      }
      const account = accounts.find(
        (user) => user.clientId === clientId && user.role === role,
      );
      if (!account) throw Error("This demo account is currently unavailable.");
      login({
        id: account.id,
        email: account.email,
        role: account.role,
        clientId: account.clientId,
      });
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login-layout">
      <div className="login-art">
        <Brand light />
        <div>
          <p className="eyebrow">EVERY DETAIL. ONE WORKSPACE.</p>
          <h1>
            Your next great
            <br />
            launch begins here.
          </h1>
          <p>Thoughtfully connected, from invitation to interaction.</p>
        </div>
        <div className="login-progress">
          <span>01 / INVITE</span>
          <span>02 / WELCOME</span>
          <span>03 / CONNECT</span>
        </div>
        <small>Thoughtfully made by Team Gamma</small>
      </div>
      <div className="login-panel">
        <form
          className="login-card"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const admins = await fetch("/demo-accounts.json").then((r) =>
                r.json(),
              );
              const users = [
                ...admins,
                ...Object.values(state.clients).flatMap((c) => c.ushers),
              ];
              const u = users.find(
                (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
              );
              if (
                !u ||
                (await passwordHash(password, u.salt)) !== u.passwordHash
              )
                throw Error("Email or password is incorrect.");
              login({
                id: u.id,
                email: u.email,
                role: u.role,
                clientId: u.clientId,
              });
            } catch (e) {
              setNotice(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <p className="eyebrow">
            <span className="dot" /> YOUR WORKSPACE IS READY
          </p>
          <h1>Let’s launch.</h1>
          <p className="muted">Sign in to your client or usher workspace.</p>
          <label>
            Email address
            <input
              required
              type="email"
              name="email"
              autoComplete="username"
              placeholder="Enter your email address"
              disabled={busy}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={busy}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="primary wide" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
            <ArrowRight size={17} />
          </button>
          <div className="demo-credentials">
            <p className="eyebrow">TAKE A LOOK AROUND</p>
            <b>Try the demo</b>
            <p className="demo-hint">
              Choose a role to open its workspace instantly.
            </p>
            {[
              { label: "Verdae admin", clientId: "verdae", role: "admin" },
              { label: "Event usher", clientId: "verdae", role: "usher" },
              { label: "Second client", clientId: "studio", role: "admin" },
            ].map(({ label, clientId, role }) => (
              <button
                key={label}
                type="button"
                disabled={busy}
                onClick={() => openDemoAccount(clientId, role)}
              >
                {label}{" "}
                <span>
                  Open workspace <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </div>
          <small>
            Accounts are demo-only. Team Gamma-managed onboarding is planned.
          </small>
        </form>
      </div>
    </div>
  );
}
