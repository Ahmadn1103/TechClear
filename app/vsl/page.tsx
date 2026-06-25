"use client";

import { useState } from "react";

const ENROLL_URL = "https://whop.com/tech-clear/pm-ai-cohort/";

export default function VSLPage() {
  const [vslLoaded, setVslLoaded] = useState(false);

  return (
    <>
      <style>{`
        :root {
          --bg:#0a0e16;--bg-2:#0e131d;--surface:#141b27;--surface-2:#1a2230;
          --text:#eef2f8;--text-soft:#94a1b5;--line:rgba(255,255,255,.09);
          --accent:#3d9bff;--accent-2:#22d3ee;--accent-soft:rgba(61,155,255,.14);
        }
        .vsl-body { font-family:'Hanken Grotesk',-apple-system,sans-serif; background:var(--bg); color:var(--text); line-height:1.6; -webkit-font-smoothing:antialiased; overflow-x:hidden; min-height:100vh; }
        .vsl-wrap { max-width:1140px; margin:0 auto; padding:0 26px; position:relative; z-index:2; }

        .vsl-glow { position:fixed; border-radius:50%; filter:blur(120px); opacity:.5; pointer-events:none; z-index:0; }
        .vsl-glow-a { top:-160px; right:-120px; width:520px; height:520px; background:radial-gradient(circle,rgba(61,155,255,.5),transparent 70%); }
        .vsl-glow-b { top:560px; left:-180px; width:480px; height:480px; background:radial-gradient(circle,rgba(34,211,238,.32),transparent 70%); }

        /* ---------- nav ---------- */
        .vsl-nav-outer { position:fixed; top:0; left:0; right:0; z-index:50; backdrop-filter:blur(12px); background:rgba(10,14,22,.7); border-bottom:1px solid var(--line); }
        .vsl-nav { display:flex; justify-content:space-between; align-items:center; padding:22px 26px; max-width:1140px; margin:0 auto; }
        .vsl-nav-spacer { height:73px; }
        .vsl-brand { font-weight:700; font-size:21px; letter-spacing:-.02em; display:flex; align-items:center; gap:9px; color:var(--text); text-decoration:none; }
        .vsl-spark { width:11px; height:11px; border-radius:3px; background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 0 16px var(--accent); display:inline-block; flex-shrink:0; }
        .vsl-nav-links { display:flex; gap:30px; font-size:14.5px; color:var(--text-soft); font-weight:500; }
        .vsl-nav-links a { color:var(--text-soft); text-decoration:none; transition:color .2s; }
        .vsl-nav-links a:hover { color:var(--text); }
        .vsl-nav-cta { font-weight:600; font-size:14.5px; background:var(--text); color:var(--bg); padding:10px 20px; border-radius:40px; transition:.2s; text-decoration:none; white-space:nowrap; }
        .vsl-nav-cta:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(238,242,248,.2); }
        @media(max-width:760px){ .vsl-nav-links { display:none; } }

        /* ---------- hero ---------- */
        .vsl-hero { padding:96px 0 56px; text-align:center; }
        .vsl-eyebrow { display:inline-flex; align-items:center; gap:9px; font-size:12.5px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--accent); background:var(--accent-soft); border:1px solid rgba(61,155,255,.25); padding:7px 16px; border-radius:40px; margin-bottom:30px; }
        .vsl-dot { width:6px; height:6px; border-radius:50%; background:var(--accent-2); box-shadow:0 0 10px var(--accent-2); animation:vslPulse 2s infinite; display:inline-block; flex-shrink:0; }
        @keyframes vslPulse { 0%,100%{opacity:1}50%{opacity:.35} }
        .vsl-h1 { font-weight:700; font-size:clamp(42px,7vw,82px); line-height:1.04; letter-spacing:-.03em; max-width:15ch; margin:0 auto; }
        .vsl-grad { background:linear-gradient(120deg,var(--accent),var(--accent-2)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .vsl-lede { font-size:clamp(16px,2.1vw,20px); color:var(--text-soft); max-width:64ch; margin:28px auto 0; text-align:center; }
        .vsl-actions { display:flex; flex-wrap:wrap; gap:14px; justify-content:center; margin-top:40px; }
        .vsl-btn { font-weight:600; font-size:15.5px; padding:15px 30px; border-radius:48px; transition:transform .15s,box-shadow .25s,background .2s; cursor:pointer; border:none; display:inline-flex; align-items:center; gap:9px; text-decoration:none; }
        .vsl-btn-primary { background:linear-gradient(120deg,var(--accent),var(--accent-2)); color:#04121f; box-shadow:0 10px 34px -8px rgba(61,155,255,.6); }
        .vsl-btn-primary:hover { transform:translateY(-2px); box-shadow:0 16px 40px -8px rgba(61,155,255,.7); }
        .vsl-btn-ghost { background:rgba(255,255,255,.04); color:var(--text); border:1px solid var(--line); }
        .vsl-btn-ghost:hover { background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.2); }

        /* ---------- VSL ---------- */
        .vsl-section { padding:24px 0 80px; }
        .vsl-frame { position:relative; border-radius:22px; overflow:hidden; border:1px solid var(--line); background:#000; box-shadow:0 40px 100px -40px rgba(0,0,0,.8),0 0 0 1px rgba(61,155,255,.1); aspect-ratio:1080/1906; max-width:392px; margin:0 auto; }
        .vsl-frame iframe,.vsl-frame video { position:absolute; inset:0; width:100%; height:100%; border:0; }
        .vsl-poster { position:absolute; inset:0; cursor:pointer; display:flex; align-items:center; justify-content:center; background-color:#000; background-image:linear-gradient(rgba(4,8,15,.32),rgba(4,8,15,.55)),url('https://i.vimeocdn.com/video/2165559795-ad8b40fa2e7f0e59d44ce2f1521e10870e4a526e13e23d157e1a6d0d17d18a92-d_2400?region=us'); background-size:cover; background-position:center; }
        .vsl-play { width:80px; height:80px; border-radius:50%; background:linear-gradient(120deg,var(--accent),var(--accent-2)); display:flex; align-items:center; justify-content:center; animation:vslRing 2.4s infinite; }
        @keyframes vslRing { 0%{box-shadow:0 0 0 0 rgba(61,155,255,.45)}70%{box-shadow:0 0 0 28px rgba(61,155,255,0)}100%{box-shadow:0 0 0 0 rgba(61,155,255,0)} }

        /* ---------- founder ---------- */
        .vsl-founder { max-width:620px; margin:42px auto 0; text-align:center; }
        .vsl-av { width:62px; height:62px; border-radius:50%; margin:0 auto 16px; background:linear-gradient(135deg,var(--accent),var(--accent-2)); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:21px; color:#04121f; box-shadow:0 0 32px -6px rgba(61,155,255,.7); }
        .vsl-eb { font-size:11.5px; letter-spacing:.16em; text-transform:uppercase; color:var(--accent); font-weight:600; margin-bottom:9px; }
        .vsl-founder h3 { font-weight:600; font-size:22px; letter-spacing:-.01em; }
        .vsl-founder .vsl-role { color:var(--text-soft); font-size:14px; margin-top:3px; }
        .vsl-founder p { color:var(--text-soft); font-size:15.5px; margin-top:16px; line-height:1.7; }
        .vsl-li { display:inline-flex; align-items:center; gap:7px; margin-top:16px; font-size:14px; font-weight:600; color:var(--accent); transition:color .2s; text-decoration:none; }
        .vsl-li:hover { color:var(--accent-2); }

        /* ---------- sections ---------- */
        .vsl-sec { padding:84px 0; border-top:1px solid var(--line); position:relative; }
        .vsl-label { font-size:13px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--accent); margin-bottom:16px; }
        .vsl-h2 { font-weight:700; font-size:clamp(28px,4.4vw,46px); line-height:1.1; letter-spacing:-.025em; max-width:20ch; }
        .vsl-intro { font-size:17px; color:var(--text-soft); max-width:58ch; margin-top:20px; }

        /* problem */
        .vsl-prob-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:22px; margin-top:46px; }
        .vsl-prob { background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:30px; transition:.25s; }
        .vsl-prob:hover { border-color:rgba(61,155,255,.4); transform:translateY(-3px); }
        .vsl-prob-n { font-weight:700; font-size:14px; color:var(--accent-2); letter-spacing:.1em; }
        .vsl-prob p { margin-top:14px; font-size:15.5px; color:var(--text); }

        /* what we do */
        .vsl-do-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:2px; margin-top:48px; background:var(--line); border:1px solid var(--line); border-radius:18px; overflow:hidden; }
        .vsl-do { background:var(--bg-2); padding:34px 30px; transition:background .25s; }
        .vsl-do:hover { background:var(--surface); }
        .vsl-do-ic { width:46px; height:46px; border-radius:12px; background:var(--accent-soft); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
        .vsl-do-ic svg { width:24px; height:24px; stroke:var(--accent); fill:none; stroke-width:1.8; }
        .vsl-do h3 { font-weight:600; font-size:19px; margin-bottom:9px; }
        .vsl-do p { font-size:14.5px; color:var(--text-soft); }

        /* flagship */
        .vsl-flag { display:grid; grid-template-columns:1.1fr 1fr; gap:56px; align-items:center; margin-top:40px; }
        @media(max-width:860px){ .vsl-flag { grid-template-columns:1fr; gap:36px; } }
        .vsl-flag-feats { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:8px; }
        @media(max-width:480px){ .vsl-flag-feats { grid-template-columns:1fr; } }
        .vsl-feat { border-left:2px solid var(--accent); padding:4px 0 4px 16px; }
        .vsl-feat h4 { font-weight:600; font-size:16px; }
        .vsl-feat p { font-size:13.5px; color:var(--text-soft); margin-top:5px; }
        .vsl-flag-visual { aspect-ratio:4/3; border-radius:20px; border:1px solid var(--line); background:linear-gradient(135deg,var(--surface),var(--bg-2)); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
        .vsl-flag-visual::before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 70% 30%,rgba(34,211,238,.18),transparent 60%); }
        .vsl-flag-badge { font-weight:700; text-align:center; z-index:2; }
        .vsl-flag-badge .big { font-size:clamp(40px,7vw,64px); background:linear-gradient(120deg,var(--accent),var(--accent-2)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:-.03em; }
        .vsl-flag-badge .sm { color:var(--text-soft); font-weight:500; font-size:14px; letter-spacing:.1em; text-transform:uppercase; margin-top:6px; }

        /* pricing */
        .vsl-pricing-bg { background:var(--bg-2); }
        .vsl-price-card { max-width:560px; margin:46px auto 0; background:linear-gradient(160deg,var(--surface),var(--bg-2)); border:1px solid var(--line); border-radius:24px; padding:48px 44px; text-align:center; box-shadow:0 40px 90px -40px rgba(0,0,0,.8); position:relative; overflow:hidden; }
        .vsl-price-card::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--accent),var(--accent-2)); }
        .vsl-price-tier { font-weight:600; font-size:16px; color:var(--accent-2); letter-spacing:.04em; }
        .vsl-price-amount { font-weight:800; font-size:clamp(54px,9vw,84px); line-height:1; letter-spacing:-.04em; margin:14px 0 6px; }
        .vsl-price-note { color:var(--text-soft); font-size:14.5px; margin-bottom:30px; }
        .vsl-price-list { list-style:none; text-align:left; max-width:360px; margin:0 auto 32px; padding:0; }
        .vsl-price-list li { padding:11px 0; border-bottom:1px solid var(--line); font-size:15px; display:flex; gap:13px; align-items:flex-start; }
        .vsl-price-list li:last-child { border:none; }
        .vsl-ck { color:var(--accent-2); flex-shrink:0; font-weight:700; }
        .vsl-guarantee { margin-top:20px; font-size:13px; color:var(--text-soft); }

        /* logistics */
        .vsl-schedule { display:flex; flex-wrap:wrap; gap:18px; margin-top:42px; }
        .vsl-sched { flex:1; min-width:190px; background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:26px; }
        .vsl-sched .k { font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); font-weight:600; }
        .vsl-sched .v { font-weight:600; font-size:22px; margin-top:9px; }
        .vsl-sched .v small { font-weight:400; font-size:13px; color:var(--text-soft); display:block; margin-top:5px; }

        /* footer */
        .vsl-footer { border-top:1px solid var(--line); padding:54px 0; text-align:center; }
        .vsl-fnav { display:flex; gap:26px; justify-content:center; flex-wrap:wrap; font-size:14px; color:var(--text-soft); margin-bottom:18px; }
        .vsl-fnav a { color:var(--text-soft); text-decoration:none; transition:color .2s; }
        .vsl-fnav a:hover { color:var(--text); }
        .vsl-footer p { font-size:13px; color:var(--text-soft); margin-top:8px; }
        .vsl-ig { color:var(--accent) !important; }

        /* ===== MOBILE ===== */
        @media(max-width:600px){
          .vsl-wrap { padding:0 18px; }
          .vsl-nav { padding:16px 18px; }
          .vsl-nav-spacer { height:61px; }
          .vsl-nav-cta { font-size:13px; padding:8px 14px; }

          .vsl-hero { padding:40px 0 32px; }
          .vsl-eyebrow { font-size:11px; padding:6px 12px; margin-bottom:20px; }
          .vsl-h1 { font-size:clamp(34px,10vw,52px); }
          .vsl-lede { font-size:15px; margin-top:18px; }
          .vsl-actions { flex-direction:column; margin-top:28px; gap:10px; }
          .vsl-btn { justify-content:center; width:100%; font-size:14.5px; padding:14px 20px; }

          .vsl-section { padding:16px 0 48px; }
          .vsl-frame { max-width:100%; border-radius:14px; }

          .vsl-founder { margin-top:32px; }
          .vsl-founder p { font-size:14.5px; }

          .vsl-sec { padding:48px 0; }
          .vsl-h2 { font-size:clamp(24px,7vw,36px); }
          .vsl-intro { font-size:15px; }

          .vsl-prob-grid { grid-template-columns:1fr; gap:14px; margin-top:28px; }
          .vsl-prob { padding:22px 20px; }

          .vsl-do-grid { grid-template-columns:1fr; margin-top:28px; border-radius:14px; }
          .vsl-do { padding:24px 20px; }

          .vsl-flag { gap:28px; margin-top:24px; }
          .vsl-flag-feats { gap:14px; margin-top:16px; }
          .vsl-flag-visual { aspect-ratio:16/7; border-radius:14px; }

          .vsl-price-card { padding:32px 20px; border-radius:18px; }
          .vsl-price-amount { font-size:clamp(48px,14vw,72px); }
          .vsl-price-list { max-width:100%; }
          .vsl-price-list li { font-size:14px; padding:10px 0; }

          .vsl-schedule { gap:12px; }
          .vsl-sched { min-width:calc(50% - 6px); padding:20px 16px; }
          .vsl-sched .v { font-size:18px; }

          .vsl-footer { padding:36px 0; }
          .vsl-fnav { gap:16px; font-size:13px; }
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Fixed Nav — outside vsl-body so overflow:hidden doesn't trap it */}
      <div className="vsl-nav-outer">
        <nav className="vsl-nav">
            <a href="/vsl" className="vsl-brand">
              <span className="vsl-spark" />
              TechClear
            </a>
            <div className="vsl-nav-links">
              <a href="#vsl-about">About</a>
              <a href="#vsl-solution">Our Solution</a>
              <a href="#vsl-flagship">Flagship Program</a>
            </div>
            <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer" className="vsl-nav-cta">
              Enroll →
            </a>
          </nav>
      </div>

      <div className="vsl-body">
        <div className="vsl-glow vsl-glow-a" />
        <div className="vsl-glow vsl-glow-b" />

        {/* Spacer so hero content starts below the fixed nav */}
        <div className="vsl-nav-spacer" />

        {/* Hero */}
        <header className="vsl-wrap vsl-hero">
          <div className="vsl-eyebrow">
            <span className="vsl-dot" />
            IT Workforce Training · Cohort starts Monday, July 6
          </div>
          <h1 className="vsl-h1">
            Build with intention.{" "}
            <span className="vsl-grad">Advance the tech future.</span>
          </h1>
          <p className="vsl-lede">
            TechClear equips driven professionals like managers, engineers, and innovators with the skills,
            certifications, and mentorship to create impact in a rapidly evolving tech landscape.
          </p>
          <div className="vsl-actions">
            <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer" className="vsl-btn vsl-btn-primary">
              Enroll in the Flagship Program →
            </a>
            <a href="#vsl-video" className="vsl-btn vsl-btn-ghost">
              ▶ Watch the overview
            </a>
          </div>
        </header>

        {/* VSL */}
        <div className="vsl-wrap vsl-section" id="vsl-video">
          <div className="vsl-frame">
            {vslLoaded ? (
              <iframe
                src="https://player.vimeo.com/video/1198860755?h=884a843cdd&autoplay=1&badge=0&autopause=0&title=0&byline=0&portrait=0&dnt=1"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                title="TechClear PM + AI Flagship Program overview"
              />
            ) : (
              <div className="vsl-poster" onClick={() => setVslLoaded(true)}>
                <div className="vsl-play">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="#04121f" style={{ marginLeft: 5 }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Enroll CTA below video */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer" className="vsl-btn vsl-btn-primary">
              Enroll Now →
            </a>
          </div>

          {/* Founder */}
          <div className="vsl-founder">
            <div className="vsl-av">AR</div>
            <div className="vsl-eb">Meet your instructor</div>
            <h3>Abdullah Rafiq</h3>
            <div className="vsl-role">Founder, TechClear</div>
            <p>
              Over the past three years, Abdullah has personally trained 250+ students and helped them break into the
              tech industry. He built TechClear to take that same proven path — the certifications, the AI skills, and
              the hands-on mentorship — and put it within reach of the masses.
            </p>
            <a
              className="vsl-li"
              href="https://www.linkedin.com/in/abdullahrafiq1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.5 18v-8H6v8h2.5zM7.25 8.5A1.25 1.25 0 1 0 7.25 6a1.25 1.25 0 0 0 0 2.5zM18 18v-4.5c0-2.3-1.2-3.4-2.9-3.4-1.3 0-1.9.7-2.2 1.2V10H10.5v8H13v-4.4c0-1.1.7-1.6 1.4-1.6.7 0 1.2.5 1.2 1.6V18H18z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>

        {/* About / Problem */}
        <section id="vsl-about" className="vsl-sec">
          <div className="vsl-wrap">
            <div className="vsl-label">Our Solution</div>
            <h2 className="vsl-h2">The tech industry is evolving at breakneck speed.</h2>
            <p className="vsl-intro">
              TechClear is dedicated to closing the skill gap — equipping IT professionals with the skills to lead in
              an AI-driven world, bridging technical expertise and modern project leadership.
            </p>
            <div className="vsl-prob-grid">
              <div className="vsl-prob">
                <div className="vsl-prob-n">01</div>
                <p>Traditional IT roles are being disrupted by AI, severing established career paths.</p>
              </div>
              <div className="vsl-prob">
                <div className="vsl-prob-n">02</div>
                <p>Professionals struggle to bridge the gap between technical skills and leadership.</p>
              </div>
              <div className="vsl-prob">
                <div className="vsl-prob-n">03</div>
                <p>Navigating the transition requires more than just self-study — it requires a community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section id="vsl-solution" className="vsl-sec">
          <div className="vsl-wrap">
            <div className="vsl-label">What We Do</div>
            <h2 className="vsl-h2">The framework, community, and coaching to build the future.</h2>
            <div className="vsl-do-grid">
              <div className="vsl-do">
                <div className="vsl-do-ic">
                  <svg viewBox="0 0 24 24"><path d="M12 2l3 6 6 .5-4.5 4 1.5 6L12 15l-5.5 3.5L8 12.5 3.5 8.5 9.5 8z" /></svg>
                </div>
                <h3>Certifications</h3>
                <p>SAFe Scrum Master 6.0 and industry-recognized credentials.</p>
              </div>
              <div className="vsl-do">
                <div className="vsl-do-ic">
                  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></svg>
                </div>
                <h3>Workshops &amp; Events</h3>
                <p>Immersive learning experiences designed for immediate application.</p>
              </div>
              <div className="vsl-do">
                <div className="vsl-do-ic">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                </div>
                <h3>1-on-1 Coaching</h3>
                <p>Personalized guidance from seasoned enterprise IT leaders.</p>
              </div>
              <div className="vsl-do">
                <div className="vsl-do-ic">
                  <svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /><circle cx="12" cy="12" r="3" /></svg>
                </div>
                <h3>AI Integration</h3>
                <p>Practical AI skills to elevate your project management capabilities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship */}
        <section id="vsl-flagship" className="vsl-sec">
          <div className="vsl-wrap">
            <div className="vsl-label">Flagship Program</div>
            <h2 className="vsl-h2">PM + AI Flagship Program</h2>
            <div className="vsl-flag">
              <div>
                <p className="vsl-intro" style={{ marginTop: 6 }}>
                  An intensive 8-week program combining SAFe Scrum Master 6.0 certification with hands-on AI
                  integration — built for IT professionals ready to step into leadership.
                </p>
                <div className="vsl-flag-feats">
                  <div className="vsl-feat"><h4>8-Week Curriculum</h4><p>A rigorous, phased approach across agile methodologies and AI.</p></div>
                  <div className="vsl-feat"><h4>SAFe SSM 6.0</h4><p>The globally recognized SAFe Scrum Master certification.</p></div>
                  <div className="vsl-feat"><h4>Flexible Delivery</h4><p>Virtual, in-person, or via 1-on-1 coaching.</p></div>
                  <div className="vsl-feat"><h4>Career Growth</h4><p>Position yourself at the forefront of the AI-driven economy.</p></div>
                </div>
              </div>
              <div className="vsl-flag-visual">
                <div className="vsl-flag-badge">
                  <div className="big">8 Weeks</div>
                  <div className="sm">PM + AI · SAFe SSM 6.0</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className={`vsl-sec vsl-pricing-bg`}>
          <div className="vsl-wrap" style={{ textAlign: "center" }}>
            <div className="vsl-label">Enrollment</div>
            <h2 className="vsl-h2" style={{ margin: "0 auto" }}>One program. Everything included.</h2>
          </div>
          <div className="vsl-wrap">
            <div className="vsl-price-card">
              <div className="vsl-price-tier">PM + AI Flagship Program — Cohort 1</div>
              <div className="vsl-price-amount">$3,000</div>
              <div className="vsl-price-note">Paid in full · one-time · cohort capped at 30 seats</div>
              <ul className="vsl-price-list">
                <li><span className="vsl-ck">✓</span><span>8 weeks of live, cohort-based instruction</span></li>
                <li><span className="vsl-ck">✓</span><span>SAFe Scrum Master 6.0 certification prep</span></li>
                <li><span className="vsl-ck">✓</span><span>Hands-on AI integration modules</span></li>
                <li><span className="vsl-ck">✓</span><span>1-on-1 coaching from enterprise IT leaders</span></li>
                <li><span className="vsl-ck">✓</span><span>All materials, recordings &amp; private community</span></li>
              </ul>
              <a
                href={ENROLL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="vsl-btn vsl-btn-primary"
                style={{ width: "100%", boxSizing: "border-box", justifyContent: "center" }}
              >
                Reserve my seat →
              </a>
              <div className="vsl-guarantee">Secure checkout via Whop</div>
            </div>
          </div>
        </section>

        {/* Logistics */}
        <section className="vsl-sec">
          <div className="vsl-wrap">
            <div className="vsl-label">Logistics</div>
            <h2 className="vsl-h2">The cohort at a glance.</h2>
            <div className="vsl-schedule">
              <div className="vsl-sched"><div className="k">Start date</div><div className="v">Mon, Jul 6</div></div>
              <div className="vsl-sched"><div className="k">Format</div><div className="v">8 weeks<small>Live + async</small></div></div>
              <div className="vsl-sched"><div className="k">Delivery</div><div className="v">Hybrid<small>In-person · virtual · 1-on-1</small></div></div>
              <div className="vsl-sched"><div className="k">Seats</div><div className="v">30 max<small>Small-group by design</small></div></div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="vsl-footer">
          <div className="vsl-wrap">
            <div className="vsl-brand" style={{ justifyContent: "center", fontSize: 24, marginBottom: 16 }}>
              <span className="vsl-spark" />
              TechClear
            </div>
            <div className="vsl-fnav">
              <a href="#vsl-about">About Us</a>
              <a href="#vsl-solution">Our Solution</a>
              <a href="#vsl-flagship">Flagship Program</a>
              <a href={ENROLL_URL} target="_blank" rel="noopener noreferrer">Enroll</a>
              <a className="vsl-ig" href="https://www.instagram.com/techclear.co" target="_blank" rel="noopener noreferrer">@techclear.co</a>
            </div>
            <p>© {new Date().getFullYear()} TechClear. Built for the world.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
