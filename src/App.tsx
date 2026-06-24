import './index.css'
import { useState, useEffect, useRef } from 'react'
import * as Fathom from 'fathom-client'

const DEFAULT_CTA_URL = 'https://ship.samcart.com/products/self-publishing-studio-live'

// Cart closes at midnight ET the night before Session 1 (June 1, 2026)
const CART_CLOSE_DATE = new Date('2026-06-01T03:59:00Z')

const trackCTA = (location: string) => Fathom.trackEvent(`CTA: ${location}`)

/* ─── Signature navy surface gradients ─── */
const GRAD_NAVY_HERO = 'linear-gradient(118deg, #050f26 0%, #0a1c46 54%, #0c2152 100%)'
const GRAD_NAVY_BANNER = 'linear-gradient(112deg, #06112a 0%, #0a1c46 56%, #0c2152 100%)'
const GRAD_CHIP = 'linear-gradient(135deg, #e8458a, #f6831f)'

/* Per-module two-stop gradient families (icon tiles, accents) */
const MODULE_GRADS = [
  'linear-gradient(140deg, #e23b4e, #18a86b)', // 1 · Niche Positioning
  'linear-gradient(140deg, #2456e6, #7a36e0)', // 2 · Content Strategy
  'linear-gradient(140deg, #8a3ce0, #e8458a)', // 3 · Content Formats
  'linear-gradient(140deg, #2f6fe8, #f6a01f)', // 4 · Grow Your List
  'linear-gradient(140deg, #e8458a, #f6b01f)', // 5 · Get Paid To Write
  'linear-gradient(140deg, #16a0d2, #2f6fe8)', // 6 · Profile Secrets
]

/* ─── Decorative: color bloom (soft radial bleeding off the edge) ─── */
function Bloom({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className="bloom"
      style={{ width: size, height: size, background: `radial-gradient(circle, ${color} 0%, transparent 62%)`, ...style }}
    />
  )
}

/* ─── Decorative: signature starburst lens flare (glowing core + crossed beams) ─── */
function Flare({ scale = 1, style }: { scale?: number; style?: React.CSSProperties }) {
  return (
    <div aria-hidden="true" className="absolute pointer-events-none" style={style}>
      <div
        className="bloom"
        style={{
          left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 480 * scale, height: 480 * scale,
          background: 'radial-gradient(circle, rgba(180,214,255,0.5) 0%, rgba(180,214,255,0) 60%)',
          filter: 'blur(8px)',
        }}
      />
      <div className="beam-h" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 620 * scale }} />
      <div className="beam-v" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', height: 560 * scale }} />
    </div>
  )
}

/* ─── Decorative: vignette to darken edges + focus content ─── */
function Vignette({ at = '16% 50%' }: { at?: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(130% 150% at ${at}, transparent 38%, rgba(2,6,18,0.6))` }}
    />
  )
}

/* ─── LinkedIn AI four-point spark glyph ─── */
function Spark({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path fill="currentColor" d="M12 2 C12.6 7.5 16.5 11.4 22 12 C16.5 12.6 12.6 16.5 12 22 C11.4 16.5 7.5 12.6 2 12 C7.5 11.4 11.4 7.5 12 2 Z" />
    </svg>
  )
}

/* ─── Fade-up on scroll ─── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      opacity: visible ? 1 : 0,
      transition: `transform 420ms cubic-bezier(0.16, 0.84, 0.36, 1) ${delay}ms, opacity 420ms ease ${delay}ms`,
    }}>{children}</div>
  )
}

/* ─── Eyebrow / kicker (Space Mono, uppercase, wide tracking, accent) ─── */
function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[12px] md:text-[13px] font-bold uppercase tracking-caps text-butter-500 ${className}`}>
      {children}
    </p>
  )
}

/* ─── Display headline (Barlow Semi Condensed Black, all-caps, tight) ─── */
function Display({
  children,
  size = 'l',
  className = '',
  style,
  as: Tag = 'h2',
}: {
  children: React.ReactNode
  size?: 'xl' | 'l' | 'm' | 's'
  className?: string
  style?: React.CSSProperties
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'
}) {
  const sizeClass = {
    xl: 'text-[clamp(64px,11vw,168px)]',
    l: 'text-[clamp(48px,8vw,112px)]',
    m: 'text-[clamp(40px,6vw,80px)]',
    s: 'text-[clamp(28px,4vw,48px)]',
  }[size]
  return (
    <Tag className={`font-display font-bold leading-display tracking-display [text-wrap:balance] ${sizeClass} ${className}`} style={style}>
      {children}
    </Tag>
  )
}

/* ─── Primary CTA (butter, hard cast shadow) ─── */
function PrimaryCTA({
  children,
  href = DEFAULT_CTA_URL,
  big,
  className = '',
  onRef,
  track,
}: {
  children: React.ReactNode
  href?: string
  big?: boolean
  className?: string
  onRef?: React.Ref<HTMLAnchorElement>
  track?: string
}) {
  return (
    <a
      ref={onRef}
      href={href}
      onClick={() => track && trackCTA(track)}
      className={`btn-grad inline-block font-mono font-bold uppercase text-white rounded-full ${
        big
          ? 'px-9 py-5 text-[15px] tracking-[0.04em]'
          : 'px-6 py-3.5 text-[13px] tracking-[0.04em]'
      } ${className}`}
    >
      {children}
    </a>
  )
}

