"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Custom Cursor Component
const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Hide custom cursor on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Ambient Glow / Flashlight Effect */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[9000] hidden md:block mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)"
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      />

      {/* Center Sharp Dot (Diamond) */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: 45
        }}
        animate={{
          scale: isHovered ? 6 : 1,
          opacity: 1
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* Trailing Hollow Diamond */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-white pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center bg-transparent hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          rotate: isHovered ? 90 : 45,
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  );
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Waitlist form state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, phone, interest }),
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
      <CustomCursor />
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-center pointer-events-none">
        <nav 
          className={`pointer-events-auto transition-all duration-1000 ease-in-out flex justify-between items-center mt-4 w-[calc(100%-2rem)] max-w-[1400px] px-6 md:px-8 py-3 rounded-2xl border ${
            isScrolled 
              ? "bg-[#050505]/90 backdrop-blur-xl border-white/10 shadow-2xl" 
              : "bg-transparent backdrop-blur-none border-transparent shadow-none"
          }`}
        >
          <Link href="#hero" className="flex items-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image src="/assets/branding/1.png" alt="TechClear" fill sizes="80px" className="object-contain object-left" priority loading="eager" />
            </div>
          </Link>
          <div className="hidden md:flex gap-8 text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-200">
            <Link href="#about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="#services" className="hover:text-white transition-colors">The Problem</Link>
            <Link href="#bootcamp" className="hover:text-white transition-colors">Flagship Program</Link>
            <Link href="#enroll" className="hover:text-white transition-colors">Enroll</Link>
            <Link href="#waitlist" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <Link 
            href="#waitlist" 
            className="text-[11px] font-semibold tracking-[0.15em] uppercase border border-zinc-700 px-6 py-3 hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-none"
          >
            Join Waitlist
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 pt-32 pb-20 max-w-[1400px] mx-auto border-b border-white/10 overflow-hidden">
        {/* Animated diagonal grid */}
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none">
          <motion.svg
            width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            animate={{ x: [0, 60], y: [0, 60] }}
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
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          className="absolute top-[50%] left-[40%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
          animate={{ x: [0, -40, 40, 0], y: [0, 30, -30, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />

        <div className="max-w-5xl relative z-10 transform-style-3d">
          <motion.p 
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl font-bold tracking-[0.3em] uppercase text-white mb-10 border-b-2 border-white/40 pb-3 inline-block"
          >
            IT Workforce Training
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, rotateX: 45, y: 100, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair text-6xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight mb-12 origin-bottom"
          >
            Build with <span className="italic text-zinc-300">intention</span>.<br />Advance the <span className="italic text-zinc-300">tech future</span>.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, rotateY: 30, x: -50, z: -100, filter: "blur(15px)" }}
            animate={{ opacity: 1, rotateY: 0, x: 0, z: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 max-w-3xl p-8 md:p-10 bg-[#050505]/50 backdrop-blur-md border border-white/10 relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(255,255,255,0.05)] origin-left"
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
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6 items-start flex-wrap"
          >
            <Link
              href="#bootcamp"
              className="group flex items-center gap-3 bg-white text-black px-10 py-5 font-bold text-[13px] tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors rounded-none"
            >
              Flagship Program
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#enroll"
              className="group flex items-center gap-3 border border-white px-10 py-5 font-bold text-[13px] tracking-[0.15em] uppercase text-white hover:bg-white hover:text-black transition-all duration-300 rounded-none"
            >
              Enroll
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#waitlist"
              className="group flex items-center gap-3 border border-white/40 px-10 py-5 font-bold text-[13px] tracking-[0.15em] uppercase text-zinc-400 hover:border-white hover:text-white transition-all duration-300 rounded-none"
            >
              Contact
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="px-8 md:px-16 py-32 bg-[#050505] text-white relative overflow-hidden">
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

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
          {/* About Us */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              About Us
            </span>
            <p className="text-lg font-light leading-relaxed mb-8 text-zinc-300">
              Tech Clear is a leading IT startup dedicated to closing the skill gap. Discover why our industry is evolving and explore the deep challenges aspiring professionals face navigating traditional career paths today.
            </p>
            <Link href="#services" className="font-bold uppercase tracking-widest text-xs border border-white px-6 py-3 hover:bg-white hover:text-black transition-all cursor-none inline-block">
              The Problem
            </Link>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Our Mission
            </span>
            <p className="text-lg font-light leading-relaxed mb-8 text-zinc-300">
              We aim to equip our students with the skills to excel in Agile management. Explore our rigorous flagship program, designed specifically to integrate SAFe principles with cutting-edge AI tools to shape indispensable leaders.
            </p>
            <Link href="#bootcamp" className="font-bold uppercase tracking-widest text-xs border border-white px-6 py-3 hover:bg-white hover:text-black transition-all cursor-none inline-block">
              Flagship Program
            </Link>
          </motion.div>

          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Our Vision
            </span>
            <p className="text-lg font-light leading-relaxed mb-8 text-zinc-300">
              Our vision is to empower the tech-ready generation. If you share our philosophy and are ready to take the next step in advancing your career, we would love to hear from you. Get in touch with our admissions team.
            </p>
            <Link href="#waitlist" className="font-bold uppercase tracking-widest text-xs border border-white px-6 py-3 hover:bg-white hover:text-black transition-all cursor-none inline-block">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy / The Problem Section */}
      <section id="services" className="px-8 md:px-16 py-40 bg-[#020202] border-b border-white/10 relative overflow-hidden">
        {/* Animated Blueprint Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none">
          <motion.svg 
            width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            animate={{ x: [0, -40], y: [0, -40] }}
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
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5"
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              The Problem
            </span>
            <h3 className="font-playfair text-4xl md:text-6xl leading-tight mb-8">
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
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="flex gap-6 items-start group p-6 md:p-8 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/30 transition-all duration-500"
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-white/20 bg-black shrink-0 shadow-lg group-hover:border-white transition-colors duration-500">
                    <span className="font-playfair italic text-white text-xl mt-1">0{i+1}</span>
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
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
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
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-7 md:pl-16 border-t md:border-t-0 md:border-l border-white/10 pt-16 md:pt-0"
          >
            <p className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-zinc-200 mb-8 border-b border-white/20 pb-2 inline-block">What We Do</p>
            <p className="font-playfair text-3xl md:text-5xl leading-tight mb-12">
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
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
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
      <section id="bootcamp" className="px-8 md:px-16 py-40 border-b border-white/10 bg-black text-white relative overflow-hidden">
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
                animate={{
                  y: ["-20%", "120%"],
                  opacity: [0, 0.8, 0]
                }}
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
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5"
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Flagship Program
            </span>
            <h2 className="font-playfair text-5xl md:text-7xl mb-8 leading-tight">
              PM + AI <br /><span className="italic">Flagship Program</span>
            </h2>
            <p className="text-xl text-zinc-200 font-light mb-12 leading-relaxed">
              An intensive 8-week program combining SAFe Scrum Master 6.0 principles with cutting-edge AI tools to make you an indispensable IT leader.
            </p>
            
            {/* Immersive Bootcamp Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
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
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
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

      {/* Enroll & Pay Section */}
      <section id="enroll" className="px-8 md:px-16 py-40 bg-[#050505] text-white border-b border-white/10 relative overflow-hidden">
        {/* Animated diagonal grid */}
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none">
          <motion.svg
            width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            animate={{ x: [0, 60], y: [0, 60] }}
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
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }}
          animate={{ x: [0, -60, 0], y: [0, -50, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
          animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Enrollment
            </span>
            <h2 className="font-playfair text-5xl md:text-7xl leading-tight">
              Ready to <span className="italic">enroll?</span>
            </h2>
          </motion.div>

          {/* Pricing card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="border border-white/20 bg-white/[0.02] p-10 md:p-16 hover:border-white/40 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden mb-12"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-6 block">One-Time Payment</span>
                <p className="font-playfair text-6xl md:text-8xl text-white mb-3 leading-none">$3,000</p>
                <p className="text-zinc-200 text-lg md:text-xl font-semibold tracking-wide mt-2">Full access. No installments. No hidden fees.</p>
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
                href="#waitlist"
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
      </section>

      {/* Waitlist / CTA Section */}
      <section id="waitlist" className="px-8 md:px-16 py-40 bg-black text-white relative overflow-hidden">
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
                animate={{
                  r: [0, 800],
                  opacity: [0.8, 0]
                }}
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
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block border border-white/30 text-sm md:text-base font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Contact
            </span>
            <h2 className="font-playfair text-5xl md:text-7xl mb-8">
              Request <span className="italic">early access</span>.
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 font-light mb-12 max-w-lg leading-relaxed">
              We exist for the driven professionals who believe a better career path is possible. Join the waitlist for our upcoming Flagship Program.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {formState === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="p-10 md:p-12 border border-white/20 bg-white/[0.02] flex flex-col gap-6"
              >
                <div className="w-14 h-14 border border-white/30 flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-3">You&apos;re on the list</p>
                  <h3 className="font-playfair text-3xl md:text-4xl text-white mb-4 italic">Thank you, {firstName}.</h3>
                  <p className="text-zinc-400 font-light text-lg leading-relaxed">
                    We&apos;ve received your request for early access. We&apos;ll be in touch shortly with next steps.
                  </p>
                </div>
                <button
                  onClick={() => { setFormState("idle"); setFirstName(""); setEmail(""); setPhone(""); setInterest(""); }}
                  className="text-[11px] font-bold tracking-[0.15em] uppercase border border-white/20 px-6 py-3 text-zinc-400 hover:border-white hover:text-white transition-all duration-300 w-fit"
                >
                  Submit another response
                </button>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleWaitlistSubmit}>
                <div>
                  <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-name">First Name</label>
                  <input
                    type="text"
                    id="wl-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent transition-all font-light text-lg rounded-none text-white cursor-none"
                    required
                    disabled={formState === "loading"}
                  />
                </div>
                <div>
                  <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-email">Email Address</label>
                  <input
                    type="email"
                    id="wl-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent transition-all font-light text-lg rounded-none text-white cursor-none"
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
                    className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent transition-all font-light text-lg rounded-none text-white cursor-none"
                    disabled={formState === "loading"}
                  />
                </div>
                <div className="relative">
                  <label className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 mb-3 text-zinc-300" htmlFor="wl-interest">Area of Interest</label>
                  <select
                    id="wl-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-black text-white transition-all appearance-none font-light text-lg rounded-none cursor-none"
                    required
                    disabled={formState === "loading"}
                  >
                    <option value="" disabled className="text-zinc-500">Select Area of Interest</option>
                    <option value="bootcamp">PM + AI Flagship Program</option>
                    <option value="general">General Updates</option>
                  </select>
                  <div className="absolute right-6 top-[55%] pointer-events-none text-zinc-400">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
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
                  <span>{formState === "loading" ? "Submitting..." : "Join Waitlist"}</span>
                  {formState !== "loading" && (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-16 bg-black border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image src="/assets/branding/1.png" alt="TechClear" fill sizes="80px" className="object-contain object-left" />
            </div>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white">© 2026 TechClear. Built for the world.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-col md:flex-row gap-8 md:gap-16 text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-400">
          <Link href="#about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="#services" className="hover:text-white transition-colors">The Problem</Link>
          <Link href="#bootcamp" className="hover:text-white transition-colors">Flagship Program</Link>
          <Link href="#enroll" className="hover:text-white transition-colors">Enroll</Link>
          <Link href="#waitlist" className="hover:text-white transition-colors">Contact</Link>
        </nav>
      </footer>
    </main>
  );
}
