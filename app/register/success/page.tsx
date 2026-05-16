"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EnrollmentSuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans flex items-center justify-center px-8">
      {/* Subtle radar ring background */}
      <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.svg
          width="800"
          height="800"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[...Array(4)].map((_, i) => (
            <motion.circle
              key={`ring-${i}`}
              cx="400"
              cy="400"
              r="0"
              stroke="white"
              strokeWidth="1"
              animate={{ r: [0, 700], opacity: [0.6, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 2.5,
              }}
            />
          ))}
        </motion.svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Check icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mb-12"
        >
          <div className="w-20 h-20 border border-white/30 flex items-center justify-center bg-white/[0.03] rotate-45">
            <div className="-rotate-45">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 17l7 7L26 9"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block border border-white/30 text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 text-zinc-300">
            Confirmed
          </span>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4 text-white">
            You&apos;re enrolled.
          </h1>

          <h2 className="font-playfair italic text-3xl md:text-4xl text-zinc-300 mb-8">
            Welcome to PM + AI Flagship Program.
          </h2>

          <p className="text-zinc-400 font-light text-xl leading-relaxed mb-14 max-w-xl mx-auto">
            Your payment was confirmed and a receipt has been sent to your email. We&apos;ll be in touch shortly with next steps.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-bold text-[13px] tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors rounded-none"
          >
            Back to TechClear
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
