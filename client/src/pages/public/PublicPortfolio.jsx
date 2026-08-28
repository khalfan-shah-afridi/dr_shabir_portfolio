import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Award,
  Users,
  Globe2,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  Mail,
  Layers3,
  MapPin,
  Phone,
  Sparkles,
  Target,
  Heart,
  Send,
  Microscope,
  Search
} from "lucide-react";
import api from "../../services/api";
import "./PublicPortfolio.css";

const listFor = (p, key) =>
  Array.isArray(p?.[key]) ? p[key] : [];

const labelFor = (x, key) =>
  key === "experience"
    ? x.position
    : key === "education"
      ? x.degree
      : x.title ||
        x.name ||
        x.journal ||
        x.journalName ||
        "Record";

const descFor = (x) =>
  x.description ||
  x.abstract ||
  "Open the record to view complete information.";

const pathFor = (key, id) => `/portfolio/${key}/${id}`;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => setReduced(mq.matches);

    update();

    mq.addEventListener?.("change", update);

    return () =>
      mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function usePublicInteractions(reduced) {
  useEffect(() => {
    if (
      reduced ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const cursor = document.createElement("div");
    const ring = document.createElement("div");

    cursor.className = "custom-cursor";
    ring.className = "cursor-ring";

    document.body.append(cursor, ring);

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;

      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;

      cursor.style.transform =
        `translate3d(${x}px,${y}px,0)`;

      ring.style.transform =
        `translate3d(${rx}px,${ry}px,0)`;

      raf = requestAnimationFrame(tick);
    };

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const over = (e) => {
      const target =
        e.target.closest?.(
          "a,button,input,textarea,select,[data-cursor='interactive']"
        );

      if (target) {
        cursor.classList.add("is-hover");
        ring.classList.add("is-hover");
      }
    };

    const out = (e) => {
      if (
        !e.relatedTarget?.closest?.(
          "a,button,input,textarea,select,[data-cursor='interactive']"
        )
      ) {
        cursor.classList.remove("is-hover");
        ring.classList.remove("is-hover");
      }
    };

    const down = () => {
      cursor.classList.add("is-down");
      ring.classList.add("is-down");
    };

    const up = () => {
      cursor.classList.remove("is-down");
      ring.classList.remove("is-down");
    };

    window.addEventListener(
      "mousemove",
      move,
      { passive: true }
    );

    window.addEventListener(
      "mouseover",
      over,
      { passive: true }
    );

    window.addEventListener(
      "mouseout",
      out,
      { passive: true }
    );

    window.addEventListener(
      "mousedown",
      down,
      { passive: true }
    );

    window.addEventListener(
      "mouseup",
      up,
      { passive: true }
    );

    tick();

    return () => {
      window.removeEventListener(
        "mousemove",
        move
      );

      window.removeEventListener(
        "mouseover",
        over
      );

      window.removeEventListener(
        "mouseout",
        out
      );

      window.removeEventListener(
        "mousedown",
        down
      );

      window.removeEventListener(
        "mouseup",
        up
      );

      cancelAnimationFrame(raf);

      cursor.remove();
      ring.remove();
    };
  }, [reduced]);
}

