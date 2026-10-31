import { createId } from "./crypto.js";
import Brand from "./components/Brand";
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Mail,
  Settings,
  LogOut,
  Download,
} from "lucide-react";
import { STORAGE_KEY, download, validUsherSession } from "./domain";
import { Icon, load } from "./shared";
import Landing from "./pages/Home";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Guests from "./pages/Guests";
import PollAdmin from "./pages/PollAdmin";
import Team from "./pages/Team";
import Product from "./pages/Product";
import Outbox from "./pages/Outbox";
import Usher from "./pages/Usher";
import Guest from "./pages/Guest";
import { migrateState } from "./migrate";
export default function App() {
  const [state, setState] = useState(null),
    [route, setRoute] = useState(location.hash || "#/"),
    [session, setSession] = useState(() => {
      try {
        return JSON.parse(sessionStorage.getItem("pl.session"));
      } catch {
        return null;
      }
    }),
    [notice, setNotice] = useState(""),
    [tab, setTab] = useState("Overview"),
    [busy, setBusy] = useState(false);
  const latest = useRef(state);
  latest.current = state;
  useEffect(() => {
    load().then(setState);
    const hash = () => setRoute(location.hash || "#/"),
      storage = (e) => {
        if (e.key === STORAGE_KEY) load().then(setState);
      };
    addEventListener("hashchange", hash);
    addEventListener("storage", storage);
    return () => {
      removeEventListener("hashchange", hash);
      removeEventListener("storage", storage);
    };
  }, []);
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 7000);
      return () => clearTimeout(t);
    }
  }, [notice]);
  function update(fn) {
    let base = latest.current;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.version === 1) base = migrateState(saved);
    } catch {}
    const s = structuredClone(base);
    try {
      if (session?.role === "usher" && !validUsherSession(s, session)) throw Error("Your usher access changed. Please sign in again.");
      fn(s);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      latest.current = s;
      setState(s);
      return s;
    } catch (e) {
      setNotice(e.message);
      return null;
    }
  }
  function login(u) {
    setSession(u);
    sessionStorage.setItem("pl.session", JSON.stringify(u));
    location.hash = u.role === "admin" ? "/admin" : "/usher";
  }
  function logout() {
    setSession(null);
    sessionStorage.removeItem("pl.session");
    location.hash = "/login";
  }
  async function sendEmail(
    clientId,
    to,
    subject,
    message,
    realRecipient = false,
  ) {
    const mail = {
      id: createId(),
      to,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: "preview",
    };
    console.info("[LaunchPad email]", mail);
    if (import.meta.env.DEV)
      fetch("/__email-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mail),
      }).catch(() => {});
    const env = import.meta.env;
    if (
      env.VITE_EMAIL_MODE === "live" &&
      realRecipient &&
      to &&
      env.VITE_EMAILJS_SERVICE_ID &&
      env.VITE_EMAILJS_TEMPLATE_ID &&
      env.VITE_EMAILJS_PUBLIC_KEY
    ) {
      try {
        const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: env.VITE_EMAILJS_SERVICE_ID,
            template_id: env.VITE_EMAILJS_TEMPLATE_ID,
            user_id: env.VITE_EMAILJS_PUBLIC_KEY,
            template_params: { to_email: to, subject, message },
          }),
        });
        if (!r.ok) throw Error(await r.text());
        mail.status = "sent";
      } catch (e) {
        mail.status = "failed";
        mail.error = e.message;
      }
    }
    update((s) => s.clients[clientId].emails.unshift(mail));
    return mail;
  }
  if (!state)
    return (
      <div className="loading">
        LaunchPad <span>Preparing your launch…</span>
      </div>
    );
  const c = state.clients[session?.clientId];
  const sessionValid = session && c && (session.role !== "usher" || validUsherSession(state, session));
  const pageDescriptions = {
    "Guest list": "Every name on the list. Every welcome accounted for.",
    "Live polls": "A room full of perspectives. Make space for every one.",
    Team: "Good events start with people who know their part.",
    "Product & event": "Give your launch a story, a setting, and a signature.",
    "Email outbox": "Every invitation and welcome, with a clear paper trail.",
  };
  const protectedRoute =
    route.startsWith("#/admin") || route.startsWith("#/usher");
  return (
    <>
      {notice && (
        <div role="status" className="toast">
          {notice}
        </div>
      )}
      {route.startsWith("#/guest/") ? (
        <Guest {...{ state, route, update, setNotice }} />
      ) : route === "#/login" || (protectedRoute && !sessionValid) ? (
        <Login {...{ state, login, setNotice }} />
      ) : route.startsWith("#/admin") && session?.role === "admin" ? (
        <div className="shell">
          <aside>
            <Brand />
            <div className="client-tag">
              <span className="avatar">{c.name[0]}</span>
              <div>
                {c.name}
                <small>Client workspace</small>
              </div>
            </div>
            <small className="nav-label">WORKSPACE</small>
            <nav>
              {[
                ["Overview", LayoutDashboard],
                ["Guest list", Users],
                ["Live polls", BarChart3],
                ["Team", Users],
                ["Product & event", Settings],
                ["Email outbox", Mail],
              ].map(([t, I]) => (
                <button
                  className={tab === t ? "active" : ""}
                  key={t}
                  onClick={() => setTab(t)}
                >
                  <Icon icon={I} />
                  {t}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="local-pill">
                <span />
                Local demo
              </div>
              <small>One browser · multiple tabs</small>
              <button className="text-button" onClick={logout}>
                <Icon icon={LogOut} /> Log out
              </button>
            </div>
          </aside>
          <main className="workspace">
            <header className="workspace-header">
              <span>
                Workspace <span className="muted">/</span> {tab}
              </span>
              <span className="admin-badge">
                Team Gamma client admin <span className="avatar small">A</span>
              </span>
            </header>
            <div className="workspace-content">
              <div className="page-title">
                <div>
                  <p className="eyebrow">
                    {c.name.toUpperCase()} / EVENT WORKSPACE
                  </p>
                  <h1>{tab === "Overview" ? "Consider it organized." : tab}</h1>
                  <p className="muted">
                    {tab === "Overview"
                      ? "Your guests, your team, your audience. All in one place."
                      : pageDescriptions[tab]}
                  </p>
                </div>
                <button
                  className="secondary"
                  onClick={() => download("launchpad-backup.json", state)}
                >
                  <Icon icon={Download} />
                  Export JSON
                </button>
              </div>
              <div className="screen-content" key={tab}>
                {tab === "Overview" ? (
                  <Overview {...{ c, session, setTab }} />
                ) : tab === "Guest list" ? (
                  <Guests
                    {...{
                      c,
                      session,
                      state,
                      update,
                      sendEmail,
                      setNotice,
                      busy,
                      setBusy,
                    }}
                  />
                ) : tab === "Live polls" ? (
                  <PollAdmin {...{ c, session, update, setNotice }} />
                ) : tab === "Team" ? (
                  <Team
                    {...{
                      c,
                      session,
                      update,
                      sendEmail,
                      setNotice,
                      busy,
                      setBusy,
                    }}
                  />
                ) : tab === "Product & event" ? (
                  <Product {...{ c, session, update, setNotice }} />
                ) : (
                  <Outbox c={c} />
                )}
              </div>
              <p className="demo-note">
                Prototype workspace. Changes stay in this browser. JSON
                credentials and role checks are demonstration features.
              </p>
            </div>
          </main>
        </div>
      ) : route.startsWith("#/usher") && session ? (
        <Usher
          {...{
            c,
            session,
            update,
            sendEmail,
            setNotice,
            logout,
            busy,
            setBusy,
          }}
        />
      ) : (
        <Landing />
      )}
    </>
  );
}
