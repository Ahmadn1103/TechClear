"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const COHORT_OPTIONS = [
  { value: "cohort-1", label: "Cohort 1 — Q3 2026 (Virtual)" },
  { value: "cohort-2", label: "Cohort 2 — Q4 2026 (In-Person)" },
  { value: "cohort-3", label: "Cohort 3 — Q1 2027 (Virtual)" },
  { value: "coaching", label: "1-on-1 Coaching (Flexible)" },
];

const PLAN_OPTIONS = [
  {
    value: "full",
    label: "Full Payment",
    price: "$3,000",
    note: "One-time payment. No installments.",
  },
];

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function RegisterForm() {
  const searchParams = useSearchParams();

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cohort, setCohort] = useState("");
  const [plan] = useState<"full">("full");

  // UI state
  const [formState, setFormState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Keep searchParams in scope for future use
  void searchParams;

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "First name is required.";
    if (!lastName.trim()) errors.lastName = "Last name is required.";
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!phone.trim()) errors.phone = "Phone number is required.";
    if (!cohort) errors.cohort = "Please select a cohort.";
    return errors;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setFormState("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, cohort, plan }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: unknown) {
      setFormState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const inputClass =
    "w-full px-6 py-5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-transparent transition-all font-light text-lg rounded-none text-white cursor-none placeholder:text-zinc-600";
  const inputErrorClass =
    "w-full px-6 py-5 border border-red-400/60 focus:outline-none focus:ring-1 focus:ring-red-400 bg-transparent transition-all font-light text-lg rounded-none text-white cursor-none placeholder:text-zinc-600";
  const labelClass = "text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-3 block";

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* ── Minimal Header ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto flex justify-between items-center mt-4 w-[calc(100%-2rem)] max-w-[1400px] px-6 md:px-8 py-3 rounded-2xl border bg-[#050505]/90 backdrop-blur-xl border-white/10 shadow-2xl">
          <Link href="/" className="flex items-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/assets/branding/1.png"
                alt="TechClear"
                fill
                sizes="80px"
                priority
                loading="eager"
                className="object-contain object-left"
              />
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to TechClear
          </Link>
        </nav>
      </header>

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <div className="pt-40 pb-32 px-8 md:px-16">
        <div className="max-w-2xl mx-auto">

          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <span className="inline-block border border-white/30 text-sm font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-200">
              Enrollment
            </span>
            <h1 className="font-playfair text-5xl md:text-6xl leading-tight mb-4">
              Secure your <span className="italic">seat.</span>
            </h1>
            <p className="text-zinc-400 font-light text-lg leading-relaxed">
              Complete the form below to enroll in the PM + AI Flagship Program. You&apos;ll be redirected to a secure Stripe checkout to complete your payment.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass} htmlFor="reg-firstName">First Name</label>
                <input
                  type="text"
                  id="reg-firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={fieldErrors.firstName ? inputErrorClass : inputClass}
                  disabled={formState === "loading"}
                  autoComplete="given-name"
                />
                {fieldErrors.firstName && (
                  <p className="mt-2 text-[11px] text-red-400">{fieldErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className={labelClass} htmlFor="reg-lastName">Last Name</label>
                <input
                  type="text"
                  id="reg-lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={fieldErrors.lastName ? inputErrorClass : inputClass}
                  disabled={formState === "loading"}
                  autoComplete="family-name"
                />
                {fieldErrors.lastName && (
                  <p className="mt-2 text-[11px] text-red-400">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass} htmlFor="reg-email">Email Address</label>
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldErrors.email ? inputErrorClass : inputClass}
                disabled={formState === "loading"}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="mt-2 text-[11px] text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass} htmlFor="reg-phone">Phone Number</label>
              <input
                type="tel"
                id="reg-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldErrors.phone ? inputErrorClass : inputClass}
                disabled={formState === "loading"}
                autoComplete="tel"
              />
              {fieldErrors.phone && (
                <p className="mt-2 text-[11px] text-red-400">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Cohort selection */}
            <div className="relative">
              <label className={labelClass} htmlFor="reg-cohort">Cohort Selection</label>
              <select
                id="reg-cohort"
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                className={`${fieldErrors.cohort ? inputErrorClass : inputClass} bg-black appearance-none`}
                disabled={formState === "loading"}
                required
              >
                <option value="" disabled className="text-zinc-500 bg-black">Select a cohort</option>
                {COHORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-black text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-[58%] pointer-events-none text-zinc-400">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {fieldErrors.cohort && (
                <p className="mt-2 text-[11px] text-red-400">{fieldErrors.cohort}</p>
              )}
            </div>

            {/* Payment plan — single card */}
            <div>
              <p className={labelClass}>Payment</p>
              <div className="p-6 border border-white bg-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                    {PLAN_OPTIONS[0].label}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-white border-white border" />
                </div>
                <p className="font-playfair text-2xl text-white mb-1">{PLAN_OPTIONS[0].price}</p>
                <p className="text-zinc-500 text-xs font-light">{PLAN_OPTIONS[0].note}</p>
              </div>
            </div>

            {/* Global error */}
            {formState === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 font-light border border-red-400/30 px-5 py-4 bg-red-400/5"
              >
                {errorMessage}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formState === "loading"}
              className="w-full bg-white text-black px-8 py-6 font-bold text-[13px] tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors flex justify-between items-center group rounded-none cursor-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{formState === "loading" ? "Processing..." : "Proceed to Checkout"}</span>
              {formState === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>

            {/* Stripe note */}
            <p className="text-center text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-600">
              Secure checkout powered by Stripe. All major cards accepted.
            </p>
          </motion.form>
        </div>
      </div>
    </main>
  );
}

// ─── Page export (wraps with Suspense for useSearchParams) ────────────────────

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
