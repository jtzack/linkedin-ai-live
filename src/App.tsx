import './index.css'
import { useState, useEffect, useRef } from 'react'
import * as Fathom from 'fathom-client'

const DEFAULT_CTA_URL = 'https://ship.samcart.com/products/linkedin-ai-live'

// Cart closes at midnight ET the night before Session 1 (July 6, 2026)
const CART_CLOSE_DATE = new Date('2026-07-06T03:59:00Z')

const trackCTA = (location: string) => Fathom.trackEvent(`CTA: ${location}`)

/* ─── Signature navy surface gradients ─── */
const GRAD_NAVY_HERO = 'linear-gradient(118deg, #050f26 0%, #0a1c46 54%, #0c2152 100%)'
const GRAD_NAVY_BANNER = 'linear-gradient(112deg, #06112a 0%, #0a1c46 56%, #0c2152 100%)'
const GRAD_CHIP = 'linear-gradient(135deg, #e8458a, #f6831f)'

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
          <span className="font-mono text-[10px] md:text-[11px] text-paper-200 uppercase tracking-caps whitespace-nowrap">
            Live Bootcamp Begins Monday, July 6, 2026
          </span>
        </div>
      </div>

      {/* Main content — fills remaining viewport */}
      <div className="relative flex-1 flex items-center w-full z-10">
        <div className="max-w-container mx-auto w-full px-5 md:px-8 py-6 md:py-8 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Left — eyebrow + headline + subhead + CTA + countdown */}
          <div className="max-w-[680px] mx-auto lg:mx-0 text-center lg:text-left">
            <p className="font-mono font-bold uppercase tracking-caps text-butter-500 mb-4 md:mb-5" style={{ fontSize: 'clamp(11px, 0.95vw, 14px)' }}>
              LinkedIn AI LIVE
            </p>
            <h1
              className="font-display font-bold text-white tracking-display [text-wrap:balance] mb-5"
              style={{ fontSize: 'clamp(38px, 4.6vw, 68px)', lineHeight: 0.99 }}
            >
              Position &amp; Publish<br />
              Your Way To<br />
              <span className="grad-text">Profit On LinkedIn</span><br />
              In 14 Days
            </h1>
            <p
              className="font-serif text-paper-200 mb-6 max-w-[560px] mx-auto lg:mx-0"
              style={{ fontSize: 'clamp(15px, 1.3vw, 19px)', lineHeight: 1.5 }}
            >
              Build a cutting-edge personal brand with AI so you can dominate your niche
              on LinkedIn in 2026.
            </p>
            <a
              ref={ctaRef}
              href={DEFAULT_CTA_URL}
              onClick={() => trackCTA('Hero')}
              className="btn-grad block w-full sm:max-w-[520px] text-center mx-auto lg:mx-0 text-white font-mono font-bold uppercase tracking-[0.04em] rounded-full"
              style={{ padding: '20px 28px', fontSize: 'clamp(13px, 1.1vw, 16px)' }}
            >
              Join LinkedIn AI LIVE
            </a>
            <p className="font-mono text-[10px] uppercase tracking-caps text-ink-300 mt-5 mb-2.5">Cart closes in</p>
            <CountdownTimer targetDate={CART_CLOSE_DATE} />
          </div>

          {/* Right — overlapping captain circles + small book-icon accent */}
          <div className="hidden md:flex justify-center lg:justify-end items-center">
            <div className="relative w-[360px] h-[420px] lg:w-[460px] lg:h-[480px]">
              {/* Small spark chip — top accent, brand gradient */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 z-30">
                <div
                  className="w-[60px] h-[60px] lg:w-[72px] lg:h-[72px] rounded-full flex items-center justify-center spark-pulse"
                  style={{ background: GRAD_CHIP, boxShadow: '0 0 28px rgba(232,69,138,0.5)' }}
                >
                  <Spark className="w-[44%] h-[44%] text-white" style={{ filter: 'drop-shadow(0 0 8px rgba(180,214,255,0.6))' }} />
                </div>
              </div>

              {/* Dickie Bush — top-left */}
              <div className="absolute left-0 top-[64px] z-10 flex flex-col items-center w-[150px] lg:w-[170px]">
                <div
                  className="w-[130px] h-[130px] lg:w-[150px] lg:h-[150px] rounded-full overflow-hidden border border-white/15"
                  style={{ backgroundColor: '#0c2152', boxShadow: '0 16px 48px rgba(2,6,18,0.5)' }}
                >
                  <img src="/images/sps/dickie-circle.png" alt="Dickie Bush" className="w-full h-full object-cover object-top" />
                </div>
                <p className="font-display font-bold text-white mt-2.5 text-[15px] lg:text-[16px] tracking-caps-lg">Dickie Bush</p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-caps text-ink-300 mt-1 text-center">Co-Founder,<br />Ship 30 for 30</p>
              </div>

              {/* Matthew Brown — top-right */}
              <div className="absolute right-0 top-[64px] z-10 flex flex-col items-center w-[150px] lg:w-[170px]">
                <div
                  className="w-[130px] h-[130px] lg:w-[150px] lg:h-[150px] rounded-full overflow-hidden border border-white/15"
                  style={{ backgroundColor: '#0c2152', boxShadow: '0 16px 48px rgba(2,6,18,0.5)' }}
                >
                  <img src="/images/matthew.jpeg" alt="Matthew Brown" className="w-full h-full object-cover object-top" />
                </div>
                <p className="font-display font-bold text-white mt-2.5 text-[15px] lg:text-[16px] tracking-caps-lg">Matthew Brown</p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-caps text-ink-300 mt-1 text-center">Founder,<br />Tribe Digital</p>
              </div>

              {/* Daniel Bustamante — bottom-center, in front */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-20 flex flex-col items-center w-[180px] lg:w-[200px]">
                <div
                  className="w-[170px] h-[170px] lg:w-[190px] lg:h-[190px] rounded-full overflow-hidden border border-white/15"
                  style={{ backgroundColor: '#0c2152', boxShadow: '0 24px 64px rgba(2,6,18,0.55)' }}
                >
                  <img src="/images/daniel-circle.png" alt="Daniel Bustamante" className="w-full h-full object-cover object-top" />
                </div>
                <p className="font-display font-bold text-white mt-2.5 text-[15px] lg:text-[16px] tracking-caps-lg">Daniel Bustamante</p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-caps text-ink-300 mt-1 text-center">Co-Founder, Velocity</p>
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
      title: 'A career marketplace.',
      body: '87% of recruiters use LinkedIn to find candidates. It’s where hiring happens — and where the right people are already looking for someone exactly like you.',
    },
    {
      num: '02',
      title: 'A content platform.',
      body: 'Industry experts build audiences and establish thought leadership here. The people actively writing and creating are the ones who get promoted and land clients.',
    },
    {
      num: '03',
      title: 'A business network.',
      body: 'Deals get made and partnerships form. With over a billion members, it’s the largest professional network in history — more opportunity than anywhere else.',
    },
  ]

  const blooms = ['rgba(47,143,255,0.5)', 'rgba(232,69,138,0.5)', 'rgba(24,168,107,0.5)']

  return (
    <section className="bg-paper py-20 md:py-28 px-5 md:px-8" style={{ color: '#15161a' }}>
      <div className="max-w-container mx-auto">
        <Eyebrow className="text-rust-500 mb-3">Why LinkedIn &mdash; and why now?</Eyebrow>
        <Display size="m" className="mb-5 max-w-[920px]" style={{ color: '#15161a' }}>
          Three platforms.<br />
          <span className="grad-text">One profile.</span>
        </Display>
        <p className="font-serif text-[17px] md:text-[19px] leading-[1.55] mb-12 max-w-[680px]" style={{ color: '#5c5b57' }}>
          LinkedIn isn&rsquo;t a resume site anymore. It&rsquo;s become a Swiss Army knife for professionals &mdash;
          three platforms rolled into one. There has never been a better time to show up the right way.
        </p>

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
    { num: '6', label: 'Live Sessions', desc: '3 per week over 2 weeks. 60 minutes each, taught live.' },
    { num: '14', label: 'Days To A LinkedIn Brand', desc: 'From overlooked profile to a positioning-and-publishing system that runs.' },
    { num: '50+', label: 'Plug-And-Play AI Prompts', desc: 'Proven posts, hooks, CTAs, and frameworks you can use immediately.' },
    { num: '3', label: 'Mini-Courses', desc: 'LinkedIn Positioning, Publishing, and Growth Systems.' },
    { num: '3', label: 'Fast-Action Bonuses', desc: 'Visual Brand Templates, AI Pro Checklist, and a Ghostbase trial.' },
    { num: '3', label: 'Expert Instructors', desc: 'Dickie Bush, Daniel Bustamante & Matthew Brown.' },
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
            What Is<br />
            <span className="grad-text">LinkedIn AI LIVE?</span>
          </Display>
        </div>

        {/* Two-column: product box left, 2x3 stat grid right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-center">
          {/* Left — product box */}
          <div className="flex justify-center">
            <img
              src="/images/liai-product-box.png"
              alt="LinkedIn AI LIVE"
              className="w-full max-w-[420px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)]"
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
            Join LinkedIn AI LIVE
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
      q: "Have you tried posting on LinkedIn before but <em>gave up</em> when you weren't seeing results?",
      a: "Chances are, you're just making a few key mistakes (we made them too!) that are holding you back — and once you fix them, you'll have a proven system for using AI to create content that stops the scroll and helps you dominate the algorithm in a fraction of the time.",
    },
    {
      q: "Are you posting regularly but getting <em>minimal engagement</em>, zero leads, and no inbound DMs?",
      a: "We'll teach you the content frameworks and LinkedIn hacks that generate 10x more engagement so you can convert more of your followers into customers, fast.",
    },
    {
      q: "Do you ever wonder, <em>“Who am I to be sharing advice on LinkedIn?”</em>",
      a: "You're not alone! We show you how to position yourself in a way that attracts your exact ideal audience, even if you're not the #1 expert in your field.",
    },
    {
      q: "Do you struggle to find <em>the time</em> to post consistently on LinkedIn?",
      a: "This course will show you how to use AI to create viral-worthy LinkedIn posts in 5–10 minutes — instead of wasting 2–3 hours manually writing every post from scratch.",
    },
    {
      q: "Are you intrigued by AI for content but <em>don't know where to start</em>?",
      a: "We break AI content creation down into simple, learnable steps. You'll gain the skills and confidence to dominate LinkedIn with cutting-edge AI techniques — and you won't start from scratch: we give you a library of 50+ ready-to-use prompts you can plug in right away.",
    },
    {
      q: "Are you worried your content will sound like <em>“AI slop”</em> if you use tools like ChatGPT?",
      a: "Let us give you our proven prompts and frameworks to turn AI into your collaborative writing partner instead of a sloppy Fiverr marketing assistant.",
    },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(122,54,224,0.22)" size={560} style={{ right: '-200px', top: '120px' }} />
      <div className="relative max-w-narrow mx-auto">
        <div className="border-l-[6px] border-butter-500 pl-5 mb-10">
          <Eyebrow className="mb-2">Let's find out.</Eyebrow>
          <Display size="m" className="text-white">Is LinkedIn AI for you?</Display>
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
          <p className="font-serif text-[18px] italic text-ink-200 mb-6">If any of these sound familiar&hellip; then LinkedIn AI was made for you.</p>
          <PrimaryCTA big track="Is This For You">Join LinkedIn AI LIVE</PrimaryCTA>
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
    { num: 1, date: 'Mon Jul 6', title: 'LinkedIn Niche Positioning', desc: 'Nail the niche and angle that make the right people stop and follow — so your profile instantly signals exactly what you do and who you help.', asset: 'Niche Positioning Prompt Pack' },
    { num: 2, date: 'Wed Jul 8', title: 'LinkedIn Profile Secrets', desc: 'Optimize every part of your profile — bio, banner, About section, and skills — so it does the selling for you and turns visitors into followers and leads.', asset: 'Profile Optimization Checklist' },
    { num: 3, date: 'Fri Jul 10', title: 'LinkedIn Content Strategy', desc: 'Generate endless ideas and write hooks that stop the scroll using proven post formats — turning one idea into a finished post in minutes.', asset: 'Content Idea & Hook Generator' },
    { num: 4, date: 'Mon Jul 13', title: "What's Working On LinkedIn In 2026 (And What's Not!)", desc: 'The formats, hooks, and algorithm signals driving reach right now — and the played-out tactics quietly killing your engagement.', asset: '2026 LinkedIn Playbook' },
    { num: 5, date: 'Wed Jul 15', title: 'Grow Your List Using LinkedIn', desc: 'Move readers from your feed into your DMs, your email list, and your offers with a daily networking routine that compounds into real leads.', asset: 'Lead-Gen DM Scripts' },
    { num: 6, date: 'Fri Jul 17', title: 'LinkedIn AI Live Hot Seat', desc: 'Bring your profile, your posts, and your questions. We workshop your specific situation live and tune your system in real time.', asset: 'Live Q&A + Feedback' },
  ]

  return (
    <section id="curriculum" className="bg-paper py-20 md:py-28 px-5 md:px-8" style={{ color: '#15161a' }}>
      <div className="max-w-narrow mx-auto">
        <Eyebrow className="text-rust-500 mb-3 text-center">The 6 live sessions</Eyebrow>
        <Display size="m" className="text-center mb-3" style={{ color: '#15161a' }}>
          Here's what<br /><span className="grad-text">you'll build.</span>
        </Display>
        <p className="font-mono text-[12px] uppercase tracking-caps text-center mb-14" style={{ color: '#5c5b57' }}>
          Six live sessions &middot; 60 minutes each &middot; July 6 &ndash; July 17, 2026
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
                  {/* Module icon tile on the line */}
                  <div className="absolute z-10 left-0 md:left-1/2 md:-translate-x-1/2">
                    <img
                      src={`/images/0${s.num}-session.png`}
                      alt=""
                      className="w-12 h-12 rounded-[14px] shadow-card ring-4 ring-paper"
                    />
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
            You leave with <span className="grad-text">a system that runs</span>.
          </Display>
          <p className="font-serif text-[16px] mb-8" style={{ color: '#5c5b57' }}>
            This isn't self-paced content you buy and forget.
          </p>
          <a
            href={DEFAULT_CTA_URL}
            onClick={() => trackCTA('Curriculum')}
            className="btn-grad inline-block text-white font-mono font-bold uppercase text-[15px] tracking-[0.04em] px-9 py-5 rounded-full"
          >
            Join LinkedIn AI LIVE
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
      name: 'Dickie Bush',
      role: 'Co-Founder, Ship 30 for 30',
      img: '/images/sps/dickie-headshot.png',
      bio: 'Former Wall Street trader at BlackRock turned digital entrepreneur. Creator of Ship 30 for 30 — the fastest-growing cohort-based writing program on the internet — built on the back of writing every day on LinkedIn and X.',
    },
    {
      name: 'Daniel Bustamante',
      role: 'Co-Founder, Velocity',
      img: '/images/daniel-headshot.png',
      bio: "Former CMO of Ship 30 for 30 and Premium Ghostwriting Academy. Helped scale Dickie and Cole's businesses to 10,000+ students, nearly 2,000 coaching clients, and $20M+ in revenue. Now Co-Founder of Velocity, the agency turning creators' audiences into recurring email revenue.",
    },
    {
      name: 'Matthew Brown',
      role: 'Founder, Tribe Digital',
      img: '/images/matthew.jpeg',
      bio: 'Runs Tribe Digital, an X and LinkedIn ghostwriting agency for B2B business owners. Since 2022 he has worked with 100+ business owners and driven nearly $10M in revenue for clients with his "Dealflow System" — proven to 2x qualified leads in 90 days, in just 2 hours per month.',
    },
  ]

  const stats = [
    '250,000+ Followers',
    '$20M+ In Revenue',
    '$10M+ Driven For Clients',
    '2,000+ Coaching Clients',
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
            Taught by creators with<br />
            <span className="grad-text">250,000+ followers.</span>
          </Display>
          <p className="font-serif text-[17px] text-ink-200 leading-[1.55] max-w-[520px] mb-8">
            The team behind Ship 30 for 30, Velocity, and Tribe Digital &mdash; who&rsquo;ve built audiences
            and real businesses on LinkedIn and X.
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

    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   MINI-COURSES — Product box renders
   ═══════════════════════════════════════════════════════════ */
function MiniCourses() {
  const courses = [
    {
      img: '/images/01-session.png',
      eyebrow: 'Mini-Course #1',
      title: 'LinkedIn Positioning System',
      value: '$1,200 Value',
      desc: 'The complete system for positioning yourself so the right people know exactly what you do and why they should follow you. Nail your niche and optimize every part of your profile — bio, banner, About, and skills — so your profile does the selling for you.',
    },
    {
      img: '/images/03-session.png',
      eyebrow: 'Mini-Course #2',
      title: 'LinkedIn Publishing System',
      value: '$800 Value',
      desc: 'The system for publishing consistently without burning out or running out of ideas. Generate endless content ideas, write hooks that stop the scroll, and use proven structures to turn one idea into a finished post in minutes.',
    },
    {
      img: '/images/04-session.png',
      eyebrow: 'Mini-Course #3',
      title: 'LinkedIn Growth System',
      value: '$1,500 Value',
      desc: 'The system for turning posts into an audience and an audience into leads. Learn the daily networking routine, how to engage so the right people notice you, and how to move readers into your DMs, your email list, and your offers.',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(122,54,224,0.20)" size={560} style={{ left: '-200px', top: '60px' }} />
      <Bloom color="rgba(246,131,31,0.18)" size={520} style={{ right: '-200px', bottom: '40px' }} />
      <div className="relative max-w-container mx-auto">
        <Eyebrow className="mb-4">Self-Study Curriculum</Eyebrow>
        <Display size="m" className="text-white max-w-[920px] mb-5">
          3 LinkedIn AI<br /><span className="grad-text">Mini-Courses.</span>
        </Display>
        <p className="font-serif text-[18px] text-ink-200 mb-14 max-w-[720px]">
          Lifetime access to the complete LinkedIn AI self-study system:
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
      icon: '/images/linkedin-visual-brand.png',
      title: 'LinkedIn Visual Brand Templates',
      value: '$300 Value',
      desc: 'A complete LinkedIn visual design system — Canva branding templates (banners, post backgrounds, carousels), a CapCut video template, and a brand style guide system using Gamma — so your visuals look cohesive and professional from day one.',
    },
    {
      num: 2,
      icon: '/images/linkedin-pro-checklist.png',
      title: 'LinkedIn AI Pro Checklist',
      value: '$200 Value',
      desc: "A master checklist that pulls together the most important prompts and frameworks from the entire course — in the exact order to implement them — so you don't get overwhelmed and you start seeing results fast.",
    },
    {
      num: 3,
      icon: '/images/ghostbase_logo.png',
      title: '30-Day Free Trial To Ghostbase',
      value: '$99 Value',
      desc: "Ghostbase is a custom AI model trained on Nicolas Cole's library of content (well over a billion views) and a decade of writing experience. Just describe what you want to write and it generates premium content that sounds like you, built for LinkedIn.",
    },
  ]

  return (
    <section id="bonuses" className="relative overflow-hidden bg-ink-800 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(47,143,255,0.18)" size={560} style={{ right: '-220px', top: '40px' }} />
      <div className="relative max-w-container mx-auto">
        <Eyebrow className="mb-4">Free Bonuses Included</Eyebrow>
        <Display size="m" className="text-white max-w-[1000px] mb-14">
          Three bonuses to<br />
          <span className="grad-text">fast-track your results.</span>
        </Display>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bonuses.map((b) => (
            <div key={b.num} className="bg-ink-900 border border-ink-700 rounded-[16px] p-7 flex flex-col gap-4 transition-shadow hover:shadow-glow">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-caps text-butter-500 mt-2">
                  Bonus #{b.num}
                </span>
                <img src={b.icon} alt="" className="w-16 h-16 md:w-[72px] md:h-[72px] -mt-1 -mr-1 rounded-[14px]" />
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
   PROMPT LIBRARY — LinkedIn AI plug-and-play prompts
   ═══════════════════════════════════════════════════════════ */
function AIWritingSkool() {
  const perks = [
    { title: '50+ proven AI prompts', desc: 'Create posts, carousels, infographics, and video scripts that stop the scroll — across positioning, publishing, and growth.' },
    { title: 'The Hook Template Creator', desc: 'Reverse-engineer any viral post into your own reusable, repeatable format.' },
    { title: '5 proven long-form formats', desc: 'Story Posts, Quick Listicles, Hot Takes, Case Studies, and X-vs-Y comparisons that consistently drive engagement.' },
    { title: 'Refined in our business daily', desc: 'We use these exact prompts every single day — months of testing and refining, done for you.' },
  ]

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-28 px-5 md:px-8">
      <Bloom color="rgba(122,54,224,0.20)" size={580} style={{ left: '-220px', bottom: '20px' }} />
      <Bloom color="rgba(232,69,138,0.16)" size={460} style={{ right: '-180px', top: '40px' }} />
      <div className="relative max-w-container mx-auto">
        <Eyebrow className="mb-4">Included with the bootcamp</Eyebrow>
        <Display size="m" className="text-white mb-4">
          The LinkedIn AI<br /><span className="grad-text">Prompt Library.</span>
        </Display>
        <p className="font-serif text-[18px] text-ink-200 mb-12 max-w-[760px]">
          Every single prompt we use to create viral LinkedIn content &mdash; refined and tested over months,
          and used in our business every single day.{' '}
          <span className="font-mono text-[15px] text-butter-500">$500 value, included free.</span>
        </p>

        <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center">
          <div className="w-full md:w-[42%] flex-shrink-0 flex justify-center">
            <img src="/images/prompt_library.png" alt="LinkedIn AI Prompt Library" className="w-full max-w-[340px] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)]" loading="lazy" />
          </div>
          <div className="flex-1">
            <Eyebrow className="mb-5">Inside, you'll get:</Eyebrow>
            <div className="space-y-5">
              {perks.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <Spark className="w-4 h-4 mt-1 flex-shrink-0 text-accent-pink" />
                  <div>
                    <span className="font-display text-[15px] font-bold text-white">{p.title}:</span>
                    <span className="font-serif text-[15px] text-ink-200"> {p.desc}</span>
                  </div>
                </div>
              ))}
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
    { name: 'The Bootcamp Session Guide', price: '$600' },
    { name: 'LinkedIn AI Plug-And-Play Prompt Library', price: '$500' },
    { name: 'Mini-Course #1: LinkedIn Positioning System', price: '$1,200' },
    { name: 'Mini-Course #2: LinkedIn Publishing System', price: '$800' },
    { name: 'Mini-Course #3: LinkedIn Growth System', price: '$1,500' },
    { name: 'Session Replays', price: '$300' },
    { name: 'Lifetime Access to the Curriculum', price: 'Priceless' },
    { name: 'BONUS: LinkedIn Visual Brand Templates', price: '$300' },
    { name: 'BONUS: LinkedIn AI Pro Checklist', price: '$200' },
    { name: 'BONUS: 30-Day Ghostbase Trial', price: '$99' },
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
          Position &amp; Publish<br />
          Your Way To<br />
          <span className="grad-text">Profit On LinkedIn</span><br />
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
              <span className="font-display font-bold text-[24px] text-white line-through decoration-rust-500 decoration-2">$9,099</span>
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
              Join LinkedIn AI LIVE &rarr;
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
   GUARANTEE + FINAL CTA — Navy gradient card
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
                Stop scrolling &middot; start publishing
              </p>
              <Display size="l" className="text-white mb-6">
                Your brand.<br /><span className="grad-text">This year.</span>
              </Display>
              <p className="font-serif text-[20px] leading-[1.55] text-ink-200 max-w-[560px] mb-9">
                Six live sessions, three mini-courses, a 50+ prompt library, and three fast-action bonuses.
                Lifetime access, and a 7-day no-questions-asked refund if you show up to Session 1 and decide it isn't what you expected.
              </p>
              <a
                href={DEFAULT_CTA_URL}
                onClick={() => trackCTA('Final')}
                className="btn-grad inline-block text-white font-mono font-bold uppercase text-[17px] tracking-[0.04em] px-10 py-5 rounded-full"
              >
                Join LinkedIn AI LIVE
              </a>
              <p className="font-mono text-[14px] text-ink-300 mt-5">
                Live bootcamp begins Monday, July 6, 2026.
              </p>
            </div>

            {/* Product box column */}
            <div className="flex flex-col items-center lg:items-end gap-4 pl-2 pr-4 lg:pr-8">
              <img
                src="/images/liai-product-box.png"
                alt="LinkedIn AI LIVE"
                className="w-full max-w-[300px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)]"
                loading="lazy"
              />
              <p
                className="font-mono font-bold uppercase text-ink-300 whitespace-nowrap"
                style={{ fontSize: 12, letterSpacing: '0.22em' }}
              >
                &mdash; Everything included &mdash;
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
    { q: "How much time do I need per week?", a: "Three 60-minute live sessions per week (Monday, Wednesday, Friday), plus an hour or two to implement between sessions. With the AI prompt library, you can create a viral-worthy LinkedIn post in 5–10 minutes instead of 2–3 hours from scratch." },
    { q: "What if I can't attend live?", a: "Every session is recorded and the replay goes up within hours — and it's yours for life. Showing up live is where the real value is (real-time Q&A and feedback in the Hot Seat), but you'll never fall behind." },
    { q: "I barely have a LinkedIn following. Will this work for me?", a: "Yes. This works for creators at any stage. We show you how to position yourself to attract your exact ideal audience — even if you're not the #1 expert in your field — and how to grow from wherever you are right now." },
    { q: "I don't have time to post consistently. How will I keep up?", a: "That's exactly what the AI prompt library solves. You'll generate endless ideas and turn one idea into a finished, scroll-stopping post in 5–10 minutes — so a consistent publishing cadence finally becomes realistic." },
    { q: "Won't AI-written posts sound like 'AI slop'?", a: "Not the way we teach it. Our prompts and frameworks turn AI into your collaborative writing partner — content that sounds like you, not a generic Fiverr assistant. You do the thinking; AI handles the heavy lifting." },
    { q: "Is this only useful if I'm selling something?", a: "No. Whether you want clients, a new role, partnerships, or simply authority in your niche, the system works the same way: position, publish, and grow so the right opportunities come to you on autopilot." },
    { q: "What is Ghostbase?", a: "Ghostbase is a custom AI model trained on Nicolas Cole's library of content (well over a billion views) and a decade of writing experience. You get a 30-day free trial — just describe what you want to write and it generates premium content that sounds like you." },
    { q: "How long do I have access?", a: "Lifetime. Every replay, mini-course, prompt, template, and bonus is yours forever — including every update we ship to the curriculum." },
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
          <span className="grad-text font-display font-bold text-[18px] tracking-caps-lg">LinkedIn AI LIVE</span>
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
          <span className="grad-text">LinkedIn AI LIVE</span>
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