/* ─── Countdown Timer ─── */
function CountdownTimer({ targetDate, compact, onLight }: { targetDate: Date; compact?: boolean; onLight?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = targetDate.getTime() - new Date().getTime()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    setTimeLeft(calc())
    const id = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (compact) {
    return (
      <span className="font-mono text-[13px] text-ink-300 tabular-nums">
        {String(timeLeft.days).padStart(2, '0')}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  return (
    <div className="inline-flex gap-3">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className="font-display font-bold text-[28px] leading-none rounded-[10px] px-3 py-2 min-w-[52px] text-center tabular-nums bg-ink-800 border border-ink-700 text-white">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className={`font-sans text-[10px] font-bold uppercase tracking-caps mt-1.5 ${onLight ? 'text-ink-900/60' : 'text-ink-300'}`}>{u.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   HERO — Two-tone headline left, overlapping captain circles right
   Designed to fit within one viewport at 1366×768, 1440×900, 1920×1080.
   ═══════════════════════════════════════════════════════════ */
function Hero({ ctaRef }: { ctaRef: React.RefObject<HTMLAnchorElement | null> }) {
  return (
    <section id="top" className="relative overflow-hidden flex flex-col min-h-screen" style={{ background: GRAD_NAVY_HERO }}>
      {/* Signature decoration — colorful blooms + starburst flare + vignette */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <Bloom color="rgba(232,69,138,0.45)" size={760} style={{ right: '-180px', top: '-260px' }} />
        <Bloom color="rgba(246,131,31,0.40)" size={560} style={{ right: '60px', top: '40px' }} />
        <Bloom color="rgba(47,143,255,0.42)" size={620} style={{ right: '-80px', top: '220px' }} />
        <Bloom color="rgba(122,54,224,0.30)" size={560} style={{ left: '-220px', top: '-160px' }} />
        <Vignette at="14% 46%" />
        <Flare scale={0.9} style={{ right: '120px', top: '180px', width: 1, height: 1 }} />
      </div>

      {/* Top announcement pill */}
      <div className="relative flex justify-center pt-5 md:pt-6 pb-1 px-3 flex-shrink-0 z-10">
        <div className="inline-flex items-center gap-2 border border-ink-700 rounded-full px-4 md:px-5 py-1.5 bg-ink-900/50 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: GRAD_CHIP }} />
          <span className="font-sans text-[10px] md:text-[11px] text-paper-200 uppercase tracking-caps whitespace-nowrap">
            Live Bootcamp Begins Monday, June 1, 2026
          </span>
        </div>
      </div>

      {/* Main content — fills remaining viewport */}
      <div className="relative flex-1 flex items-center w-full z-10">
        <div className="max-w-container mx-auto w-full px-5 md:px-8 py-6 md:py-8 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Left — eyebrow + headline + subhead + CTA + countdown */}
          <div className="max-w-[680px] mx-auto lg:mx-0 text-center lg:text-left">
            <p className="font-mono font-bold uppercase tracking-caps text-butter-500 mb-4 md:mb-5" style={{ fontSize: 'clamp(11px, 0.95vw, 14px)' }}>
              Self-Publishing Studio LIVE
            </p>
            <h1
              className="font-display font-bold text-white tracking-display [text-wrap:balance] mb-5"
              style={{ fontSize: 'clamp(40px, 4.8vw, 72px)', lineHeight: 0.98 }}
            >
              How To Write Your<br />
              First (Or Next)<br />
              <span className="grad-text">Non-Fiction Book</span><br />
              In 14 Days
            </h1>
            <p
              className="font-serif text-paper-200 mb-6 max-w-[560px] mx-auto lg:mx-0"
              style={{ fontSize: 'clamp(15px, 1.3vw, 19px)', lineHeight: 1.5 }}
            >
              Write, publish, and market a book that builds your business and finally position yourself
              as an authority in your niche.
            </p>
            <a
              ref={ctaRef}
              href={DEFAULT_CTA_URL}
              onClick={() => trackCTA('Hero')}
              className="btn-grad block w-full sm:max-w-[520px] text-center mx-auto lg:mx-0 text-white font-mono font-bold uppercase tracking-[0.04em] rounded-full"
              style={{ padding: '20px 28px', fontSize: 'clamp(13px, 1.1vw, 16px)' }}
            >
              Join Self-Publishing Studio LIVE
            </a>
            <p className="font-mono text-[10px] uppercase tracking-caps text-ink-300 mt-5 mb-2.5">Cart closes in</p>
            <CountdownTimer targetDate={CART_CLOSE_DATE} />
          </div>

          {/* Right — overlapping captain circles + small book-icon accent */}
          <div className="hidden md:flex justify-center lg:justify-end items-center">
            <div className="relative w-[320px] h-[380px] lg:w-[420px] lg:h-[440px]">
              {/* Small spark chip — upper area, brand gradient */}
              <div className="absolute left-[70px] top-0 z-30 lg:left-[100px]">
                <div
                  className="w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] rounded-full flex items-center justify-center spark-pulse"
                  style={{ background: GRAD_CHIP, boxShadow: '0 0 28px rgba(232,69,138,0.5)' }}
                >
                  <Spark className="w-[44%] h-[44%] text-white" style={{ filter: 'drop-shadow(0 0 8px rgba(180,214,255,0.6))' }} />
                </div>
              </div>

              {/* Dickie Bush — top-right, behind */}
              <div className="absolute right-0 top-0 z-10 flex flex-col items-center">
                <div
                  className="w-[170px] h-[170px] lg:w-[210px] lg:h-[210px] rounded-full overflow-hidden border border-white/15"
                  style={{ backgroundColor: '#0c2152', boxShadow: '0 16px 48px rgba(2,6,18,0.5)' }}
                >
                  <img src="/images/sps/dickie-circle.png" alt="Dickie Bush" className="w-full h-full object-cover object-top" />
                </div>
                <p className="font-display font-bold text-white mt-2.5 text-[16px] lg:text-[18px] tracking-caps-lg">Dickie Bush</p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-caps text-ink-300 mt-1 text-center">Co-Founder,<br />Ship 30 for 30</p>
              </div>

              {/* Nicolas Cole — bottom-left, in front (overlaps Dickie) */}
              <div className="absolute left-0 bottom-0 z-20 flex flex-col items-center">
                <div
                  className="w-[210px] h-[210px] lg:w-[260px] lg:h-[260px] rounded-full overflow-hidden border border-white/15"
                  style={{ backgroundColor: '#0c2152', boxShadow: '0 24px 64px rgba(2,6,18,0.55)' }}
                >
                  <img src="/images/sps/cole-circle.png" alt="Nicolas Cole" className="w-full h-full object-cover object-top" />
                </div>
                <p className="font-display font-bold text-white mt-2.5 text-[16px] lg:text-[18px] tracking-caps-lg">Nicolas Cole</p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-caps text-ink-300 mt-1 text-center">Co-Founder,<br />Premium Ghostwriting Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   WHY WRITE A BOOK — The opportunity
   ═══════════════════════════════════════════════════════════ */
function WhyWriteABook() {
  const reasons = [
    {
      num: '01',
      title: 'Master the craft.',
      body: 'Writing a book is the ultimate stress-test for whether you truly understand a topic. Finish one and you finish a version of yourself.',
    },
    {
      num: '02',
      title: 'Claim the authority.',
      body: "A book is the new business card. The moment you're an author, your positioning in your niche goes up — full stop.",
    },
    {
      num: '03',
      title: 'Build a business asset.',
      body: "A great non-fiction book is the front door to your entire ecosystem — the asset that turns readers into subscribers, students, and clients.",
    },
  ]

  const blooms = ['rgba(226,59,78,0.5)', 'rgba(47,143,255,0.5)', 'rgba(232,69,138,0.5)']

  return (
    <section className="bg-paper py-20 md:py-28 px-5 md:px-8" style={{ color: '#15161a' }}>
      <div className="max-w-container mx-auto">
        <Eyebrow className="text-rust-500 mb-3">The opportunity</Eyebrow>
        <Display size="m" className="mb-12 max-w-[920px]" style={{ color: '#15161a' }}>
          Why Write A Book?<br />
          <span className="grad-text">And Why Now?</span>
        </Display>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <div
              key={r.num}
              className="relative overflow-hidden rounded-[16px] p-7 md:p-8 flex flex-col shadow-float"
              style={{ background: GRAD_NAVY_BANNER }}
            >
              <Bloom color={blooms[i]} size={320} style={{ right: '-120px', top: '-120px' }} />
              <p className="grad-text font-display font-bold text-[clamp(40px,4.5vw,60px)] leading-none mb-4 relative z-10">{r.num}</p>
              <Display size="s" as="h3" className="text-white mb-3 relative z-10" style={{ fontSize: 'clamp(22px, 2.4vw, 30px)' }}>{r.title}</Display>
              <p className="font-serif text-[16px] leading-[1.55] text-ink-200 relative z-10">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   WHAT IS THE BOOTCAMP — Product box + six stat cards
   ═══════════════════════════════════════════════════════════ */
function Stats() {
  const stats = [
    { num: '6', label: 'Live Sessions', desc: '3 per week over 2 weeks. 60 min each. 3:00 PM ET.' },
    { num: '14', label: 'Days To Finish Your Book', desc: 'From blank page to a finished, ready-to-publish manuscript.' },
    { num: '6', label: 'AI Writing Assets', desc: 'Plug-and-play prompts and templates for every step.' },
    { num: '3', label: 'Mini-Courses', desc: 'Manuscript OS, Self-Publishing Empire, Book Launch Blueprint.' },
    { num: '3', label: 'Fast-Action Bonuses', desc: 'Indie vs Traditional, AI Author Autopilot, Book Monetization Mastery.' },
    { num: '2', label: 'World-Class Instructors', desc: 'Nicolas Cole & Dickie Bush — authors and digital publishers.' },
  ]

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8 border-t border-ink-700">
      <Bloom color="rgba(47,143,255,0.28)" size={640} style={{ left: '-220px', top: '40px' }} />
      <Bloom color="rgba(232,69,138,0.24)" size={560} style={{ right: '-200px', bottom: '0px' }} />
      <div className="relative max-w-container mx-auto">
        {/* Centered headline with gradient accent line */}
        <div className="flex flex-col items-center mb-14">
          <div className="w-16 h-[3px] mb-7 rounded-full" style={{ background: GRAD_CHIP }} />
          <Display size="m" className="text-white text-center" style={{ fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
            What Is Self-Publishing<br />
            <span className="grad-text">Studio LIVE?</span>
          </Display>
        </div>

        {/* Two-column: product box left, 2x3 stat grid right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-center">
          {/* Left — product box */}
          <div className="flex justify-center">
            <img
              src="/images/sps/product-box-sps.png"
              alt="Self-Publishing Studio LIVE"
              className="w-full max-w-[420px] drop-shadow-[20px_30px_40px_rgba(0,0,0,0.6)]"
              loading="lazy"
            />
          </div>

          {/* Right — 2x3 stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-ink-800 border border-ink-700 rounded-[16px] p-5 md:p-6 flex flex-col transition-shadow hover:shadow-glow">
                <p className="grad-text font-display font-bold leading-none mb-3" style={{ fontSize: 'clamp(36px, 3.8vw, 52px)' }}>{s.num}</p>
                <p className="font-mono text-[12px] font-bold uppercase tracking-caps text-white mb-2 leading-tight">{s.label}</p>
                <p className="font-serif text-[13px] md:text-[14px] leading-[1.5] text-ink-200">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Centered CTA below */}
        <div className="mt-14 text-center">
          <a
            href={DEFAULT_CTA_URL}
            onClick={() => trackCTA('Stats')}
            className="btn-grad inline-block text-white font-mono font-bold uppercase tracking-[0.04em] rounded-full"
            style={{ padding: '20px 36px', fontSize: 'clamp(13px, 1vw, 15px)' }}
          >
            Join Self-Publishing Studio LIVE
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   IS THIS FOR YOU — Accordion of em-stressed questions
   ═══════════════════════════════════════════════════════════ */
function IsThisForYou() {
  const questions = [
    {
      q: "Have you been <em>'writing a book' for years</em> but never actually finished it?",
      a: "We've all been there — notes in a Google Doc, a half-finished draft you haven't opened in months, and a vague sense the world is missing the book you're meant to write. Self-Publishing Studio LIVE gives you the system, the structure, and the deadlines to finally ship it. Most students draft their first book in weeks, not years.",
    },
    {
      q: "Do you have <em>the expertise</em> but not the <em>system</em> to turn it into a book?",
      a: "You know your subject cold. What you don't know is how to organize it into chapters, how to outline a non-fiction book that actually sells, how to publish on Amazon, and how to market it after launch. This studio gives you the exact framework Cole has used across 10+ books and $500,000+ in royalties.",
    },
    {
      q: "Do you want a book that <em>builds your business</em> — not just sits on a shelf?",
      a: "Most books don't make money because most authors treat the book as the product. Inside the studio you'll learn how to treat your book as the front door to your business — the asset that turns readers into newsletter subscribers, digital product buyers, and clients. A $10 book becomes a $10,000 customer.",
    },
    {
      q: "Are you tired of writing posts and essays <em>into the void</em> with nothing to sell?",
      a: "You've built an audience on X, LinkedIn, or Substack. A book is the asset that compounds — it positions you as the authority in your niche, on autopilot. Inside, we walk you through the exact launch strategy that's sold tens of thousands of books without a PR firm or podcast tour.",
    },
    {
      q: "Do you want to use AI to <em>accelerate</em> — without producing generic AI slop?",
      a: "There's a difference between AI-generated slop (which Amazon flags and reputable readers hate) and AI-assisted authorship (which is the new standard). Inside Manuscript OS and AI Author Autopilot, you'll learn how to use AI as a power tool while keeping every page recognizably yours.",
    },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(122,54,224,0.22)" size={560} style={{ right: '-200px', top: '120px' }} />
      <div className="relative max-w-narrow mx-auto">
        <div className="border-l-[6px] border-butter-500 pl-5 mb-10">
          <Eyebrow className="mb-2">Let's find out.</Eyebrow>
          <Display size="m" className="text-white">Is the bootcamp right for you?</Display>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`bg-ink-800/50 border rounded-[14px] px-6 py-5 cursor-pointer transition-colors ${
                open === i ? 'border-butter-500/50' : 'border-ink-700 hover:border-ink-600'
              }`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3
                  className="font-display text-[16px] md:text-[18px] text-white font-medium [&_em]:not-italic [&_em]:grad-text [&_em]:font-bold"
                  dangerouslySetInnerHTML={{ __html: q.q }}
                />
                <span className={`font-display font-bold text-[24px] leading-none flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45 text-butter-500' : 'text-ink-400'}`}>
                  +
                </span>
              </div>
              {open === i && (
                <p className="font-serif text-[15px] md:text-[16px] text-paper-200 leading-[1.6] mt-4 pb-1">{q.a}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-serif text-[18px] italic text-ink-200 mb-6">If any of these sound like you&hellip; this bootcamp was made for you.</p>
          <PrimaryCTA big track="Is This For You">Join Self-Publishing Studio LIVE</PrimaryCTA>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   CURRICULUM — 6 sessions on a vertical timeline
   ═══════════════════════════════════════════════════════════ */
function Curriculum() {
  const sessions = [
    { num: 1, date: 'Mon Jun 1', title: 'The Perfect Book Title', desc: 'How to craft a title that positions you as the authority in your niche, attracts the right reader, and ranks on Amazon.', asset: 'The Perfect Book Title Generator' },
    { num: 2, date: 'Wed Jun 3', title: 'Your Origin Story (Credibility & POV)', desc: 'Why people will read YOUR book — your earned authority, your unique angle, and the story only you can tell.', asset: 'Origin Story Interview Prompt' },
    { num: 3, date: 'Fri Jun 5', title: 'Outlining Your Book', desc: "Reverse-engineer a bulletproof outline from your reader's questions. Walk away with a complete skeleton you can draft against.", asset: 'Book Outline Crafter' },
    { num: 4, date: 'Mon Jun 8', title: 'Outlining Each Chapter', desc: 'The chapter-level framework Cole has used across 10+ books. Clear, valuable, and actually enjoyable to read.', asset: 'The Perfect Book Chapter Template' },
    { num: 5, date: 'Wed Jun 10', title: 'Book Writing Fundamentals', desc: 'How to draft without getting stuck. Use AI to accelerate the heavy lifting while keeping every page recognizably yours.', asset: 'Book Chapter Autowriter' },
    { num: 6, date: 'Fri Jun 12', title: 'Book Launch Blueprint', desc: "The evergreen marketing strategy that's generated $500K+ in royalties — without a PR firm, podcast tour, or massive budget.", asset: 'Book Launch Checklist' },
  ]

  return (
    <section id="curriculum" className="bg-paper py-20 md:py-28 px-5 md:px-8" style={{ color: '#15161a' }}>
      <div className="max-w-narrow mx-auto">
        <Eyebrow className="text-rust-500 mb-3 text-center">The 6 live sessions</Eyebrow>
        <Display size="m" className="text-center mb-3" style={{ color: '#15161a' }}>
          Here's what<br /><span className="grad-text">you'll build.</span>
        </Display>
        <p className="font-mono text-[12px] uppercase tracking-caps text-center mb-14" style={{ color: '#5c5b57' }}>
          All sessions 60 min &middot; M/W/F &middot; 3:00 PM ET &middot; June 1 &ndash; June 12, 2026
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop center */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2" style={{ background: 'linear-gradient(180deg, rgba(232,69,138,0.45), rgba(47,143,255,0.45))' }} />
          {/* Vertical line — mobile left */}
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-[2px]" style={{ background: 'linear-gradient(180deg, rgba(232,69,138,0.45), rgba(47,143,255,0.45))' }} />

          <div className="space-y-10 md:space-y-14">
            {sessions.map((s) => {
              const isEven = s.num % 2 === 0
              return (
                <div key={s.num} className="relative">
                  {/* Module gradient tile on the line */}
                  <div className="absolute z-10 left-0 md:left-1/2 md:-translate-x-1/2">
                    <div className="relative w-11 h-11 rounded-[14px] overflow-hidden flex items-center justify-center shadow-card ring-4 ring-paper" style={{ background: MODULE_GRADS[s.num - 1] }}>
                      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(125deg, rgba(255,255,255,0.24), transparent 42%, transparent 76%, rgba(0,0,0,0.16))' }} />
                      <span className="relative z-10 font-display font-bold text-[18px] text-white leading-none">{s.num}</span>
                    </div>
                  </div>

                  {/* Content — desktop alternates, mobile always right */}
                  <div className={`pl-16 md:pl-0 md:w-[45%] ${isEven ? 'md:ml-auto md:pl-14' : 'md:mr-auto md:pr-14 md:text-right'}`}>
                    <span className="inline-block bg-ink-900 text-butter-500 font-mono text-[11px] font-bold uppercase tracking-caps px-3 py-1 rounded-full mb-2.5">
                      {s.date}
                    </span>
                    <Display size="s" as="h3" className="mb-2.5" style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', color: '#15161a' }}>{s.title}</Display>
                    <p className="font-serif text-[15px] leading-[1.55] mb-3" style={{ color: '#5c5b57' }}>{s.desc}</p>
                    <div className={`inline-block bg-white border border-paper-300 rounded-[10px] px-3 py-1.5 ${isEven ? '' : 'md:ml-auto'}`}>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-caps text-rust-500 mb-0.5">Asset included</p>
                      <p className="font-display text-[13px] font-semibold" style={{ color: '#15161a' }}>{s.asset}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Closing */}
        <div className="mt-16 text-center">
          <Display size="s" className="leading-[1.05] mb-5" style={{ fontSize: 'clamp(22px, 3vw, 36px)', color: '#15161a' }}>
            We build <span className="grad-text">together</span>.<br />
            You leave with <span className="grad-text">a finished manuscript</span>.
          </Display>
          <p className="font-serif text-[16px] mb-8" style={{ color: '#5c5b57' }}>
            This isn't self-paced content you buy and forget.
          </p>
          <a
            href={DEFAULT_CTA_URL}
            onClick={() => trackCTA('Curriculum')}
            className="btn-grad inline-block text-white font-mono font-bold uppercase text-[15px] tracking-[0.04em] px-9 py-5 rounded-full"
          >
            Join Self-Publishing Studio LIVE
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   CAPTAINS — Cole + Dickie
   ═══════════════════════════════════════════════════════════ */
function Captains() {
  const captains = [
    {
      name: 'Nicolas Cole',
      role: 'Co-Founder, Ship 30 for 30 & Premium Ghostwriting Academy',
      img: '/images/sps/cole-headshot.png',
      bio: 'Author of 10+ non-fiction books, including The Art & Business of Online Writing. #1 most-read writer on Quora with 100M+ views. Co-founder of Ship 30 for 30 and Premium Ghostwriting Academy. Generated $500,000+ in self-published royalties on the back of his books.',
    },
    {
      name: 'Dickie Bush',
      role: 'Co-Founder, Ship 30 for 30',
      img: '/images/sps/dickie-headshot.png',
      bio: 'Former Wall Street trader at BlackRock turned digital entrepreneur. Creator of Ship 30 for 30—the fastest-growing cohort-based writing program on the internet. Used email and newsletters to sell $20,000,000 in digital products.',
    },
  ]

  const stats = [
    '10+ Published Books',
    '$500,000+ In Royalties',
    '10,000+ Students Taught',
    '$20M+ In Digital Products',
  ]

  return (
    <section id="captains" className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(47,143,255,0.22)" size={620} style={{ right: '-200px', top: '-120px' }} />
      <Bloom color="rgba(232,69,138,0.18)" size={520} style={{ left: '-200px', bottom: '40px' }} />
      <div className="relative max-w-container mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
        {/* Left — headline + subhead + stat pills */}
        <div>
          <Eyebrow className="text-rust-500 mb-5">Meet Your Instructors</Eyebrow>
          <Display size="m" className="text-white mb-6">
            Built by a best-selling author<br />
            <span className="grad-text">with 10+ published books.</span>
          </Display>
          <p className="font-serif text-[17px] text-ink-200 leading-[1.55] max-w-[520px] mb-8">
            Created by the founders of Ship 30 for 30 &amp; Premium Ghostwriting Academy.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {stats.map((s) => (
              <span key={s} className="inline-flex items-center text-white font-mono text-[12px] font-bold uppercase tracking-caps px-4 py-2 rounded-full" style={{ background: GRAD_CHIP }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Right — stacked instructor cards */}
        <div className="flex flex-col gap-5">
          {captains.map((c) => (
            <div key={c.name} className="flex gap-5 items-start">
              <div className="w-[88px] h-[88px] md:w-[96px] md:h-[96px] rounded-[16px] overflow-hidden flex-shrink-0 border border-ink-700">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="font-display font-bold text-[20px] md:text-[22px] text-white tracking-caps-lg leading-none">{c.name}</p>
                <p className="font-mono font-bold text-[11px] uppercase tracking-caps text-rust-500 mt-2 mb-3">{c.role}</p>
                <p className="font-serif text-[15px] leading-[1.55] text-ink-200">{c.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book covers row — quiet evidence under the stat-pill claim */}
      <div className="max-w-container mx-auto mt-12 lg:mt-16 pt-10 lg:pt-12 border-t border-ink-700">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          {[
            { src: '/images/sps/book_artbiz.webp', alt: 'The Art & Business of Online Writing' },
            { src: '/images/sps/book_ghost.webp', alt: 'The Art & Business of Ghostwriting' },
            { src: '/images/sps/book_22laws.jpg', alt: 'The 22 Laws of Online Writing' },
            { src: '/images/sps/book_niche.jpg', alt: 'Niche Down' },
            { src: '/images/sps/book_pillars.png', alt: 'The 8 Pillars of Premium Ghostwriting' },
            { src: '/images/sps/book_career.webp', alt: 'Writer Career Paths' },
            { src: '/images/sps/book_confessions.webp', alt: 'Confessions of a Teenage Gamer' },
            { src: '/images/sps/book_snow.jpg', alt: 'Snow Leopard' },
          ].map((c) => (
            <div
              key={c.src}
              className="aspect-[2/3] overflow-hidden rounded-[8px] bg-ink-800 transition-transform duration-200 hover:-translate-y-1"
              style={{ boxShadow: '0 10px 28px rgba(2,6,18,0.5)' }}
            >
              <img
                src={c.src}
                alt={c.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   MINI-COURSES — Product box renders
   ═══════════════════════════════════════════════════════════ */
function MiniCourses() {
  const courses = [
    {
      img: '/images/sps/product-box-manuscriptos.png',
      eyebrow: 'Mini-Course #1',
      title: 'Manuscript OS',
      value: '$1,500 Value',
      desc: 'The complete system for writing your non-fiction book — from crafting a title that positions you as the authority in your niche, to building a bulletproof outline, to writing chapters that are clear, valuable, and actually enjoyable to read.',
    },
    {
      img: '/images/sps/product-box-playbook.png',
      eyebrow: 'Mini-Course #2',
      title: 'Self-Publishing Empire',
      value: '$1,500 Value',
      desc: 'Everything you need to format, upload, and publish your book on Amazon — including how to research the right categories, write a book description that converts, and price your book, eBook, and audiobook for maximum revenue.',
    },
    {
      img: '/images/sps/product-box-blueprint.png',
      eyebrow: 'Mini-Course #3',
      title: 'Book Launch Blueprint',
      value: '$1,500 Value',
      desc: 'The evergreen marketing strategy used to sell tens of thousands of books and generate over $500,000 in self-published royalties — without a PR firm, a podcast tour, or a massive launch budget.',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(122,54,224,0.20)" size={560} style={{ left: '-200px', top: '60px' }} />
      <Bloom color="rgba(246,131,31,0.18)" size={520} style={{ right: '-200px', bottom: '40px' }} />
      <div className="relative max-w-container mx-auto">
        <Eyebrow className="mb-4">Video &amp; Text Curriculum</Eyebrow>
        <Display size="m" className="text-white max-w-[920px] mb-5">
          3 Self-Publishing<br /><span className="grad-text">Mini-Courses.</span>
        </Display>
        <p className="font-serif text-[18px] text-ink-200 mb-14 max-w-[720px]">
          Get access to the Self-Publishing Studio self-study course:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.title} className="flex flex-col items-center text-center">
              <div className="bg-ink-800 border border-ink-700 rounded-[16px] p-8 mb-6 w-full flex items-center justify-center" style={{ minHeight: 280 }}>
                <img src={c.img} alt={c.title} className="max-w-full max-h-[220px] object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]" loading="lazy" />
              </div>
              <Eyebrow className="mb-2">{c.eyebrow}</Eyebrow>
              <Display size="s" as="h3" className="text-white mb-2">{c.title}</Display>
              <p className="font-mono font-bold text-[14px] text-butter-500 tracking-caps mb-3">{c.value}</p>
              <p className="font-serif text-[15px] leading-[1.55] text-ink-200">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   BONUSES — 3 cards
   ═══════════════════════════════════════════════════════════ */
function Bonuses() {
  const bonuses: { num: number; icon: string; title: string; value: string; desc: string; expires?: string }[] = [
    {
      num: 1,
      icon: '/images/sps/bonus_1.png',
      title: 'Indie vs. Traditional Crash Course',
      value: '$497 Value',
      desc: 'Should you self-publish or try to land a book deal? Most writers spend months going back and forth. This crash course breaks down both paths — the real tradeoffs, the money, the timeline, the creative control — so you can make the right decision for your book and your business, fast.',
    },
    {
      num: 2,
      icon: '/images/sps/bonus_2.png',
      title: 'AI Author Autopilot',
      value: '$997 Value',
      expires: 'Expires May 26, 2026',
      desc: "Don't have time to write a book? This bonus gives you the exact AI system used to accelerate every stage of the writing process — from outlining to drafting to editing — without producing the kind of generic AI slop that kills your credibility. You do the thinking. AI handles the heavy lifting.",
    },
    {
      num: 3,
      icon: '/images/sps/bonus_3.png',
      title: 'Book Monetization Mastery',
      value: '$997 Value',
      expires: 'Expires May 29, 2026',
      desc: "Most books don't make money — because most authors treat the book as the product. This bonus shows you how to treat your book as the front door to your business: the entry point that turns readers into newsletter subscribers, digital product buyers, clients, and more. This is how a $10 book becomes a $10,000 customer.",
    },
  ]

  return (
    <section id="bonuses" className="relative overflow-hidden bg-ink-800 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(47,143,255,0.18)" size={560} style={{ right: '-220px', top: '40px' }} />
      <div className="relative max-w-container mx-auto">
        <Eyebrow className="mb-4">Free Bonuses Included</Eyebrow>
        <Display size="m" className="text-white max-w-[1000px] mb-14">
          Finally claim your badge<br />
          <span className="grad-text">of being an author.</span>
        </Display>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bonuses.map((b) => (
            <div key={b.num} className="bg-ink-900 border border-ink-700 rounded-[16px] p-7 flex flex-col gap-4 transition-shadow hover:shadow-glow">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-caps text-butter-500 mt-2">
                  Bonus #{b.num}
                </span>
                <img src={b.icon} alt="" className="w-16 h-16 md:w-[72px] md:h-[72px] -mt-1 -mr-1" />
              </div>
              <Display size="s" as="h3" className="text-white">{b.title}</Display>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-mono font-bold text-[14px] text-butter-500 tracking-caps">{b.value}</p>
                {b.expires && (
                  <p className="font-mono font-bold text-[11px] uppercase tracking-caps text-rust-400">&middot; {b.expires}</p>
                )}
              </div>
              <p className="font-serif text-[15px] leading-[1.55] text-ink-200">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   AI WRITING SKOOL — Free 30-Day Trial
   ═══════════════════════════════════════════════════════════ */
function AIWritingSkool() {
  const perks = [
    { title: 'AI Cole', desc: 'Our custom AI model trained on all of our programs, curriculums, books, and content. Ask it anything, 24/7.', value: '$5,000+ value' },
    { title: 'Monday Hot Seats with Cole', desc: 'Submit your questions and workshop your specific situation live.', value: '$3,000+ value' },
    { title: 'Weekly AI/Tech Clinic with Mitch Harris', desc: 'Office hours to troubleshoot, learn new AI tools, and stay on the cutting edge.', value: '$1,500+ value' },
    { title: 'Monthly Mini-Products, Templates, Prompts, and .Skills', desc: 'New resources dropped every month that you can download and use immediately.', value: '$1,000+ value' },
  ]

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(22,160,210,0.20)" size={580} style={{ left: '-220px', bottom: '20px' }} />
      <div className="relative max-w-container mx-auto">
        <Eyebrow className="mb-4">Included free with the bootcamp</Eyebrow>
        <Display size="m" className="text-white mb-4">
          30-Day Trial to<br /><span className="grad-text">AI Writing Skool.</span>
        </Display>
        <p className="font-serif text-[18px] text-ink-200 mb-12 max-w-[760px]">
          AI Writing Skool is THE community for writers and creators building in the new AI economy &mdash;
          and you get full access for 30 days so you can get feedback on your book, trade ideas, and stay sharp as you build.
        </p>

        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start">
          <div className="w-full md:w-[45%] flex-shrink-0">
            <img src="/images/AIWS.png" alt="AI Writing Skool" className="w-full object-contain rounded-[16px] border border-ink-700" loading="lazy" />
          </div>
          <div className="flex-1">
            <Eyebrow className="mb-5">Inside, you'll unlock:</Eyebrow>
            <div className="space-y-5">
              {perks.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="text-butter-500 mt-1 flex-shrink-0">→</span>
                  <div>
                    <span className="font-display text-[15px] font-bold text-white">{p.title}:</span>
                    <span className="font-serif text-[15px] text-ink-200"> {p.desc}</span>
                    <span className="font-mono text-[13px] text-butter-500 font-bold"> ({p.value})</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <span className="text-butter-500 mt-1 flex-shrink-0">→</span>
                <div>
                  <span className="font-display text-[15px] font-bold text-white">Daily Q&amp;A Channel:</span>
                  <span className="font-serif text-[15px] text-ink-200"> Never get stuck. Get answers from the community and our team every single day.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   PRICING — Offer stack
   ═══════════════════════════════════════════════════════════ */
function Pricing() {
  const items = [
    { name: '6 x 60-Minute Live Sessions', price: '$3,600' },
    { name: 'A 2-Week Build & Launch Schedule', price: '$1,000' },
    { name: 'The Bootcamp Session Guide', price: '$600' },
    { name: '6 Done-For-You Prompts & Templates', price: '$600' },
    { name: 'Mini-Course #1: Manuscript OS', price: '$1,500' },
    { name: 'Mini-Course #2: Self-Publishing Empire', price: '$1,500' },
    { name: 'Mini-Course #3: Book Launch Blueprint', price: '$1,500' },
    { name: 'Session Replays', price: '$300' },
    { name: 'Lifetime Access to the Curriculum', price: 'Priceless' },
    { name: 'BONUS: Indie vs. Traditional Crash Course', price: '$497' },
    { name: 'BONUS: AI Author Autopilot', price: '$997' },
    { name: 'BONUS: Book Monetization Mastery', price: '$997' },
    { name: '30-Day AI Writing Skool Trial', price: '$99' },
  ]

  return (
    <section id="pricing" className="relative overflow-hidden bg-ink-800 py-24 md:py-32 px-5 md:px-8">
      <Bloom color="rgba(232,69,138,0.20)" size={620} style={{ left: '-200px', top: '120px' }} />
      <Bloom color="rgba(246,131,31,0.18)" size={520} style={{ right: '-200px', bottom: '60px' }} />
      <div className="relative max-w-narrow mx-auto text-center">
        <Eyebrow className="mb-4">Join The Bootcamp</Eyebrow>
        <h2
          className="font-display font-bold text-white tracking-display [text-wrap:balance] mb-12"
          style={{ fontSize: 'clamp(28px, 4.2vw, 56px)', lineHeight: 1.0 }}
        >
          Want To Write Your<br />
          First (Or Next)<br />
          <span className="grad-text">Non-Fiction Book</span><br />
          In 14 Days?
        </h2>

        <div className="max-w-[560px] mx-auto rounded-[20px] overflow-hidden shadow-float">
          {/* Top: value stack */}
          <div className="bg-ink-900 border border-ink-700 border-b-0 p-7 md:p-9 text-left">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-ink-700 last:border-b-0 gap-4">
                <span className="font-display text-[14px] text-paper-200">{item.name}</span>
                <span className="font-mono text-[13px] font-bold text-ink-300 flex-shrink-0 tabular-nums">{item.price}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 mt-3 border-t border-ink-600">
              <span className="font-display text-[14px] font-bold text-white">Total Value</span>
              <span className="font-display font-bold text-[24px] text-white line-through decoration-rust-500 decoration-2">$13,190</span>
            </div>
          </div>

          {/* Bottom: price reveal — warm paper card floating on navy */}
          <div className="relative overflow-hidden p-7 md:p-9 text-center" style={{ background: '#e7e5df' }}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-caps" style={{ color: '#5c5b57' }}>Your Price</p>
            <p className="grad-text font-display font-bold text-[clamp(64px,10vw,96px)] leading-none mt-2">$800</p>
            <a
              href={DEFAULT_CTA_URL}
              onClick={() => trackCTA('Pricing')}
              className="btn-grad inline-block text-white font-mono font-bold uppercase text-[15px] tracking-[0.04em] px-9 py-5 rounded-full mt-6"
            >
              Join Self-Publishing Studio LIVE &rarr;
            </a>
            <p className="font-mono text-[12px] mt-4" style={{ color: '#5c5b57' }}>7-day money-back guarantee</p>
          </div>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-caps text-ink-300 mt-10 mb-3">Enrollment closes in</p>
        <div className="inline-block"><CountdownTimer targetDate={CART_CLOSE_DATE} /></div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   PATTERN BOOK COVER — flat front with book-pattern texture,
   inline render of the "pattern" variant from the design bundle.
   ═══════════════════════════════════════════════════════════ */
function PatternBookCover({
  eyebrow = 'A NON-FICTION FIELD GUIDE',
  title = 'YOUR TITLE HERE',
  subtitle = "A field guide to writing and publishing the non-fiction book you've been meaning to write.",
  author = 'YOUR NAME HERE',
}: {
  eyebrow?: string
  title?: string
  subtitle?: string
  author?: string
}) {
  const fg = '#ffffff'
  const bg = '#0a1c46'
  return (
    <div
      className="relative"
      style={{
        width: 'min(320px, 100%)',
        aspectRatio: '320 / 460',
        containerType: 'inline-size',
        boxShadow: '0 28px 70px rgba(2,6,18,0.5)',
      }}
    >
      {/* Cover face */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          background: bg,
          backgroundImage:
            'radial-gradient(80% 60% at 78% 14%, rgba(232,69,138,0.55), transparent 60%), radial-gradient(70% 60% at 18% 90%, rgba(47,143,255,0.5), transparent 62%), linear-gradient(118deg, #050f26 0%, #0a1c46 54%, #0c2152 100%)',
        }}
      >
        {/* Inner debossed frame */}
        <div
          className="absolute pointer-events-none"
          style={{ inset: '3.75cqw', border: '1px solid rgba(180,214,255,0.30)' }}
        />
        {/* Content stack */}
        <div className="absolute flex flex-col" style={{ inset: '6.875cqw' }}>
          {/* Eyebrow */}
          <div
            className="font-sans font-bold uppercase"
            style={{ fontSize: '3.125cqw', letterSpacing: '0.18em', color: fg, opacity: 0.85 }}
          >
            {eyebrow}
          </div>
          {/* Title + subtitle */}
          <div className="flex-1 flex flex-col justify-center min-h-0">
            <div
              className="font-display font-bold uppercase"
              style={{
                fontSize: '18.75cqw',
                lineHeight: 0.86,
                letterSpacing: '-0.01em',
                color: fg,
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                className="font-sans"
                style={{
                  marginTop: '4.375cqw',
                  fontSize: '4.0625cqw',
                  lineHeight: 1.35,
                  color: fg,
                  opacity: 0.78,
                  maxWidth: '92%',
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          {/* Rule + author */}
          <div>
            <div style={{ height: '0.625cqw', width: '13.75cqw', background: fg, opacity: 0.6, marginBottom: '3.75cqw' }} />
            <div
              className="font-sans font-bold uppercase"
              style={{ fontSize: '3.4375cqw', letterSpacing: '0.22em', color: fg }}
            >
              {author}
            </div>
          </div>
        </div>
        {/* Sheen overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(110deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 28%, rgba(0,0,0,0.10) 80%, rgba(0,0,0,0.22) 100%)',
            opacity: 0.9,
          }}
        />
      </div>
      {/* Spine peek on the left */}
      <div
        aria-hidden="true"
        className="absolute top-0"
        style={{
          left: '-2.5cqw',
          width: '2.5cqw',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.5), #08111F)',
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   GUARANTEE + FINAL CTA — Butter card
   ═══════════════════════════════════════════════════════════ */
function GuaranteeFinalCTA() {
  return (
    <section id="final-cta" className="bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <div className="relative overflow-hidden text-white p-10 md:p-14 rounded-[20px] shadow-float" style={{ background: GRAD_NAVY_BANNER }}>
          {/* Signature decoration */}
          <Bloom color="rgba(232,69,138,0.42)" size={620} style={{ right: '-160px', top: '-200px' }} />
          <Bloom color="rgba(246,131,31,0.34)" size={460} style={{ right: '120px', top: '40px' }} />
          <Bloom color="rgba(47,143,255,0.34)" size={520} style={{ left: '-180px', bottom: '-160px' }} />
          <Flare scale={0.7} style={{ right: '220px', top: '180px', width: 1, height: 1 }} />
          <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center">
            {/* Copy column */}
            <div>
              <p className="font-mono text-[12px] font-bold uppercase tracking-caps text-butter-500 mb-6">
                Stop overthinking &middot; finally write the book
              </p>
              <Display size="l" className="text-white mb-6">
                Your book.<br /><span className="grad-text">This year.</span>
              </Display>
              <p className="font-serif text-[20px] leading-[1.55] text-ink-200 max-w-[560px] mb-9">
                Six live sessions, three mini-courses, six AI-powered writing assets, and three fast-action bonuses.
                Lifetime access. 7-day no-questions-asked refund if you show up to Session 1 and decide this isn't what you expected.
              </p>
              <a
                href={DEFAULT_CTA_URL}
                onClick={() => trackCTA('Final')}
                className="btn-grad inline-block text-white font-mono font-bold uppercase text-[17px] tracking-[0.04em] px-10 py-5 rounded-full"
              >
                Join Self-Publishing Studio LIVE
              </a>
              <p className="font-mono text-[14px] text-ink-300 mt-5">
                Live bootcamp begins Monday, June 1, 2026.
              </p>
            </div>

            {/* Book cover column */}
            <div className="flex flex-col items-center lg:items-end gap-4 pl-2 pr-4 lg:pr-8">
              <PatternBookCover />
              <p
                className="font-mono font-bold uppercase text-ink-300 whitespace-nowrap"
                style={{ fontSize: 12, letterSpacing: '0.22em' }}
              >
                &mdash; Could be yours &mdash;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════ */
function FAQ() {
  const faqs = [
    { q: "How much time do I need per week?", a: "Three 60-minute live sessions per week (Monday, Wednesday, Friday at 3:00 PM ET), plus 1–2 hours to implement between sessions. Every asset is built during the session itself, so implementation time is minimal." },
    { q: "What if I can't attend live?", a: "Every session is recorded and the replay goes up within hours. You'll also get the full slide deck. Showing up live is where the real value is — real-time Q&A and feedback can't be replicated in a replay." },
    { q: "I don't have time to write a book. Will this work for me?", a: "This is the #1 objection we hear. Most people think writing a book takes years. Our AI-accelerated system shows you how to do it in weeks — not by producing generic AI slop, but by using AI to handle the heavy lifting while you do the thinking. You get a finished manuscript without giving up your evenings or weekends." },
    { q: "I'm not a great writer. Can I still write a book?", a: "You don't need to be a great writer. You need to be a clear thinker. The frameworks inside Manuscript OS show you how to organize your ideas — and the AI tools handle the prose. We've seen first-time authors finish manuscripts they're genuinely proud of, in their own voice." },
    { q: "Won't AI-written books get penalized by Amazon?", a: "Not the way we teach it. There's a difference between AI-generated slop (which Amazon flags and reputable authors avoid) and AI-assisted authorship (which is the new standard). We walk you through KDP's disclosure rules and show you how to produce work that's recognizably yours, with AI as a power tool — not the author." },
    { q: "Will my book actually make money?", a: "Most self-published books don't — because most authors treat the book as the product. We teach you to treat your book as the front door to your business. A $10 book that generates a $500/month client is worth $6,000/year, not $4 in royalties. The book is the funnel. The Book Monetization Mastery bonus covers this in detail." },
    { q: "I've tried writing a book before and didn't finish. How is this different?", a: "Our system has built-in completion mechanics: live deadlines, milestones, accountability checkpoints, and a peer community. The bootcamp structure forces you to ship. Most graduates finish their first draft within weeks." },
    { q: "How long do I have access?", a: "Lifetime. Every replay, slide deck, template, prompt, and bonus is yours forever. Including every update we ship to the curriculum." },
    { q: "How is this different from Ship 30 for 30?", a: "Ship 30 teaches you to write online — daily essays, 250 words at a time. Self-Publishing Studio LIVE teaches you to assemble that practice into a full non-fiction book and turn it into a business asset." },
    { q: "Is there a guarantee?", a: "Yes. Show up to Session 1, do the work, and if it isn't what you expected — email us within 7 days and we'll refund you in full. No questions asked." },
  ]

  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(47,143,255,0.16)" size={520} style={{ left: '-220px', top: '80px' }} />
      <div className="relative max-w-narrow mx-auto">
        <Eyebrow className="mb-4">Frequently asked questions</Eyebrow>
        <Display size="m" className="mb-12"><span className="grad-text">Still wondering?</span></Display>
        <div className="flex flex-col gap-[2px] bg-ink-700 rounded-[16px] overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="bg-ink-900">
                <button
                  onClick={() => {
                    if (!isOpen) Fathom.trackEvent(`FAQ: ${faq.q}`)
                    setOpen(isOpen ? null : i)
                  }}
                  className="w-full bg-transparent border-none cursor-pointer px-6 md:px-7 py-5 md:py-6 flex items-center justify-between text-left text-white font-display text-[16px] md:text-[18px] font-semibold leading-tight hover:text-butter-500 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span
                    className="font-display font-bold text-[28px] text-butter-500 leading-none flex-shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 md:px-7 pb-6 md:pb-7">
                    <p className="font-serif text-[16px] md:text-[17px] leading-[1.6] text-paper-200 max-w-[680px]">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FOOTER — Minimal copyright line
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-ink-700 px-5 md:px-8 py-10">
      <div className="max-w-container mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Spark className="w-3.5 h-3.5 text-accent-pink spark-pulse" />
          <img src="/images/sps/wordmark-inline.svg" alt="Self-Publishing Studio" className="h-7 opacity-80" />
          <Spark className="w-3.5 h-3.5 text-accent-blue spark-pulse" />
        </div>
        <p className="font-mono text-[12px] tracking-caps text-ink-500">
          &copy; 2026 Ship 30 for 30, LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════
   STICKY CTA BAR — appears when hero CTA scrolls off
   ═══════════════════════════════════════════════════════════ */
function StickyCtaBar({ heroCtaRef }: { heroCtaRef: React.RefObject<HTMLAnchorElement | null> }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = heroCtaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [heroCtaRef])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-ink-950 border-t border-ink-700 transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-container mx-auto px-5 h-[64px] flex items-center justify-between gap-4">
        <span className="hidden md:flex items-center gap-3 font-display font-bold text-[16px] tracking-caps-lg">
          <span className="w-7 h-7 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: GRAD_CHIP }}>
            <Spark className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="grad-text">Self-Publishing Studio LIVE</span>
        </span>
        <div className="hidden md:block">
          <CountdownTimer targetDate={CART_CLOSE_DATE} compact />
        </div>
        <a
          href={DEFAULT_CTA_URL}
          onClick={() => trackCTA('Sticky Bar')}
          className="btn-grad text-white font-mono font-bold uppercase text-[13px] tracking-caps px-6 py-2.5 rounded-full mx-auto md:mx-0"
        >
          Join Now
        </a>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const heroCtaRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    // Scroll-depth milestones — fire each threshold once per session
    const thresholds = [25, 50, 75, 100]
    const firedScroll = new Set<number>()
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      const pct = (window.scrollY / total) * 100
      for (const t of thresholds) {
        if (pct >= t && !firedScroll.has(t)) {
          firedScroll.add(t)
          Fathom.trackEvent(`Scroll: ${t}%`)
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // Section-reach — fire once when each key section enters the viewport
    const sectionNames: Record<string, string> = {
      bonuses: 'Section: Bonuses',
      pricing: 'Section: Pricing',
      'final-cta': 'Section: Final CTA',
      faq: 'Section: FAQ',
    }
    const firedSection = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedSection.has(entry.target.id)) {
            firedSection.add(entry.target.id)
            const name = sectionNames[entry.target.id]
            if (name) Fathom.trackEvent(name)
          }
        }
      },
      { threshold: 0.3 },
    )
    for (const id of Object.keys(sectionNames)) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <main className="min-h-screen bg-ink-900">
      <Hero ctaRef={heroCtaRef} />
      <FadeIn><WhyWriteABook /></FadeIn>
      <FadeIn><Stats /></FadeIn>
      <FadeIn><Captains /></FadeIn>
      <FadeIn><IsThisForYou /></FadeIn>
      <FadeIn><Curriculum /></FadeIn>
      <FadeIn><MiniCourses /></FadeIn>
      <FadeIn><Bonuses /></FadeIn>
      <FadeIn><AIWritingSkool /></FadeIn>
      <FadeIn><Pricing /></FadeIn>
      <FadeIn><GuaranteeFinalCTA /></FadeIn>
      <FadeIn><FAQ /></FadeIn>
      <Footer />
      <StickyCtaBar heroCtaRef={heroCtaRef} />
    </main>
  )
}
