import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const PAYMENT_LINK = 'https://buy.stripe.com/6oU14mgs2bIogALaim7wA01'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 cursor-auto">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-white/70 text-sm tracking-widest uppercase mb-16 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to TechClear
        </Link>

        <p className="text-sm tracking-[0.2em] uppercase text-white mb-4">Enrollment</p>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
          PM + AI Flagship<br />
          <span className="italic">Program</span>
        </h1>

        <div className="border border-white/10 p-6 mb-8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Program</span>
            <span>PM + AI Flagship Program</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Duration</span>
            <span>8 Weeks</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Includes</span>
            <span>SAFe Scrum Master 6.0 Certification</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>$3,000</span>
          </div>
        </div>

        <a
          href={PAYMENT_LINK}
          className="w-full inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-5 font-bold text-[12px] tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors"
        >
          Pay $3,000 — Secure Checkout
          <ArrowRight className="w-4 h-4" />
        </a>

        <p className="text-white/60 text-sm text-center mt-4">
          Powered by Stripe · SSL encrypted
        </p>
      </div>
    </main>
  )
}
