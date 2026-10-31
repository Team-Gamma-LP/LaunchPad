import Motion from "../components/Motion";
import Brand from "../components/Brand";
import React from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Users,
  Mail,
  Ticket,
  BarChart3,
  MessageCircle,
  Leaf,
  UserCheck,
  Download,
} from "lucide-react";
const features = [
  [
    "Guest Management",
    "Manage your guest list from one place. Search for guests, review invitation details, track attendance, and export guest records when needed.",
    Users,
  ],
  [
    "Digital Invitations",
    "Prepare and send personalized event invitations with event details and unique guest tickets. Keep invitation management organized and reduce the need for printed guest lists.",
    Mail,
  ],
  [
    "Fast Event Check-In",
    "Give ushers a dedicated check-in interface to look up guest tickets, verify attendees, and record admissions. Prevent repeat admissions for guests who have already checked in.",
    Ticket,
  ],
  [
    "Real-Time Attendance Tracking",
    "Monitor guest arrivals through your event dashboard. View the number of invited guests, admitted attendees, and remaining attendance against your planned event capacity.",
    BarChart3,
  ],
  [
    "Live Audience Engagement",
    "Create interactive polls for your audience, control when voting opens and closes, and review response counts and percentages during the presentation.",
    MessageCircle,
  ],
  [
    "Branded Client Experience",
    "Customize event information and product details to reflect each client's brand. Provide guests with a consistent experience from their invitation to the product presentation.",
    Leaf,
  ],
  [
    "Team and Usher Management",
    "Organize event support by providing designated ushers with access to the check-in workflow. Help your team coordinate guest arrivals and admission.",
    UserCheck,
  ],
  [
    "Event Reporting and Data Export",
    "Review attendance and poll activity from the dashboard and export available event data for reporting and recordkeeping.",
    Download,
  ],
];
const steps = [
  [
    "01",
    "Set up your launch",
    "Configure your event details, product information, venue, date, and attendance capacity.",
  ],
  [
    "02",
    "Invite your guests",
    "Manage your guest list and prepare personalized digital invitations.",
  ],
  [
    "03",
    "Check in attendees",
    "Your ushers verify guest tickets and record admissions at the venue.",
  ],
  [
    "04",
    "Engage your audience",
    "Present your product and run live polls to encourage audience participation.",
  ],
  [
    "05",
    "Review your results",
    "Monitor attendance, poll responses, and event activity from your dashboard.",
  ],
];
export default function Landing() {
  function scrollTo(e, id) {
    e.preventDefault();
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }
  return (
    <Motion className="marketing">
      <header className="marketing-nav">
        <Brand />
        <nav>
          <a href="#features" onClick={(e) => scrollTo(e, "features")}>
            Features
          </a>
          <a href="#how-it-works" onClick={(e) => scrollTo(e, "how-it-works")}>
            How it works
          </a>
          <a className="secondary" href="#/login">
            Client login <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
      <section className="hero launchpad-hero">
        <div>
          <p className="eyebrow">
            <span className="dot" /> LAUNCHPAD BY TEAM GAMMA
          </p>
          <h1>
            Every launch.
            <br />
            <em>
              One organized
              <br />
              platform.
            </em>
          </h1>
          <p className="hero-copy">
            LaunchPad is an event management platform by Team Gamma that helps
            businesses organize and manage product launches from guest
            invitations to event check-in and live audience engagement.
          </p>
          <a className="primary" href="#/login">
            Organize your launch <ArrowUpRight size={19} />
          </a>
          <span className="byline">
            YOUR LAUNCH, ORGANIZED BY <b>TEAM GAMMA</b>
          </span>
        </div>
        <div className="hero-art campaign-art">
          <div className="campaign-corner">
            <span className="live-dot" /> A LITTLE ANTICIPATION. A GREAT FIRST
            IMPRESSION.
          </div>
          <img
            src="/launchpad-hero.png"
            alt="An atmospheric product launch venue with a glowing architectural portal and an audience ready for the reveal"
          />
          <div className="floating-ticket">
            <span className="ticket-icon">
              <Check />
            </span>
            <div>
              A more organized welcome.
              <small>Ticket verified. Guest checked in.</small>
            </div>
            <span className="tiny-tag">READY TO WELCOME</span>
          </div>
          <div className="art-label">
            <span>THE STAGE IS YOURS.</span>
            <span>LAUNCHPAD / 01</span>
          </div>
        </div>
      </section>
      <section className="platform-intro" data-reveal>
        <span className="intro-index">THE IDEA / 01</span>
        <p>
          Instead of relying on spreadsheets, printed guest lists, and separate
          polling tools, clients can manage their launch activities from one
          centralized workspace.
        </p>
      </section>
      <section className="launch-features" id="features" data-reveal>
        <p className="eyebrow">ONE WORKSPACE. EVERY DETAIL.</p>
        <h2>
          Everything you need to run
          <br />a successful product launch
        </h2>
        <div className="feature-grid">
          {features.map(([title, description, I], i) => (
            <article
              key={title}
              data-reveal
              style={{ "--reveal-delay": `${(i % 4) * 65}ms` }}
            >
              <div className="feature-heading">
                <I size={22} />
                <span>0{i + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="how-it-works" className="how">
        <div>
          <p className="eyebrow">FROM SETUP TO THE FINAL RESPONSE</p>
          <h2>How it works</h2>
          <p>Five connected steps. One organized launch.</p>
        </div>
        <div className="steps">
          {steps.map(([n, title, description]) => (
            <article key={n} data-reveal>
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <ArrowUpRight />
            </article>
          ))}
        </div>
      </section>
      <section className="built-for-launches" data-reveal>
        <p className="eyebrow">BUILT FOR ORGANIZED PRODUCT LAUNCHES</p>
        <h2>
          One workflow.
          <br />A more organized experience.
        </h2>
        <p>
          LaunchPad brings guest management, digital invitations, event
          check-in, attendance monitoring, and audience engagement together in
          one workflow.
        </p>
        <p>
          Whether you're introducing a new skincare line, unveiling a new
          product, or hosting a brand activation, LaunchPad helps your team
          coordinate the details and deliver a more organized event experience.
        </p>
      </section>
      <section className="landing-cta" data-reveal>
        <span className="cta-orbit" aria-hidden="true">
          ↗
        </span>
        <p className="eyebrow">LAUNCHPAD BY TEAM GAMMA</p>
        <h2>
          Your launch, organized
          <br />
          from start to finish.
        </h2>
        <a className="primary" href="#/login">
          Open your workspace <ArrowRight size={18} />
        </a>
      </section>
      <footer>
        <span>LaunchPad by Team Gamma</span>
        <span>Every launch. One organized platform.</span>
      </footer>
    </Motion>
  );
}