function useMouseParallax(reduced) {
  useEffect(() => {
    if (
      reduced ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let raf = 0;
    let px = 0.5;
    let py = 0.5;

    const update = () => {
      document.documentElement.style.setProperty(
        "--mouse-x",
        `${px * 100}%`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${py * 100}%`
      );

      document.documentElement.style.setProperty(
        "--parallax-x",
        `${(px - 0.5) * 28}px`
      );

      document.documentElement.style.setProperty(
        "--parallax-y",
        `${(py - 0.5) * 28}px`
      );

      // Colorful hue that shifts across the full spectrum as the
      // cursor travels across the page, driving the glow/orb colors.
      document.documentElement.style.setProperty(
        "--hue",
        `${Math.round((px * 0.65 + py * 0.35) * 300)}`
      );

      raf = 0;
    };

    const move = (e) => {
      px = e.clientX / innerWidth;
      py = e.clientY / innerHeight;

      if (!raf) {
        raf = requestAnimationFrame(update);
      }
    };

    addEventListener(
      "mousemove",
      move,
      { passive: true }
    );

    return () => {
      removeEventListener(
        "mousemove",
        move
      );

      cancelAnimationFrame(raf);
    };
  }, [reduced]);
}

function Reveal({
  children,
  className = "",
  delay = 0
}) {
  const reduced =
    window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

  return (
    <motion.div
      className={`reveal ${className}`}
      initial={
        reduced
          ? false
          : {
              opacity: 0,
              y: 30,
              filter: "blur(7px)"
            }
      }
      whileInView={
        reduced
          ? undefined
          : {
              opacity: 1,
              y: 0,
              filter: "blur(0px)"
            }
      }
      viewport={{
        once: true,
        amount: 0.12
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

function TiltCard({
  children,
  className = ""
}) {
  const ref = useRef(null);

  const move = (e) => {
    if (
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const el = ref.current;

    if (!el) {
      return;
    }

    const r = el.getBoundingClientRect();

    const px =
      (e.clientX - r.left) / r.width;

    const py =
      (e.clientY - r.top) / r.height;

    el.style.setProperty(
      "--rx",
      `${(py - 0.5) * -5}deg`
    );

    el.style.setProperty(
      "--ry",
      `${(px - 0.5) * 7}deg`
    );

    el.style.setProperty(
      "--mx",
      `${px * 100}%`
    );

    el.style.setProperty(
      "--my",
      `${py * 100}%`
    );
  };

  const leave = () => {
    const el = ref.current;

    if (el) {
      el.style.setProperty(
        "--rx",
        "0deg"
      );

      el.style.setProperty(
        "--ry",
        "0deg"
      );
    }
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      data-cursor="interactive"
      onMouseMove={move}
      onMouseLeave={leave}
    >
      {children}
    </div>
  );
}

function Stat({
  label,
  value
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let s = 0;

    const step = Math.max(
      1,
      Math.ceil(value / 20)
    );

    const t = setInterval(() => {
      s = Math.min(
        value,
        s + step
      );

      setN(s);

      if (s >= value) {
        clearInterval(t);
      }
    }, 34);

    return () => clearInterval(t);
  }, [value]);

  return (
    <div className="stat">
      <strong>{n}</strong>
      <span>{label}</span>
    </div>
  );
}

function Feature({
  title,
  items,
  module,
  index,
  icon: Icon = Sparkles
}) {
  return (
    <Reveal className="feature-block">
      <div className="section-head">
        <div>
          <span className="eyebrow">
            0{index} / HIGHLIGHTS
          </span>

          <h2>{title}</h2>
        </div>

        <Link
          to={`/portfolio/${module}`}
          data-cursor="interactive"
        >
          View all
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="record-grid">
        {items.map((x, i) => (
          <Reveal
            key={x._id}
            delay={i * 0.06}
          >
            <TiltCard className="record-card glass">
              <Link
                to={pathFor(
                  module,
                  x._id
                )}
                data-cursor="interactive"
              >
                <span className="card-icon">
                  <Icon size={18} />
                </span>

                <small>
                  {module === "experience"
                    ? `${x.organization || ""} · ${
                        x.category ||
                        "Professional"
                      }`
                    : module === "publications"
                      ? (
                          x.journalName ||
                          x.venue ||
                          "Publication"
                        )
                      : module === "projects"
                        ? (
                            x.status ||
                            "Project"
                          )
                        : "Academic record"}
                </small>

                <h3>
                  {labelFor(
                    x,
                    module
                  )}
                </h3>

                <p>
                  {descFor(x)}
                </p>

                <span className="card-action">
                  Explore
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Reveal>
  );
}

function FAQ() {
  const qs = [
    [
      "Is the portfolio data live?",
      "Yes. Public records are loaded from the existing backend and MongoDB data, respecting visibility settings."
    ],
    [
      "How can I contact Dr. Shabir?",
      "Use the contact details in Personal Information or send a message through the contact form."
    ],
    [
      "Does the CV use the same data?",
      "Yes. The CV Generator and public portfolio use the same live portfolio records and CV settings."
    ]
  ];

  const [open, setOpen] = useState(0);

  return (
    <div className="faq-list">
      {qs.map((q, i) => (
        <button
          className={`faq-item ${
            open === i ? "open" : ""
          }`}
          onClick={() =>
            setOpen(
              open === i
                ? -1
                : i
            )
          }
          key={q[0]}
          data-cursor="interactive"
        >
          <div>
            <strong>
              {q[0]}
            </strong>

            {open === i && (
              <motion.p
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: "auto"
                }}
              >
                {q[1]}
              </motion.p>
            )}
          </div>

          <ChevronDown size={18} />
        </button>
      ))}
    </div>
  );
}

function ContactPanel({
  personal
}) {
  const [
    form,
    setForm
  ] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [
    status,
    setStatus
  ] = useState("");

  const [
    busy,
    setBusy
  ] = useState(false);

  const change = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]:
        e.target.value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setStatus("");

    try {
      await api.post(
        "/contact",
        form
      );

      setStatus("success");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      setStatus(
        err.response?.data?.message ||
          "Unable to send your message."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="contact-panel">
      <div className="contact-info">
        <span className="eyebrow">
          CONTACT
        </span>

        <h3>
          Let’s connect.
        </h3>

        <p>
          For academic collaboration,
          research discussion,
          supervision, professional
          opportunities or general
          enquiries, use the details
          below or send a message.
        </p>

        <div className="contact-links">
          {personal.email && (
            <a
              href={`mailto:${personal.email}`}
            >
              <Mail size={18} />

              <span>
                <small>
                  Email
                </small>

                {personal.email}
              </span>
            </a>
          )}

          {personal.phone && (
            <a
              href={`tel:${personal.phone}`}
            >
              <Phone size={18} />

              <span>
                <small>
                  Phone
                </small>

                {personal.phone}
              </span>
            </a>
          )}

          {personal.location && (
            <div>
              <MapPin size={18} />

              <span>
                <small>
                  Location
                </small>

                {personal.location}
              </span>
            </div>
          )}
        </div>
      </div>

      <form
        className="contact-form"
        onSubmit={submit}
      >
        <div className="form-row">
          <input
            name="name"
            value={form.name}
            onChange={change}
            placeholder="Your name *"
            required
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            placeholder="Your email *"
            required
          />
        </div>

        <input
          name="subject"
          value={form.subject}
          onChange={change}
          placeholder="Subject *"
          required
        />

        <textarea
          name="message"
          value={form.message}
          onChange={change}
          placeholder="Your message *"
          rows="6"
          required
        />

        <button
          className="primary-btn submit-btn"
          disabled={busy}
        >
          {busy
            ? "Sending..."
            : "Send Message"}

          <Send size={16} />
        </button>

        {status && (
          <div
            className={`form-status ${
              status === "success"
                ? "success"
                : "error"
            }`}
          >
            {status === "success"
              ? "Message sent successfully."
              : status}
          </div>
        )}
      </form>
    </div>
  );
}

export default function PublicPortfolio() {
  const [p, setP] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const reduced =
    useReducedMotion();

  usePublicInteractions(
    reduced
  );

  useMouseParallax(
    reduced
  );

  useEffect(() => {
    api
      .get("/portfolio")
      .then((r) =>
        setP(r.data.data)
      )
      .catch((e) =>
        setError(
          e.response?.data?.message ||
            "Unable to load portfolio"
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, []);

  if (loading) {
    return (
      <div className="public-loading">
        Loading portfolio
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-loading">
        {error}
      </div>
    );
  }

  const personal =
    p?.personal || {};

  const profile =
    p?.profile || {};

  const visible =
    p?.moduleVisibility || {};

  const published = (k) =>
    visible[k] !== false;

  const name =
    personal.fullName ||
    profile.fullName ||
    "Dr. Muhammad Shabir Afridi";

  const title =
    personal.designation ||
    profile.currentDesignation ||
    profile.professionalTitle ||
    "Professor";

  const summary =
    profile.professionalSummary ||
    profile.biography ||
    "Academic, researcher and professional portfolio.";

  const hobbies =
    Array.isArray(profile.hobbies)
      ? profile.hobbies
      : Array.isArray(personal.hobbies)
        ? personal.hobbies
        : [];

  const ongoing =
    Array.isArray(profile.ongoingWork)
      ? profile.ongoingWork
      : [];

  const mission =
    listFor(
      p,
      "mission"
    );

  const vision =
    listFor(
      p,
      "vision"
    );

  const ongoingItems =
    ongoing.length
      ? ongoing
      : [
          ...listFor(
            p,
            "projectWins"
          ).slice(0, 2),

          ...listFor(
            p,
            "researchResources"
          ).slice(0, 2),

          ...listFor(
            p,
            "supervision"
          ).slice(0, 2)
        ];

  const counts = {
    Education:
      listFor(
        p,
        "education"
      ).length,

    Experience:
      listFor(
        p,
        "experience"
      ).length,

    Publications:
      listFor(
        p,
        "publications"
      ).length,

    Projects:
      listFor(
        p,
        "projects"
      ).length,

    Skills:
      listFor(
        p,
        "skills"
      ).length
  };

  const imageValue =
    profile.profileImage ||
    personal.profileImage ||
    "";

  /*
   * FIX:
   * The old code contained:
   * .replace(/\\/api$/,"")
   *
   * which is an invalid regular expression.
   *
   * Correct regex:
   * /\/api$/
   */
  const profileImage =
    imageValue
      ? (
          imageValue.startsWith(
            "http"
          )
            ? imageValue
            : `${
                (
                  import.meta.env
                    .VITE_API_URL ||
                  "http://localhost:5000/api"
                ).replace(
                  /\/api$/,
                  ""
                )
              }${
                imageValue.startsWith(
                  "/"
                )
                  ? imageValue
                  : `/${imageValue}`
              }`
        )
      : null;

  const navItems = [
    ["#home", "Profile"],
    ["#about", "About Profile"],
    ["#personal", "Personal"],

    published("education") && [
      "#education",
      "Education"
    ],

    published("experience") && [
      "#experience",
      "Experience"
    ],

    published("skills") && [
      "#skills",
      "Skills"
    ],

    published("publications") && [
      "#research",
      "Publications"
    ],

    published(
      "researchResources"
    ) && [
      "#research-resources",
      "Research Resources"
    ],

    published("projectWins") && [
      "#project-wins",
      "Project Wins"
    ],

    published("supervision") && [
      "#supervision",
      "Supervision"
    ],

    published("reviewer") && [
      "#reviewer",
      "Reviewer"
    ],

    published("projects") && [
      "#projects",
      "Projects"
    ],

    published("awards") && [
      "#awards",
      "Awards"
    ],

    published("certificates") && [
      "#certificates",
      "Certificates"
    ],

    published("conferences") && [
      "#conferences",
      "Conferences"
    ],

    published("mission") && [
      "#mission",
      "Mission"
    ],

    published("vision") && [
      "#vision",
      "Vision"
    ],

    hobbies.length && [
      "#hobbies",
      "Hobbies"
    ],

    ongoingItems.length && [
      "#ongoing",
      "Ongoing Work"
    ],

    published("references") && [
      "#references",
      "References"
    ],

    ["#faq", "FAQ"],
    ["#personal", "Contact"]
  ].filter(Boolean);

  const socials = [
    personal.linkedin && [
      "LinkedIn",
      personal.linkedin,
      Globe2
    ],

    personal.googleScholar && [
      "Google Scholar",
      personal.googleScholar,
      Search
    ],

    personal.researchGate && [
      "ResearchGate",
      personal.researchGate,
      Microscope
    ],

    personal.orcid && [
      "ORCID",
      personal.orcid,
      Globe2
    ],

    personal.website && [
      "Website",
      personal.website,
      Globe2
    ]
  ].filter(Boolean);

  return (
    <div className="public-site">
      <div className="ambient-grid" />
      <div className="mouse-glow" />
      <div className="color-orb orb-one" />
      <div className="color-orb orb-two" />

      <header className="public-nav">
        <Link
          className="brand"
          to="/portfolio"
          data-cursor="interactive"
        >
          <span className="brand-dot" />
          MSA
          <span className="brand-muted">
            / ACADEMIC
          </span>
        </Link>

        <nav aria-label="Portfolio modules">
          {navItems.map(
            ([href, label]) => (
              <a
                key={`${href}-${label}`}
                href={href}
                data-cursor="interactive"
              >
                {label}
              </a>
            )
          )}
        </nav>

        <a
          className="nav-cta"
          href="#personal"
          data-cursor="interactive"
        >
          Contact
          <ArrowUpRight size={15} />
        </a>
      </header>

      <main>
        <section
          className="hero"
          id="home"
        >
          <div className="hero-orb orb-a" />
          <div className="hero-orb orb-b" />
          <div className="hero-orb orb-c" />

          <div className="hero-copy">
            <Reveal>
              <span className="eyebrow">
                ACADEMIC · RESEARCH · PROFESSIONAL
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1>
                Knowledge into{" "}
                <em>impact.</em>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p>
                {summary}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="hero-actions">
                <a
                  className="primary-btn"
                  href="#about"
                  data-cursor="interactive"
                >
                  Explore Portfolio
                  <ArrowUpRight size={17} />
                </a>

                {personal.cvUrl && (
                  <a
                    className="ghost-btn"
                    href={personal.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="interactive"
                  >
                    View CV
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </Reveal>

            <div className="social-row">
              {socials.map(
                ([
                  label,
                  url,
                  Icon
                ]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="interactive"
                  >
                    <Icon size={13} />
                    {label}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="hero-profile">
            <div className="hero-depth depth-one" />
            <div className="hero-depth depth-two" />

            <motion.div
              className="profile-ring"
              animate={
                reduced
                  ? {}
                  : {
                      y: [0, -10, 0],
                      rotate: [
                        0,
                        1,
                        -1,
                        0
                      ]
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={name}
                />
              ) : (
                <div className="profile-placeholder">
                  MSA
                </div>
              )}
            </motion.div>

            <TiltCard className="profile-card glass">
              <span>
                {title}
              </span>

              <strong>
                {profile.organization ||
                  personal.institution ||
                  "Academic & Research Professional"}
              </strong>

              <small>
                {profile.department ||
                  "Research · Education · Innovation"}
              </small>
            </TiltCard>
          </div>
        </section>

        <Reveal>
          <section className="stats-bar glass">
            {Object.entries(
              counts
            ).map(
              ([k, v]) => (
                <Stat
                  key={k}
                  label={k}
                  value={v}
                />
              )
            )}
          </section>
        </Reveal>

        <section
          className="about-section"
          id="about"
        >
          <Reveal>
            <div className="section-intro">
              <span className="eyebrow">
                ABOUT ME
              </span>

              <h2>
                Scholarship with a
                <br />
                <span>
                  practical edge.
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="about-copy">
              <p>
                {profile.biography ||
                  profile.shortBio ||
                  summary}
              </p>

              <div className="mini-meta">
                <span>
                  Current role
                </span>

                <strong>
                  {profile.currentJob ||
                    profile.currentDesignation ||
                    title}
                </strong>
              </div>

              <div className="mini-meta">
                <span>
                  Organization
                </span>

                <strong>
                  {profile.organization ||
                    personal.institution ||
                    "—"}
                </strong>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          className="personal-section"
          id="personal"
        >
          <Reveal>
            <div className="section-head">
              <div>
                <span className="eyebrow">
                  PERSONAL INFORMATION
                </span>

                <h2>
                  Connect with the researcher.
                </h2>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="personal-grid">
              {personal.email && (
                <TiltCard className="personal-card glass">
                  <Mail />
                  <small>
                    Email
                  </small>

                  <a
                    href={`mailto:${personal.email}`}
                  >
                    {personal.email}
                  </a>
                </TiltCard>
              )}

              {personal.phone && (
                <TiltCard className="personal-card glass">
                  <Phone />
                  <small>
                    Phone
                  </small>

                  <a
                    href={`tel:${personal.phone}`}
                  >
                    {personal.phone}
                  </a>
                </TiltCard>
              )}

              {personal.location && (
                <TiltCard className="personal-card glass">
                  <MapPin />
                  <small>
                    Location
                  </small>

                  <strong>
                    {personal.location}
                  </strong>
                </TiltCard>
              )}

              {personal.website && (
                <TiltCard className="personal-card glass">
                  <Globe2 />
                  <small>
                    Professional Website
                  </small>

                  <a
                    href={personal.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit website
                    <ExternalLink size={14} />
                  </a>
                </TiltCard>
              )}

              {socials.map(
                ([
                  label,
                  url,
                  Icon
                ]) => (
                  <TiltCard
                    className="personal-card glass"
                    key={label}
                  >
                    <Icon />
                    <small>
                      Professional Link
                    </small>

                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {label}
                      <ExternalLink size={14} />
                    </a>
                  </TiltCard>
                )
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <ContactPanel
              personal={personal}
            />
          </Reveal>
        </section>

        {published("education") && (
          <section
            className="feature-section ordered-section"
            id="education"
          >
            <Feature
              title="Education"
              items={listFor(
                p,
                "education"
              ).slice(0, 6)}
              module="education"
              index={1}
              icon={GraduationCap}
            />
          </section>
        )}

        {published("experience") && (
          <section
            className="feature-section ordered-section"
            id="experience"
          >
            <Feature
              title="Experience"
              items={listFor(
                p,
                "experience"
              ).slice(0, 6)}
              module="experience"
              index={2}
              icon={BriefcaseBusiness}
            />
          </section>
        )}

        {published("publications") && (
          <section
            className="feature-section ordered-section"
            id="research"
          >
            <Feature
              title="Research publications"
              items={listFor(
                p,
                "publications"
              ).slice(0, 6)}
              module="publications"
              index={3}
              icon={BookOpen}
            />
          </section>
        )}

        {published("skills") && (
          <section
            className="feature-section ordered-section"
            id="skills"
          >
            <Feature
              title="Skills"
              items={listFor(
                p,
                "skills"
              ).slice(0, 8)}
              module="skills"
              index={4}
              icon={Sparkles}
            />
          </section>
        )}

        {published(
          "researchResources"
        ) && (
          <section
            className="feature-section ordered-section"
            id="research-resources"
          >
            <Feature
              title="Research Resources"
              items={listFor(
                p,
                "researchResources"
              ).slice(0, 6)}
              module="research-resources"
              index={5}
              icon={Microscope}
            />
          </section>
        )}

        {published(
          "projectWins"
        ) && (
          <section
            className="feature-section ordered-section"
            id="project-wins"
          >
            <Feature
              title="Project Wins"
              items={listFor(
                p,
                "projectWins"
              ).slice(0, 6)}
              module="project-wins"
              index={6}
              icon={Award}
            />
          </section>
        )}

        {published(
          "supervision"
        ) && (
          <section
            className="feature-section ordered-section"
            id="supervision"
          >
            <Feature
              title="Supervision"
              items={listFor(
                p,
                "supervision"
              ).slice(0, 6)}
              module="supervision"
              index={7}
              icon={Users}
            />
          </section>
        )}

        {published(
          "reviewer"
        ) && (
          <section
            className="feature-section ordered-section"
            id="reviewer"
          >
            <Feature
              title="Reviewer"
              items={listFor(
                p,
                "reviewer"
              ).slice(0, 6)}
              module="reviewer"
              index={8}
              icon={BookOpen}
            />
          </section>
        )}

        {published(
          "projects"
        ) && (
          <section
            className="feature-section ordered-section"
            id="projects"
          >
            <Feature
              title="Projects"
              items={listFor(
                p,
                "projects"
              ).slice(0, 6)}
              module="projects"
              index={9}
              icon={Layers3}
            />
          </section>
        )}

        <section
          className="split-section"
          id="awards"
        >
          <Reveal>
            <div>
              <span className="eyebrow">
                AWARDS & CERTIFICATES
              </span>

              <h2>
                Recognition and
                <br />
                <span>
                  professional growth.
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="split-cards">
              {published(
                "awards"
              ) &&
                listFor(
                  p,
                  "awards"
                )
                  .slice(0, 3)
                  .map((x) => (
                    <TiltCard
                      className="compact-card glass"
                      key={x._id}
                    >
                      <Link
                        to={pathFor(
                          "awards",
                          x._id
                        )}
                      >
                        <Award />

                        <small>
                          Award ·{" "}
                          {x.year || ""}
                        </small>

                        <h3>
                          {x.title ||
                            x.name}
                        </h3>

                        <p>
                          {descFor(x)}
                        </p>
                      </Link>
                    </TiltCard>
                  ))}

              <span
                id="certificates"
                className="section-anchor"
                aria-hidden="true"
              />

              {published(
                "certificates"
              ) &&
                listFor(
                  p,
                  "certificates"
                )
                  .slice(0, 3)
                  .map((x) => (
                    <TiltCard
                      className="compact-card glass"
                      key={x._id}
                    >
                      <Link
                        to={pathFor(
                          "certificates",
                          x._id
                        )}
                      >
                        <ShieldCheck />

                        <small>
                          {x.category ||
                            "Certification"}
                        </small>

                        <h3>
                          {x.title}
                        </h3>

                        <p>
                          {x.issuingOrganization ||
                            x.organization ||
                            descFor(x)}
                        </p>
                      </Link>
                    </TiltCard>
                  ))}
            </div>
          </Reveal>
        </section>

        {published(
          "conferences"
        ) && (
          <section
            className="feature-section ordered-section"
            id="conferences"
          >
            <Feature
              title="Conferences"
              items={listFor(
                p,
                "conferences"
              ).slice(0, 6)}
              module="conferences"
              index={5}
              icon={Globe2}
            />
          </section>
        )}

        {hobbies.length > 0 && (
          <section
            className="interest-section glass"
            id="hobbies"
          >
            <Reveal>
              <div>
                <span className="eyebrow">
                  HOBBIES
                </span>

                <h2>
                  Beyond the
                  <br />
                  <span>
                    work.
                  </span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="interest-list">
                {hobbies.map(
                  (x, i) => (
                    <span
                      key={`${x}-${i}`}
                    >
                      <Heart size={12} />
                      {x}
                    </span>
                  )
                )}
              </div>
            </Reveal>
          </section>
        )}

        {(mission.length ||
          vision.length) > 0 && (
          <section
            className="mission-section"
            id="mission"
          >
            <Reveal>
              <div className="section-head">
                <div>
                  <span className="eyebrow">
                    MISSION & VISION
                  </span>

                  <h2>
                    Purpose behind the work.
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="mission-grid">
              {mission.map(
                (x) => (
                  <Reveal
                    key={x._id}
                  >
                    <TiltCard className="mission-card glass">
                      <Target />

                      <small>
                        Mission
                      </small>

                      <h3>
                        {x.title ||
                          "Mission"}
                      </h3>

                      <p>
                        {x.description}
                      </p>
                    </TiltCard>
                  </Reveal>
                )
              )}

              <span
                id="vision"
                className="section-anchor"
                aria-hidden="true"
              />

              {vision.map(
                (x) => (
                  <Reveal
                    key={x._id}
                  >
                    <TiltCard className="mission-card glass">
                      <Sparkles />

                      <small>
                        Vision
                      </small>

                      <h3>
                        {x.title ||
                          "Vision"}
                      </h3>

                      <p>
                        {x.description}
                      </p>
                    </TiltCard>
                  </Reveal>
                )
              )}
            </div>
          </section>
        )}

        {ongoingItems.length >
          0 && (
          <section
            className="feature-section"
            id="ongoing"
          >
            <Reveal className="feature-block">
              <div className="section-head">
                <div>
                  <span className="eyebrow">
                    CURRENT WORK
                  </span>

                  <h2>
                    Ongoing work
                  </h2>
                </div>
              </div>

              <div className="record-grid">
                {ongoingItems
                  .slice(0, 6)
                  .map(
                    (x, i) => (
                      <Reveal
                        key={
                          x._id ||
                          i
                        }
                        delay={
                          i *
                          0.06
                        }
                      >
                        <TiltCard className="record-card glass">
                          <div className="ongoing-card">
                            <span className="card-icon">
                              <Microscope size={18} />
                            </span>

                            <small>
                              {x.category ||
                                x.type ||
                                "Research / Project"}
                            </small>

                            <h3>
                              {x.title ||
                                x.name ||
                                "Ongoing work"}
                            </h3>

                            <p>
                              {descFor(
                                x
                              )}
                            </p>
                          </div>
                        </TiltCard>
                      </Reveal>
                    )
                  )}
              </div>
            </Reveal>
          </section>
        )}

        {published(
          "references"
        ) && (
          <section
            className="feature-section"
            id="references"
          >
            <Feature
              title="References"
              items={listFor(
                p,
                "references"
              ).slice(0, 6)}
              module="references"
              index={7}
              icon={Users}
            />
          </section>
        )}

        <section
          className="faq-section"
          id="faq"
        >
          <Reveal>
            <div className="section-intro">
              <span className="eyebrow">
                FAQ
              </span>

              <h2>
                Quick answers.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <FAQ />
          </Reveal>
        </section>
      </main>

      <footer>
        <div className="footer-top">
          <div className="brand">
            <span className="brand-dot" />
            MSA

            <span className="brand-muted">
              / ACADEMIC
            </span>
          </div>

          <p>
            {name} · Academic &
            Professional Portfolio
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          {navItems.map(([href, label]) => (
            <a key={`footer-${href}-${label}`} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="footer-actions">
          <a href="#personal">
            Contact
          </a>

          <a href="#home">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}