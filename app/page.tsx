"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";


export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Waitlist form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, interest, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }
      setFormState("success");
    } catch (err: unknown) {
      setFormState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* Launch Announcement Banner */}
      <a
        href="https://whop.com/tech-clear/pm-ai-cohort/"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-[60] block w-full bg-white text-black border-b border-black/10 hover:bg-zinc-200 transition-colors"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-3 flex items-center justify-center gap-3 md:gap-4 text-center">
          <span className="hidden sm:inline-block text-[10px] font-bold tracking-[0.25em] uppercase border border-black px-2.5 py-1">New</span>
          <p className="text-[11px] md:text-sm font-bold tracking-[0.15em] uppercase">
            Program launches July 6, 2026 <span className="opacity-50 mx-2">·</span> In-person portion in Arlington, VA <span className="opacity-50 mx-2 hidden md:inline">·</span> <span className="hidden md:inline underline underline-offset-4">Learn more</span>
          </p>
          <ArrowRight className="w-4 h-4 hidden md:inline" />
        </div>
      </a>

      {/* Navigation */}
      <header className="fixed top-[44px] md:top-[52px] w-full z-50 flex flex-col items-center pointer-events-none">
        <nav
          className={`pointer-events-auto transition-all duration-1000 ease-in-out flex justify-between items-center mt-4 w-[calc(100%-2rem)] max-w-[1400px] px-5 md:px-8 py-2 md:py-3 rounded-2xl border ${isScrolled || mobileMenuOpen
            ? "bg-[#050505]/90 backdrop-blur-xl border-white/10 shadow-2xl"
            : "bg-transparent backdrop-blur-none border-transparent shadow-none"
            }`}
        >
          <a href="#hero" className="flex items-center" onClick={(e) => { scrollTo('hero')(e); setMobileMenuOpen(false) }}>
            <div className="relative w-12 h-12 md:w-14 md:h-14 overflow-hidden">
              <Image src="/assets/branding/1.png" alt="TechClear" fill sizes="56px" className="object-cover object-center scale-[1.15]" priority loading="eager" />
            </div>
          </a>

          {/* Desktop links */}
          <div className={`hidden md:flex gap-1 text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-200`}>
            <a href="#about" onClick={scrollTo('about')} className="px-4 py-2 hover:bg-white hover:text-black transition-all duration-200">About Us</a>
            <a href="#services" onClick={scrollTo('services')} className="px-4 py-2 hover:bg-white hover:text-black transition-all duration-200">Our Solution</a>
            <a href="#bootcamp" onClick={scrollTo('bootcamp')} className="px-4 py-2 hover:bg-white hover:text-black transition-all duration-200">Flagship Program</a>
            {/* ENROLL NAV LINK — hidden, restore by removing the false && */}
            {false && <a href="#enroll" onClick={scrollTo('enroll')} className="px-4 py-2 hover:bg-white hover:text-black transition-all duration-200">Enroll</a>}
            <a href="#waitlist" onClick={scrollTo('waitlist')} className="px-4 py-2 hover:bg-white hover:text-black transition-all duration-200">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://whop.com/tech-clear/pm-ai-cohort/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:block text-[11px] font-semibold tracking-[0.15em] uppercase border border-zinc-700 px-6 py-3 hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-none`}
            >
              Enroll
            </a>
            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] p-2"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto md:hidden w-[calc(100%-2rem)] max-w-[1400px] mt-2 bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-1">
              {[
                { href: "#about", id: "about", label: "About Us" },
                { href: "#services", id: "services", label: "Our Solution" },
                { href: "#bootcamp", id: "bootcamp", label: "Flagship Program" },
                // ENROLL MOBILE NAV — hidden, restore by uncommenting:
                // { href: "#enroll", id: "enroll", label: "Enroll" },
                { href: "#waitlist", id: "waitlist", label: "Contact" },
              ].map(({ href, id, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => { scrollTo(id)(e); setMobileMenuOpen(false) }}
                  className="text-[13px] font-semibold tracking-[0.15em] uppercase text-zinc-300 hover:text-white transition-colors py-4 border-b border-white/5 last:border-0"
                >
                  {label}
                </a>
              ))}
              <a
                href="https://whop.com/tech-clear/pm-ai-cohort/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 text-center text-[11px] font-bold tracking-[0.15em] uppercase border border-white/30 px-6 py-4 text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Enroll
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-28 pb-16 md:pt-32 md:pb-20 max-w-[1400px] mx-auto border-b border-white/10 overflow-hidden">
        {/* Animated diagonal grid */}
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none">
          <motion.svg
            width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            animate={mounted ? { x: [0, 60], y: [0, 60] } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <pattern id="hero-diag-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 60" fill="none" stroke="white" strokeWidth="1" />
                <path d="M 0 0 L 60 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="200%" height="200%" fill="url(#hero-diag-grid)" />
          </motion.svg>
        </div>

        {/* Drifting gradient orbs */}
        <motion.div
          className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }}
          animate={mounted ? { x: [0, -80, 0], y: [0, 60, 0] } : {}}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
          animate={mounted ? { x: [0, 60, 0], y: [0, -40, 0] } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          className="absolute top-[50%] left-[40%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
          animate={mounted ? { x: [0, -40, 40, 0], y: [0, 30, -30, 0], scale: [1, 1.2, 0.9, 1] } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />

        <div className="max-w-5xl relative z-10 transform-style-3d">
          <motion.p
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={mounted ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-2xl font-bold tracking-[0.3em] uppercase text-white mb-6 md:mb-10 border-b-2 border-white/40 pb-3 inline-block"
          >
            IT Workforce Training
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, rotateX: 45, y: 100, scale: 0.9, filter: "blur(20px)" }}
            animate={mounted ? { opacity: 1, rotateX: 0, y: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair text-[2.6rem] sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight mb-8 md:mb-12 origin-bottom"
          >
            Build with <span className="italic text-zinc-300">intention</span>.<br />Advance the <span className="italic text-zinc-300">tech future</span>.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, rotateY: 30, x: -50, z: -100, filter: "blur(15px)" }}
            animate={mounted ? { opacity: 1, rotateY: 0, x: 0, z: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 md:mb-16 max-w-3xl p-6 md:p-10 bg-[#050505]/50 backdrop-blur-md border border-white/10 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(255,255,255,0.05)] origin-left"
          >
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

            <p className="text-xl md:text-2xl text-zinc-200 font-light leading-relaxed relative z-10">
              TechClear equips <span className="text-white font-normal">driven professionals</span> — managers, engineers, and innovators — with the <span className="text-white font-normal">skills, certifications, and mentorship</span> to create <span className="font-playfair italic text-white text-2xl md:text-3xl">impact</span> in a rapidly evolving tech landscape.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={mounted ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-start flex-wrap"
          >
            <a
              href="#bootcamp"
              onClick={scrollTo('bootcamp')}
              className="group flex items-center justify-between sm:justify-start gap-3 bg-white text-black px-7 py-4 md:px-10 md:py-5 font-bold text-[12px] md:text-[13px] tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors rounded-none"
            >
              Flagship Program
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://whop.com/tech-clear/pm-ai-cohort/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between sm:justify-start gap-3 border border-white px-7 py-4 md:px-10 md:py-5 font-bold text-[12px] md:text-[13px] tracking-[0.15em] uppercase text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none"
            >
              Enroll
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#waitlist"
              onClick={scrollTo('waitlist')}
              className="group flex items-center justify-between sm:justify-start gap-3 border border-white/40 px-7 py-4 md:px-10 md:py-5 font-bold text-[12px] md:text-[13px] tracking-[0.15em] uppercase text-zinc-400 hover:border-white hover:text-white transition-all duration-300 rounded-none"
            >
              Contact
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 md:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-l-2 border-white pl-5 md:pl-6 py-2"
          >
            <div>
              <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-zinc-400 mb-1.5">Program Launches</p>
              <p className="font-playfair text-2xl md:text-4xl text-white leading-tight">July 6, 2026</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/20" />
            <div>
              <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-zinc-400 mb-1.5">First Cohort Kickoff</p>
              <p className="font-playfair text-2xl md:text-4xl text-white leading-tight italic">In-person · Arlington, VA</p>
              <p className="text-sm md:text-base text-zinc-200 font-semibold tracking-wide mt-2">Date to be announced</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="px-6 md:px-16 py-16 md:py-32 bg-[#050505] text-white relative overflow-hidden">
        {/* Animated Hexagon Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
          <motion.svg
            width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            animate={{ x: [0, -60], y: [0, -35] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <pattern id="hex-grid" width="60" height="103.923" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z" fill="none" stroke="white" strokeWidth="1" />
                <path d="M30 103.923 L60 86.6 L60 51.96 L30 69.28 L0 51.96 L0 86.6 Z" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="200%" height="200%" fill="url(#hex-grid)" />
          </motion.svg>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 relative z-10">
          {/* About Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={mounted ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              About Us
            </span>
            <p className="text-lg font-light leading-relaxed text-zinc-300">
              Tech Clear is a leading IT startup dedicated to closing the skill gap. Discover why our industry is evolving and explore the deep challenges aspiring professionals face navigating traditional career paths today.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={mounted ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Our Mission
            </span>
            <p className="text-lg font-light leading-relaxed text-zinc-300">
              We aim to equip IT professionals with the skills to lead in an AI-driven world. Our flagship program bridges the gap between technical expertise and modern project leadership.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={mounted ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Our Vision
            </span>
            <p className="text-lg font-light leading-relaxed text-zinc-300">
              Our vision is to empower the tech-ready generation. If you share our philosophy and are ready to take the next step in advancing your career, we would love to hear from you. Get in touch with our admissions team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy / Our Solution Section */}
      <section id="services" className="px-6 md:px-16 py-20 md:py-40 bg-[#020202] border-b border-white/10 relative overflow-hidden">
        {/* Animated Blueprint Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none">
          <motion.svg
            width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            animate={mounted ? { x: [0, -40], y: [0, -40] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="200%" height="200%" fill="url(#blueprint-grid)" />
          </motion.svg>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={mounted ? { opacity: 1 } : {}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5"
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Our Solution
            </span>
            <h3 className="font-playfair text-3xl md:text-6xl leading-tight mb-8">
              The tech industry is evolving at <span className="italic">breakneck speed</span>.
            </h3>
            <div className="flex flex-col gap-6 border-t border-white/10 pt-12">
              {[
                "Traditional IT roles are being disrupted by AI, severing established career paths.",
                "Professionals struggle to bridge the gap between technical skills and leadership.",
                "Navigating the transition requires more than just self-study; it requires a community."
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={mounted ? { opacity: 1, x: 0 } : {}}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="flex gap-6 items-start group p-6 md:p-8 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/30 transition-all duration-500"
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-white/20 bg-black shrink-0 shadow-lg group-hover:border-white transition-colors duration-500">
                    <span className="font-playfair italic text-white text-xl mt-1">0{i + 1}</span>
                  </div>
                  <p className="text-zinc-200 text-lg md:text-xl font-light leading-relaxed pt-2">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* New Problem/Context Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={mounted ? { opacity: 1, scale: 1 } : {}}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-12 relative w-full h-[250px] grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out border border-white/10 group overflow-hidden"
            >
              <Image
                src="/assets/images/problem.png"
                alt="Tech Industry Evolution"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={mounted ? { opacity: 1 } : {}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-7 md:pl-16 border-t md:border-t-0 md:border-l border-white/10 pt-16 md:pt-0"
          >
            <p className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-zinc-200 mb-8 border-b border-white/20 pb-2 inline-block">What We Do</p>
            <p className="font-playfair text-2xl md:text-5xl leading-tight mb-10 md:mb-12">
              We equip the next generation of IT leaders with the <span className="italic">framework</span>, <span className="italic">community</span>, and <span className="italic">coaching</span> necessary to build the future.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Certifications", desc: "SAFe Scrum Master 6.0 and industry-recognized credentials." },
                { title: "Workshops & Events", desc: "Immersive learning experiences designed for immediate application." },
                { title: "1-on-1 Coaching", desc: "Personalized guidance from seasoned enterprise IT leaders." },
                { title: "AI Integration", desc: "Practical AI skills to elevate your project management capabilities." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
                  className="p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-white/30 transition-all duration-500 group"
                >
                  <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-white mb-4 transition-colors">
                    {item.title}
                  </h4>
                  <p className="font-light text-lg text-zinc-200 group-hover:text-zinc-200 transition-colors duration-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
            {/* Added Placeholder Image to balance the layout */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={mounted ? { opacity: 1 } : {}}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 relative w-full h-[250px] grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out border border-white/10 group overflow-hidden hidden md:block"
            >
              <Image
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                alt="Tech Collaboration"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Flagship Program Section */}
      <section id="bootcamp" className="px-6 md:px-16 py-20 md:py-40 border-b border-white/10 bg-black text-white relative overflow-hidden">
        {/* Animated Data Stream */}
        <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
          <motion.svg width="100%" height="100%" preserveAspectRatio="none">
            {[...Array(40)].map((_, i) => (
              <motion.rect
                key={`line-${i}`}
                x={`${(i * 13) % 100}%`}
                y="-20%"
                width={i % 2 === 0 ? "1" : "2"}
                height={`${20 + (i % 30)}%`}
                fill="white"
                 animate={mounted ? {
                   y: ["-20%", "120%"],
                   opacity: [0, 0.8, 0]
                 } : {}}
                transition={{
                  duration: 3 + (i % 5),
                  repeat: Infinity,
                  ease: "linear",
                  delay: (i % 10) * 0.5
                }}
              />
            ))}
          </motion.svg>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={mounted ? { opacity: 1 } : {}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5"
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Flagship Program
            </span>
            <h2 className="font-playfair text-4xl md:text-7xl mb-8 leading-tight">
              PM + AI <br /><span className="italic">Flagship Program</span>
            </h2>
            <p className="text-xl text-zinc-200 font-light mb-10 leading-relaxed">
              An intensive 8-week program combining SAFe Scrum Master 6.0 certification with hands-on AI integration — built for IT professionals ready to step into leadership.
            </p>

            {/* Program Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <div className="border border-white/15 px-5 py-4">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">Program Launches</p>
                <p className="text-white text-lg font-light">July 6, 2026</p>
              </div>
              <div className="border border-white/15 px-5 py-4">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">First Cohort Kickoff</p>
                <p className="text-white text-lg font-light">In-person · Arlington, VA</p>
              </div>
            </div>

            {/* Immersive Bootcamp Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={mounted ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full h-[300px] md:h-[400px] grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out border border-white/10 mt-8 group overflow-hidden"
            >
              <Image
                src="/assets/images/bootcamp.png"
                alt="Flagship Program Professional Environment"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000" />
            </motion.div>
          </motion.div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 md:pl-16 md:border-l border-white/10 content-start">
            {[
              { title: "8-Week Curriculum", desc: "A rigorous, phased approach covering both agile methodologies and AI." },
              { title: "SAFe SSM 6.0", desc: "Gain the globally recognized SAFe Scrum Master certification." },
              { title: "Flexible Delivery", desc: "Available virtually, in-person, or via 1-on-1 coaching." },
              { title: "Career Growth", desc: "Position yourself at the forefront of the AI-driven tech economy." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={mounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-[#0a0a0a] p-8 md:p-10 border border-white/10 hover:border-white/30 transition-all duration-300 group rounded-none h-fit cursor-none"
              >
                <h3 className="text-[12px] font-bold tracking-[0.15em] uppercase mb-4 text-white group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-zinc-200 group-hover:text-zinc-100 font-light text-lg leading-relaxed transition-colors">{item.desc}</p>
              </motion.div>
            ))}
            {/* Added Placeholder Image to balance the layout */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={mounted ? { opacity: 1 } : {}}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="col-span-1 sm:col-span-2 relative w-full h-[200px] mt-2 grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out border border-white/10 group overflow-hidden hidden md:block"
            >
              <Image
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                alt="Tech Layout Filling Space"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ENROLL SECTION — change false to true to restore */}
      {false && <section id="enroll" className="px-6 md:px-16 py-20 md:py-40 bg-[#050505] text-white border-b border-white/10 relative overflow-hidden">
        {/* Animated diagonal grid */}
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none">
          <motion.svg
            width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            animate={mounted ? { x: [0, 60], y: [0, 60] } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <pattern id="diag-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 60" fill="none" stroke="white" strokeWidth="1" />
                <path d="M 0 0 L 60 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="200%" height="200%" fill="url(#diag-grid)" />
          </motion.svg>
        </div>

        {/* Drifting gradient orbs */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
          animate={mounted ? { x: [0, 80, 0], y: [0, 40, 0] } : {}}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }}
          animate={mounted ? { x: [0, -60, 0], y: [0, -50, 0] } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
          animate={mounted ? { x: [0, 40, -40, 0], y: [0, -30, 30, 0], scale: [1, 1.2, 0.9, 1] } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={mounted ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Enrollment
            </span>
            <h2 className="font-playfair text-4xl md:text-7xl leading-tight">
              Ready to <span className="italic">enroll?</span>
            </h2>
          </motion.div>

          {/* Pricing card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={mounted ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="border border-white/20 bg-white/[0.02] p-10 md:p-16 hover:border-white/40 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden mb-12"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
              <div>
                <p className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">PM + AI Flagship Program</p>
                <h3 className="font-playfair text-4xl md:text-6xl text-white leading-tight mb-4">
                  8 weeks.<br /><span className="italic">One decision.</span>
                </h3>
                <p className="text-zinc-400 text-lg font-light mb-3">Enroll to view pricing and secure your spot.</p>
                <p className="text-zinc-500 text-sm font-light">Program launches July 6, 2026 · In-person portion in Arlington, VA</p>
              </div>
              <ul className="space-y-4 md:max-w-xs">
                {["Full 8-week program access", "SAFe SSM 6.0 certification included", "1-on-1 coaching sessions", "Priority support"].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-zinc-300 font-light">
                    <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-bold text-[12px] tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors group/btn rounded-none"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-200"
          >
            Secure payment. All major cards accepted.
          </motion.p>
        </div>
      </section>}

      {/* QR Code — Early Access — hidden for now, restore by uncommenting:
      <section className="px-6 md:px-16 py-20 md:py-32 bg-[#020202] border-b border-white/10 text-white">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24">
          <div className="flex-1">
            <span className="inline-block border border-white/30 text-sm font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">Early Access</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Join the Waitlist<br />
              <span className="italic">Instantly</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-sm">
              Scan the code with your phone to secure your spot in the PM + AI Flagship Program.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="p-5 bg-white" style={{ lineHeight: 0 }}>
              <QRCodeSVG
                value="https://www.techclear.org/#waitlist"
                size={180}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
              />
            </div>
            <p className="text-white text-sm font-semibold tracking-widest uppercase text-center">
              techclear.org/#waitlist
            </p>
          </div>
        </div>
      </section>
      */}

      {/* Waitlist / CTA Section */}
      <section id="waitlist" className="px-6 md:px-16 py-20 md:py-40 bg-black text-white relative overflow-hidden">
        {/* Expanding Radar Rings */}
        <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none flex items-center justify-center overflow-hidden">
          <motion.svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={`ring-${i}`}
                cx="400"
                cy="400"
                r="0"
                stroke="white"
                strokeWidth="1"
                 animate={mounted ? {
                   r: [0, 800],
                   opacity: [0.8, 0]
                 } : {}}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 2
                }}
              />
            ))}
          </motion.svg>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative z-10">
          <div>
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Contact
            </span>
            <h2 className="font-playfair text-4xl md:text-7xl mb-6 md:mb-8">
              If you need support, <span className="italic">contact us</span>.
            </h2>
            <p className="text-lg md:text-2xl text-zinc-400 font-light mb-10 md:mb-12 max-w-lg leading-relaxed">
              Questions about the PM + AI Flagship Program, enrollment, or anything else? Send us a message and our team will get back to you shortly.
            </p>

            {/* QR CODE — hidden for now, restore by uncommenting:
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white shrink-0" style={{ lineHeight: 0 }}>
                <QRCodeSVG
                  value="https://www.techclear.org/#waitlist"
                  size={100}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              </div>
              <p className="text-white text-sm font-semibold tracking-widest uppercase leading-relaxed">
                Scan to join<br />the waitlist
              </p>
            </div>
            */}
          </div>

          <div>
            {formState === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="p-10 md:p-12 border border-white/20 bg-white/[0.02] flex flex-col gap-6"
              >
                <div className="w-14 h-14 border border-white/30 flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-3">Message received</p>
                  <h3 className="font-playfair text-3xl md:text-4xl text-white mb-4 italic">Thank you, {firstName}.</h3>
                  <p className="text-zinc-400 font-light text-lg leading-relaxed">
                    We&apos;ve received your message. Our team will be in touch shortly.
                  </p>
                </div>
                <button
                  onClick={() => { setFormState("idle"); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setInterest(""); setMessage(""); }}
                  className="text-[11px] font-bold tracking-[0.15em] uppercase border border-white/20 px-6 py-3 text-zinc-400 hover:border-white hover:text-white transition-all duration-300 w-fit"
                >
                  Submit another response
                </button>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleWaitlistSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-firstname">First Name</label>
                    <input
                      type="text"
                      id="wl-firstname"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent font-light text-lg rounded-none text-white cursor-none"
                      required
                      disabled={formState === "loading"}
                    />
                  </div>
                  <div>
                    <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-lastname">Last Name</label>
                    <input
                      type="text"
                      id="wl-lastname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent font-light text-lg rounded-none text-white cursor-none"
                      disabled={formState === "loading"}
                    />
                  </div>
                </div>
                <div>
                  <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-email">Email Address</label>
                  <input
                    type="email"
                    id="wl-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent font-light text-lg rounded-none text-white cursor-none"
                    required
                    disabled={formState === "loading"}
                  />
                </div>
                <div>
                  <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="wl-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent font-light text-lg rounded-none text-white cursor-none"
                    disabled={formState === "loading"}
                  />
                </div>
                <div className="relative">
                  <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-interest">Area of Interest</label>
                  <select
                    id="wl-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-black text-white appearance-none font-light text-lg rounded-none cursor-none"
                    required
                    disabled={formState === "loading"}
                  >
                    <option value="" disabled className="text-zinc-500">Select Area of Interest</option>
                    <option value="bootcamp">PM + AI Flagship Program</option>
                    <option value="enrollment">Enrollment Question</option>
                    <option value="pricing">Pricing & Payment</option>
                    <option value="cohort">Cohort Schedule / In-person Kickoff</option>
                    <option value="curriculum">Curriculum & Certification</option>
                    <option value="partnership">Partnership / Corporate Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-6 top-[55%] pointer-events-none text-zinc-400">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-message">How can we help? <span className="text-zinc-400 text-[10px] tracking-[0.2em] font-bold ml-1">(OPTIONAL)</span></label>
                  <textarea
                    id="wl-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Tell us what you're looking for — a question about the program, pricing, the in-person kickoff, a partnership, or anything else..."
                    className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent font-light text-lg rounded-none text-white cursor-none resize-y placeholder:text-zinc-300 placeholder:font-light"
                    disabled={formState === "loading"}
                  />
                </div>
                {formState === "error" && (
                  <p className="text-sm text-red-400 font-light border border-red-400/30 px-5 py-4 bg-red-400/5">
                    {errorMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className="w-full bg-white text-black px-8 py-6 font-bold text-[13px] tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors mt-4 flex justify-between items-center group rounded-none cursor-none disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{formState === "loading" ? "Submitting..." : "Send Message"}</span>
                  {formState !== "loading" && (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-10 md:py-16 bg-black border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <div className="relative w-12 h-12 md:w-14 md:h-14 overflow-hidden">
              <Image src="/assets/branding/1.png" alt="TechClear" fill sizes="56px" className="object-cover object-center scale-[1.15]" />
            </div>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white">© 2026 TechClear. Built for the world.</p>
        </div>
        <div className="flex flex-col gap-6">
          <nav aria-label="Footer navigation" className="flex flex-row flex-wrap gap-x-8 gap-y-4 md:gap-16 text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-400">
            <a href="#about" onClick={scrollTo('about')} className="hover:text-white transition-colors">About Us</a>
            <a href="#services" onClick={scrollTo('services')} className="hover:text-white transition-colors">Our Solution</a>
            <a href="#bootcamp" onClick={scrollTo('bootcamp')} className="hover:text-white transition-colors">Flagship Program</a>
            {/* ENROLL FOOTER LINK — hidden, restore by removing the false && */}
            {false && <a href="#enroll" onClick={scrollTo('enroll')} className="hover:text-white transition-colors">Enroll</a>}
            <a href="#waitlist" onClick={scrollTo('waitlist')} className="hover:text-white transition-colors">Contact</a>
          </nav>
          <a
            href="https://www.instagram.com/techclear.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors w-fit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase">@Techclear.co</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
