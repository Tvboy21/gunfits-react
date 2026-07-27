'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const SLIDES = [
  { src: '/images/gu1.jpeg', caption: 'ROOTS',             sub: 'Where it all began',       year: '2022' },
  { src: '/images/gu1.jpg',  caption: 'THE VISION',        sub: 'Nairobi, Kenya',            year: '2023' },
  { src: '/images/gu2.webp', caption: 'THE CULTURE',       sub: 'Living the aesthetic',      year: '2023' },
  { src: '/images/gu3.webp', caption: 'THE SOUND',         sub: 'Every fit tells a story',   year: '2024' },
  { src: '/images/gu4.webp', caption: 'AESTHETIC THRIFTS', sub: 'Cut different',             year: '2024' },
  { src: '/images/gu5.webp', caption: 'THE MOVEMENT',      sub: 'Nairobi to the world',      year: '2025' },
];

const TEAM = [
  { name: 'RYAN ODETTE',   handle: '@ryan',    role: 'Founder & Creative Director',  tag: 'FOUNDER', desc: 'The architect behind every drop. Sets the creative vision that keeps Gunfits ahead of the wave.',  img: null },
  { name: 'RANSLEY OGALO', handle: '@ransley', role: 'Website Dev & Tech Lead',       tag: 'TECH',    desc: 'Building the digital world of Gunfits. The mind that turns vision into pixels and code.',          img: null },
  { name: 'PLACEHOLDER',   handle: '@name',    role: 'Head of Operations',            tag: 'OPS',     desc: 'Makes sure every fit ships, every collab lands, and every promise gets kept.',                      img: null },
  { name: 'PLACEHOLDER',   handle: '@name',    role: 'Head of Design',                tag: 'DESIGN',  desc: 'From sketch to stitch — the hands that give Gunfits its unmistakable look.',                       img: null },
];

const STATS = [
  { value: '2022', label: 'YEAR ZERO'      },
  { value: 'NBO',  label: 'ORIGIN'         },
  { value: '100+', label: 'PIECES DROPPED' },
  { value: '∞',    label: 'ATTITUDE'       },
];

const TIMELINE = [
  { year: '2022', title: 'GUNFITS BORN',  desc: 'An idea born from the streets of Nairobi. No boardrooms. No investors. Just vision.' },
  { year: '2023', title: 'FIRST DROP',    desc: 'The first collection drops. The city takes notice. Raw energy meets authentic design.' },
  { year: '2024', title: 'THE MOVEMENT',  desc: 'More than a brand now — a community. Gunfits becomes the heartbeat of Nairobi street culture.' },
  { year: '2025', title: 'THE WORLD',     desc: 'Nairobi to the globe. Aesthetic thrifts goes international.' },
];

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

/* ══════════════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #060401; overflow-x: hidden; }
  button { font-family: inherit; }

  @keyframes bgPulse {
    0%,100% { transform: scale(1.1) translateY(0px); }
    50%      { transform: scale(1.14) translateY(-16px); }
  }
  @keyframes grain {
    0%,100% { transform: translate(0,0); }
    10%     { transform: translate(-2%,-3%); }
    20%     { transform: translate(3%,2%); }
    30%     { transform: translate(-1%,4%); }
    40%     { transform: translate(2%,-1%); }
    50%     { transform: translate(-3%,3%); }
    60%     { transform: translate(1%,-4%); }
    70%     { transform: translate(-2%,1%); }
    80%     { transform: translate(3%,-2%); }
    90%     { transform: translate(-1%,3%); }
  }
  @keyframes dotPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:0.4; transform:scale(1.7); }
  }
  @keyframes lineDraw {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .thumb-strip::-webkit-scrollbar { display:none; }
  .thumb-strip { -ms-overflow-style:none; scrollbar-width:none; }

  .video-slot:hover { border-color: rgba(232,93,4,0.5) !important; }
  .stat-cell:hover  { background: rgba(232,93,4,0.07) !important; }
`;

function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

/* ══════════════════════════════════════════════════════
   FIXED BACKGROUND — gu5.webp, fades out at manifesto
══════════════════════════════════════════════════════ */
function AnimatedBg({ stopRef }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!stopRef?.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.02 }
    );
    observer.observe(stopRef.current);
    return () => observer.disconnect();
  }, [stopRef]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      overflow: 'hidden', background: '#060401',
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.7s ease',
    }}>
      <img
        src="/images/gu5.webp"
        alt=""
        style={{
          position: 'absolute', inset: '-5%',
          width: '110%', height: '110%',
          objectFit: 'cover', objectPosition: 'center 30%',
          filter: 'brightness(0.2) saturate(1.1)',
          animation: 'bgPulse 30s ease-in-out infinite',
        }}
      />
      {/* Orange glow bottom-left */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 10% 80%, rgba(232,93,4,0.1) 0%, transparent 50%)' }} />
      {/* Top-right accent */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 85% 15%, rgba(139,69,19,0.07) 0%, transparent 50%)' }} />
      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 25%, rgba(6,4,1,0.7) 100%)' }} />
      {/* Top + bottom fades */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,4,1,0.5) 0%, transparent 20%, transparent 75%, rgba(6,4,1,0.5) 100%)' }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FILM GRAIN — animated
══════════════════════════════════════════════════════ */
function FilmGrain() {
  return (
    <div style={{
      position: 'fixed', inset: '-50%', zIndex: 9990,
      pointerEvents: 'none', width: '200%', height: '200%',
      opacity: 0.038,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat', backgroundSize: '256px 256px',
      animation: 'grain 0.4s steps(1) infinite',
    }} />
  );
}

/* ══════════════════════════════════════════════════════
   CUSTOM CURSOR — dot + glow trail + VIEW ring on hover
══════════════════════════════════════════════════════ */
function CustomCursor() {
  const [hov, setHov] = useState(false);
  const cx = useMotionValue(-200);
  const cy = useMotionValue(-200);
  const sx  = useSpring(cx, { stiffness: 520, damping: 30 });
  const sy  = useSpring(cy, { stiffness: 520, damping: 30 });
  const tx  = useSpring(cx, { stiffness: 75,  damping: 18 });
  const ty  = useSpring(cy, { stiffness: 75,  damping: 18 });

  useEffect(() => {
    const move = (e) => { cx.set(e.clientX); cy.set(e.clientY); };
    const on   = (e) => { if (e.target.closest('button,a,[data-hover]')) setHov(true); };
    const off  = ()  => setHov(false);
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', on);
    document.addEventListener('mouseout', off);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', on);
      document.removeEventListener('mouseout', off);
    };
  }, []);

  return (
    <>
      {/* Sharp dot */}
      <motion.div style={{ position:'fixed', top:0, left:0, zIndex:99999, pointerEvents:'none', x:sx, y:sy, translateX:'-50%', translateY:'-50%' }}>
        <motion.div
          animate={{ width: hov ? 46 : 8, height: hov ? 46 : 8, backgroundColor: hov ? 'transparent' : '#E85D04', border: hov ? '1.5px solid #E85D04' : 'none' }}
          transition={{ duration: 0.18 }}
          style={{ borderRadius: '50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {hov && <motion.span initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }} style={{ fontSize:7, color:'#E85D04', fontWeight:900, letterSpacing:'0.05em' }}>GO</motion.span>}
        </motion.div>
      </motion.div>
      {/* Glow halo */}
      <motion.div style={{
        position:'fixed', top:0, left:0, zIndex:99998, pointerEvents:'none',
        x:tx, y:ty, translateX:'-50%', translateY:'-50%',
        width:300, height:300, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(232,93,4,0.06) 0%, transparent 65%)',
      }} />
    </>
  );
}

/* ══════════════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════════════ */
function MagneticButton({ children, onClick, style = {} }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 14 });
  const sy = useSpring(y, { stiffness: 160, damping: 14 });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.28);
    y.set((e.clientY - r.top  - r.height / 2) * 0.28);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x:sx, y:sy, background:'none', border:'none', cursor:'none', padding:0, ...style }}
      data-hover>
      {children}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════
   TEXT SCRAMBLE — triggers on scroll into view
══════════════════════════════════════════════════════ */
function ScrambleText({ text, delay = 0 }) {
  const [out, setOut] = useState(text.replace(/\S/g, ' '));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (!inView) return;
    let iter = 0;
    const timer = setTimeout(() => {
      const iv = setInterval(() => {
        setOut(text.split('').map((ch, i) => {
          if (' \n<>/\'".-—'.includes(ch)) return ch;
          if (i < iter) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join(''));
        iter += 0.55;
        if (iter >= text.length) { setOut(text); clearInterval(iv); }
      }, 28);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [inView, text, delay]);

  return <span ref={ref} style={{ fontFamily: "'Arial Black', sans-serif" }}>{out}</span>;
}

/* ══════════════════════════════════════════════════════
   DOUBLE TICKER
══════════════════════════════════════════════════════ */
function Ticker() {
  const words = ['GUNFITS','NAIROBI','CUT DIFFERENT','AESTHETIC THRIFTS','THE MOVEMENT','EST. 2022','GUNTATED'];
  return (
    <div style={{ overflow:'hidden', borderTop:'1px solid rgba(232,93,4,0.12)', borderBottom:'1px solid rgba(232,93,4,0.12)', background:'rgba(6,4,1,0.3)', backdropFilter:'blur(24px)' }}>
      {[false, true].map((rev, ri) => (
        <div key={ri} style={{ overflow:'hidden', borderBottom: ri===0 ? '1px solid rgba(232,93,4,0.1)' : 'none', padding:'13px 0' }}>
          <motion.div
            animate={{ x: rev ? ['-50%','0%'] : ['0%','-50%'] }}
            transition={{ duration: 22, repeat:Infinity, ease:'linear' }}
            style={{ display:'flex', whiteSpace:'nowrap', width:'max-content' }}>
            {[...Array(4)].flatMap(() => words).map((w,i) => (
              <span key={i} style={{ fontSize:12, fontWeight:900, letterSpacing:'0.28em', color: i%2===0?'#E85D04':'rgba(240,235,227,0.12)', padding:'0 36px' }}>
                {w} <span style={{ opacity:0.22 }}>✦</span>
              </span>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SLIDESHOW — AnimatePresence + thumbnails + progress
══════════════════════════════════════════════════════ */
function Slideshow() {
  const [current, setCurrent] = useState(0);
  const [dir,     setDir]     = useState(1);
  const [paused,  setPaused]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 720 : false);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const go = useCallback((idx) => {
    setDir(idx > current ? 1 : -1);
    setCurrent((idx + SLIDES.length) % SLIDES.length);
  }, [current]);

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 5500);
    return () => clearInterval(timerRef.current);
  }, [next, paused]);

  const variants = {
    enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', scale:1.04, opacity:0 }),
    center: { x:'0%', scale:1, opacity:1 },
    exit:   (d) => ({ x: d > 0 ? '-6%'  : '6%',   scale:0.97, opacity:0 }),
  };

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Main frame */}
      <div style={{ position:'relative', width:'100%', aspectRatio: isMobile ? '4/3' : '16/9', overflow:'hidden', background:'#040200', border:'1px solid rgba(232,93,4,0.1)' }}>
        <AnimatePresence custom={dir} initial={false}>
          <motion.div key={current} custom={dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration:0.75, ease:[0.77,0,0.175,1] }}
            style={{ position:'absolute', inset:0 }}>
            <img src={SLIDES[current].src} alt={SLIDES[current].caption}
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(6,4,1,0.94) 0%, rgba(6,4,1,0.2) 45%, transparent 70%)' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(6,4,1,0.35) 0%, transparent 45%)' }} />
          </motion.div>
        </AnimatePresence>

        {/* Bottom caption */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:5, padding:'clamp(20px,3vw,44px)' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16 }}>
            <div>
              <AnimatePresence mode="wait">
                <motion.p key={current+'sub'} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ fontSize:11, letterSpacing:'0.32em', color:'#E85D04', fontWeight:800, marginBottom:8 }}>
                  {SLIDES[current].sub} &nbsp;·&nbsp; {SLIDES[current].year}
                </motion.p>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.h2 key={current+'cap'} initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  transition={{ delay:0.06, duration:0.45 }}
                  style={{ fontSize:'clamp(28px,6vw,88px)', fontWeight:900, color:'#f0ebe3', letterSpacing:'0.03em', margin:0, lineHeight:0.88, fontFamily:"'Arial Black', sans-serif" }}>
                  {SLIDES[current].caption}
                </motion.h2>
              </AnimatePresence>
            </div>
            {/* Ghost slide number */}
            <AnimatePresence mode="wait">
              <motion.div key={current+'num'} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ fontSize:'clamp(52px,10vw,140px)', fontWeight:900, lineHeight:1, flexShrink:0, color:'transparent', WebkitTextStroke:'1px rgba(240,235,227,0.1)', fontFamily:"'Arial Black', sans-serif" }}>
                {String(current+1).padStart(2,'0')}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'rgba(255,255,255,0.05)', zIndex:6 }}>
          <motion.div key={current} initial={{ width:'0%' }} animate={{ width:'100%' }}
            transition={{ duration: paused?0:5.5, ease:'linear' }}
            style={{ height:'100%', background:'#E85D04' }} />
        </div>

        {/* Arrows */}
        {[{ side:'left', fn:prev, icon:'←' }, { side:'right', fn:next, icon:'→' }].map(({ side, fn, icon }) => (
          <motion.button key={side} whileHover={{ background:'#E85D04' }} whileTap={{ scale:0.92 }} onClick={fn}
            style={{ position:'absolute', top:'50%', [side]:20, transform:'translateY(-50%)',
              background:'rgba(232,93,4,0.65)', backdropFilter:'blur(8px)',
              border:'1px solid rgba(232,93,4,0.3)', color:'#fff',
              width:52, height:52, fontSize:20, cursor:'none', zIndex:6,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'background 0.2s', fontWeight:900 }}
            data-hover>
            {icon}
          </motion.button>
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="thumb-strip" style={{ display:'flex', gap:4, marginTop:4, overflowX:'auto' }}>
        {SLIDES.map((s,i) => (
          <motion.button key={i} onClick={() => { go(i); setPaused(true); }} whileHover={{ opacity:1 }}
            style={{ flex:'1 1 0', minWidth: isMobile ? 48 : 60, aspectRatio:'1/1', padding:0, border:'none',
              overflow:'hidden', cursor:'none', background:'#060401',
              opacity: i===current ? 1 : 0.35,
              outline: i===current ? '2px solid #E85D04' : '2px solid transparent',
              outlineOffset: i===current ? 2 : 0,
              transition:'opacity 0.3s, outline 0.3s' }}
            data-hover>
            <img src={s.src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FLIP TEAM CARD — 3D flip on click, photo-ready front
══════════════════════════════════════════════════════ */
function FlipTeamCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:60, filter:'blur(6px)' }}
      animate={inView ? { opacity:1, y:0, filter:'blur(0px)' } : {}}
      transition={{ delay:index*0.12, duration:0.8, ease:[0.22,1,0.36,1] }}
      onClick={() => setFlipped(f => !f)}
      style={{ perspective:1200, cursor:'none' }}
      data-hover>

      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration:0.65, ease:[0.22,1,0.36,1] }}
        style={{ position:'relative', width:'100%', aspectRatio:'3/4', transformStyle:'preserve-3d' }}>

        {/* ── FRONT ── */}
        <div style={{
          position:'absolute', inset:0, backfaceVisibility:'hidden',
          background:'rgba(10,6,2,0.78)', backdropFilter:'blur(24px)',
          border:'1px solid rgba(232,93,4,0.18)', overflow:'hidden',
          display:'flex', flexDirection:'column',
        }}>
          {/* Grid bg */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(232,93,4,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,93,4,0.04) 1px, transparent 1px)', backgroundSize:'32px 32px' }} />
          {/* Scanlines */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)', opacity:0.5 }} />

          {/* Photo area — 70% height */}
          <div style={{ flex:'0 0 70%', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {member.img ? (
              <img src={member.img} alt={member.name}
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', display:'block' }} />
            ) : (
              <>
                <div style={{ fontSize:'clamp(90px,14vw,190px)', fontWeight:900, color:'rgba(232,93,4,0.07)', fontFamily:"'Arial Black', sans-serif", lineHeight:1, userSelect:'none', position:'relative', zIndex:1 }}>
                  {member.name[0]}
                </div>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'8px 14px', background:'rgba(6,4,1,0.82)', fontSize:9, letterSpacing:'0.22em', color:'rgba(232,93,4,0.55)', fontWeight:800, textAlign:'center' }}>
                  PHOTO DROPPING SOON
                </div>
              </>
            )}
            {/* Tag badge */}
            <div style={{ position:'absolute', top:14, right:14, background:'#E85D04', color:'#060401', fontSize:9, fontWeight:900, letterSpacing:'0.2em', padding:'4px 10px', zIndex:3 }}>
              {member.tag}
            </div>
            {/* Ghost index */}
            <div style={{ position:'absolute', bottom: member.img ? 14 : 34, left:14, fontSize:'clamp(42px,7vw,80px)', fontWeight:900, color:'rgba(240,235,227,0.06)', fontFamily:"'Arial Black', sans-serif", lineHeight:1, userSelect:'none', zIndex:2 }}>
              {String(index+1).padStart(2,'0')}
            </div>
            {/* Hover top-line */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(to right, #E85D04, transparent)', zIndex:3 }} />
          </div>

          {/* Info block */}
          <div style={{ flex:1, padding:'20px 22px 22px', position:'relative', zIndex:2, borderTop:'1px solid rgba(232,93,4,0.12)' }}>
            <p style={{ fontSize:10, color:'#E85D04', letterSpacing:'0.22em', fontWeight:800, marginBottom:5 }}>{member.handle}</p>
            <h3 style={{ fontSize:'clamp(15px,2vw,20px)', fontWeight:900, color:'#f0ebe3', letterSpacing:'0.04em', marginBottom:6, fontFamily:"'Arial Black', sans-serif" }}>{member.name}</h3>
            <p style={{ fontSize:10, color:'#6a5a48', letterSpacing:'0.1em', fontWeight:600, textTransform:'uppercase' }}>{member.role}</p>
          </div>

          {/* Flip hint */}
          <div style={{ position:'absolute', bottom:14, right:16, fontSize:9, color:'rgba(240,235,227,0.18)', letterSpacing:'0.15em', fontWeight:700 }}>TAP TO FLIP</div>
          {/* Bottom orange line */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'linear-gradient(to right, #E85D04, transparent)' }} />
        </div>

        {/* ── BACK ── */}
        <div style={{
          position:'absolute', inset:0, backfaceVisibility:'hidden',
          transform:'rotateY(180deg)',
          background:'#E85D04',
          padding:'clamp(28px,4vw,48px)',
          display:'flex', flexDirection:'column', justifyContent:'center', gap:22,
          overflow:'hidden',
        }}>
          {/* Noise */}
          <div style={{ position:'absolute', inset:0, opacity:0.06, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'128px 128px' }} />
          {/* Watermark letter */}
          <div style={{ position:'absolute', bottom:-20, right:-10, fontSize:'clamp(100px,18vw,220px)', fontWeight:900, color:'rgba(6,4,1,0.06)', fontFamily:"'Arial Black', sans-serif", lineHeight:1, userSelect:'none' }}>{member.name[0]}</div>

          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ fontSize:10, color:'rgba(6,4,1,0.45)', letterSpacing:'0.22em', fontWeight:800, marginBottom:8 }}>{member.handle}</p>
            <h3 style={{ fontSize:'clamp(20px,3vw,30px)', fontWeight:900, color:'#060401', fontFamily:"'Arial Black', sans-serif", letterSpacing:'0.03em', lineHeight:1.1, marginBottom:20 }}>{member.name}</h3>
            <div style={{ width:36, height:2, background:'rgba(6,4,1,0.22)', marginBottom:20 }} />
            <p style={{ fontSize:'clamp(13px,1.4vw,16px)', lineHeight:1.85, color:'rgba(6,4,1,0.72)', fontWeight:400 }}>{member.desc}</p>
          </div>

          <p style={{ fontSize:10, color:'rgba(6,4,1,0.35)', letterSpacing:'0.18em', fontWeight:700, position:'relative', zIndex:1 }}>TAP TO FLIP BACK</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   COUNT-UP NUMBER
══════════════════════════════════════════════════════ */
function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });

  useEffect(() => {
    if (!inView) return;
    const n = parseInt(target);
    if (isNaN(n)) return;
    let c = 0;
    const dur = 1800;
    const steps = Math.min(n, 80);
    const stepTime = dur / steps;
    const iv = setInterval(() => {
      c += Math.ceil(n / steps);
      if (c >= n) { setCount(n); clearInterval(iv); }
      else setCount(c);
    }, stepTime);
    return () => clearInterval(iv);
  }, [inView, target]);

  const display = isNaN(parseInt(target)) ? target : count + suffix;
  return <span ref={ref}>{display}</span>;
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function AboutPage() {
  const [loaded, setLoaded]       = useState(false);
  const heroRef                   = useRef(null);
  const manifestoRef              = useRef(null);

  const { scrollYProgress: heroSP } = useScroll({ target:heroRef, offset:['start start','end start'] });
  const heroOpacity = useTransform(heroSP, [0, 0.75], [1, 0]);

  useEffect(() => { setLoaded(true); }, []);

  // responsive helper
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 720 : false);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Shared style tokens */
  const glass   = { background:'rgba(6,4,1,0.32)', backdropFilter:'blur(24px)' };
  const divider = { borderBottom:'1px solid rgba(232,93,4,0.11)' };
  const secPad  = isMobile ? { padding: '48px 6vw' } : { padding:'clamp(100px,14vw,180px) 8vw' };
  const tag     = { fontSize:11, letterSpacing:'0.32em', color:'#E85D04', fontWeight:800, marginBottom:20 };
  const bigHead = { fontSize:'clamp(42px,8vw,110px)', fontWeight:900, lineHeight:0.88, letterSpacing:'-0.03em', margin:0, fontFamily:"'Arial Black', 'Helvetica Neue', sans-serif" };

  return (
    <div style={{ position:'relative', color:'#f0ebe3', fontFamily:"'Helvetica Neue', Arial, sans-serif", overflowX:'hidden', cursor:'none' }}>
      <GlobalStyles />
      <AnimatedBg stopRef={manifestoRef} />
      <FilmGrain />
      <CustomCursor />
      <Navbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section ref={heroRef} style={{ position:'relative', height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '60vh' : '100vh', overflow:'hidden', zIndex:1 }}>

        {/* Bottom fade into sections */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'40%', background:'linear-gradient(to top, rgba(6,4,1,0.88) 0%, transparent 100%)', zIndex:2, pointerEvents:'none' }} />

<motion.div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding: isMobile ? '0 6vw clamp(40px,8vw,80px)' : '0 8vw clamp(60px,10vw,120px)', opacity:heroOpacity }}>

          {/* Live location badge */}
          <motion.div
            initial={{ opacity:0, x:-30 }} animate={{ opacity: loaded?1:0, x: loaded?0:-30 }}
            transition={{ delay:0.3, duration:0.9 }}
            style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:36, border:'1px solid rgba(232,93,4,0.4)', padding:'10px 20px', width:'fit-content', backdropFilter:'blur(12px)', background:'rgba(6,4,1,0.35)' }}>
            <div style={{ width:8, height:8, background:'#E85D04', borderRadius:'50%', animation:'dotPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize:11, letterSpacing:'0.3em', color:'#E85D04', fontWeight:800 }}>NAIROBI, KENYA — EST. 2022</span>
          </motion.div>

          {/* WHO / WE / ARE. — word-by-word drop */}
          <div>
            {[
              { word:'WHO',  color:'#f0ebe3',    stroke:false },
              { word:'WE',   color:'#E85D04',    stroke:false },
              { word:'ARE.', color:'transparent', stroke:true  },
            ].map(({ word, color, stroke }, i) => (
              <div key={word} style={{ overflow:'hidden' }}>
                <motion.div
                  initial={{ y:'110%' }}
                  animate={{ y: loaded?'0%':'110%' }}
                  transition={{ delay:0.5+i*0.14, duration:0.95, ease:[0.22,1,0.36,1] }}>
                  <span style={{
                    display:'block',
                    fontSize:'clamp(70px,15vw,215px)',
                    fontWeight:900, lineHeight:0.88,
                    fontFamily:"'Arial Black', 'Helvetica Neue', sans-serif",
                    letterSpacing:'-0.03em',
                    color,
                    WebkitTextStroke: stroke ? '2px rgba(240,235,227,0.55)' : 'none',
                  }}>
                    {word}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Sub text + scroll hint */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity: loaded?1:0, y: loaded?0:20 }}
            transition={{ delay:1.1, duration:0.8 }}
            style={{ display:'flex', alignItems:'center', gap:48, marginTop:44, flexWrap:'wrap' }}>
            <p style={{ maxWidth:430, fontSize:15, lineHeight:1.9, color:'rgba(240,235,227,0.5)', fontWeight:300, margin:0 }}>
              Born on the streets of Nairobi. Built on self-expression, raw creativity, and the audacity to be different.
            </p>
            <MagneticButton onClick={() => window.scrollTo({ top:window.innerHeight, behavior:'smooth' })}>
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.8, repeat:Infinity }}
                style={{ fontSize:11, letterSpacing:'0.22em', color:'rgba(240,235,227,0.3)', fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                ↓ SCROLL
              </motion.div>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Rotated side label */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity: loaded?1:0 }} transition={{ delay:1.5 }}
          style={{ position:'absolute', right:28, top:'50%', transform:'translateY(-50%) rotate(90deg)', fontSize:9, letterSpacing:'0.5em', color:'rgba(232,93,4,0.35)', fontWeight:800, whiteSpace:'nowrap', zIndex:10 }}>
          GUNFITS © NAIROBI — AESTHETIC THRIFTS
        </motion.div>
      </section>

      {/* ══════════════════ DOUBLE TICKER ══════════════════ */}
      <div style={{ position:'relative', zIndex:1 }}>
        <Ticker />
      </div>

      {/* ══════════════════ STATS ══════════════════ */}
      <section style={{ position:'relative', zIndex:1, ...divider, ...glass }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)' }}>
          {STATS.map((s,i) => (
            <motion.div key={i} className="stat-cell"
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              transition={{ delay:i*0.09, duration:0.7, ease:[0.22,1,0.36,1] }} viewport={{ once:true }}
              style={{ padding:'clamp(44px,7vw,100px) clamp(20px,4vw,56px)', borderRight: i<3?'1px solid rgba(232,93,4,0.11)':'none', position:'relative', overflow:'hidden', transition:'background 0.35s' }}>
              {/* Animated top line */}
              <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }}
                transition={{ delay:0.25+i*0.09, duration:0.9 }} viewport={{ once:true }}
                style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#E85D04', transformOrigin:'left' }} />
              {/* Ghost number */}
              <div style={{ position:'absolute', top:'50%', right:-18, transform:'translateY(-50%)', fontSize:'clamp(70px,12vw,170px)', fontWeight:900, color:'rgba(232,93,4,0.04)', fontFamily:"'Arial Black', sans-serif", userSelect:'none', lineHeight:1 }}>
                {String(i+1).padStart(2,'0')}
              </div>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ fontSize:'clamp(34px,5vw,72px)', fontWeight:900, color:'#E85D04', lineHeight:1, marginBottom:10, fontFamily:"'Arial Black', sans-serif" }}>
                  <ScrambleText text={s.value} delay={i*0.12} />
                </div>
                <div style={{ fontSize:9, letterSpacing:'0.35em', color:'#8a7a68', fontWeight:800 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ STORY ══════════════════ */}
      <section style={{ position:'relative', zIndex:1, ...secPad, ...divider, ...glass, overflow:'hidden' }}>
        {/* Watermark */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'clamp(80px,18vw,280px)', fontWeight:900, color:'rgba(232,93,4,0.025)', fontFamily:"'Arial Black', sans-serif", whiteSpace:'nowrap', userSelect:'none', letterSpacing:'0.1em', zIndex:0 }}>
          GUNTATED
        </div>

        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) minmax(0,1.3fr)', gap: isMobile ? '24px' : 'clamp(60px,10vw,150px)', alignItems:'start' }}>

          {/* Left — big heading with scramble */}
          <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }}
            transition={{ duration:0.9, ease:[0.22,1,0.36,1] }} viewport={{ once:true }}>
            <p style={tag}>// OUR STORY</p>
            <h2 style={bigHead}>
              {[
                { t:'CUT',    c:'#f0ebe3',    s:false },
                { t:'FROM',   c:'#f0ebe3',    s:false },
                { t:'A',      c:'#E85D04',    s:false },
                { t:'DIFF.',  c:'transparent',s:true  },
                { t:'CLOTH.', c:'#f0ebe3',    s:false },
              ].map(({ t,c,s },ii) => (
                <span key={t} style={{ display:'block', color:c, WebkitTextStroke: s?'2px rgba(240,235,227,0.22)':'none' }}>
                  <ScrambleText text={t} delay={ii*0.1} />
                </span>
              ))}
            </h2>
            {/* Drawing line */}
            <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }}
              transition={{ delay:0.55, duration:1.2, ease:[0.22,1,0.36,1] }} viewport={{ once:true }}
              style={{ height:2, background:'linear-gradient(to right, #E85D04, transparent)', marginTop:48, transformOrigin:'left' }} />
          </motion.div>

          {/* Right — paragraphs + pull quote */}
          <motion.div initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }}
            transition={{ duration:0.9, delay:0.2, ease:[0.22,1,0.36,1] }} viewport={{ once:true }}
            style={{ paddingTop: isMobile ? '18px' : 'clamp(20px,5vw,72px)' }}>
            {[
              "Gunfits didn't start in a boardroom — it started in the streets, in bedrooms, on rooftops, and at graffiti walls across Nairobi. A collective of young creatives who refused to wear what everyone else was wearing.",
              "Aesthetic thrifts is not just a tagline — it is a way of life. We hunt for pieces that carry history, rework them with intention, and put them back into the world with a new story. Every drop is a statement.",
              "This is Gunfits. This is Nairobi's voice in fashion. You either get it, or you don't — and that's exactly the point.",
            ].map((txt,i) => (
              <motion.p key={i} initial={{ opacity:0, y:36, filter:'blur(8px)' }}
                whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
                transition={{ delay:0.2+i*0.14, duration:0.8 }} viewport={{ once:true }}
                style={{ fontSize:17, lineHeight:2, color:'#b0a090', marginBottom:30, fontWeight:300 }}>
                {txt}
              </motion.p>
            ))}

            {/* Pull quote */}
            <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }}
              transition={{ delay:0.6, duration:0.8 }} viewport={{ once:true }}
              style={{ position:'relative', marginTop:52, paddingLeft:28 }}>
              <motion.div initial={{ scaleY:0 }} whileInView={{ scaleY:1 }}
                transition={{ delay:0.8, duration:0.6 }} viewport={{ once:true }}
                style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'#E85D04', transformOrigin:'top' }} />
              <p style={{ fontSize:'clamp(20px,2.8vw,34px)', fontWeight:900, color:'#f0ebe3', lineHeight:1.3, margin:0, fontFamily:"'Arial Black', 'Helvetica Neue', sans-serif" }}>
                "We don't follow trends.<br />We set the temperature."
              </p>
              <p style={{ fontSize:10, letterSpacing:'0.25em', color:'#E85D04', marginTop:18, fontWeight:800 }}>— GUNFITS, NAIROBI</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ TIMELINE ══════════════════ */}
      <section style={{ position:'relative', zIndex:1, ...secPad, ...divider, background:'rgba(4,2,1,0.45)', backdropFilter:'blur(24px)', overflow:'hidden' }}>
        <motion.p style={tag} initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>// THE JOURNEY</motion.p>
        <motion.h2 style={{ ...bigHead, marginBottom:'clamp(60px,8vw,100px)', color:'#f0ebe3' }}
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          HOW WE<br /><span style={{ color:'#E85D04' }}>GOT HERE.</span>
        </motion.h2>

        {/* Timeline grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:0, borderTop:'1px solid rgba(232,93,4,0.12)' }}>
          {TIMELINE.map((item,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              transition={{ delay:i*0.12, duration:0.7 }} viewport={{ once:true }}
              style={{ padding:'clamp(28px,4vw,48px) clamp(18px,3vw,36px)', borderRight: i<TIMELINE.length-1 ? '1px solid rgba(232,93,4,0.1)' : 'none', position:'relative' }}>
              {/* Orange dot on top line */}
              <div style={{ position:'absolute', top:-5, left:'clamp(18px,3vw,36px)', width:10, height:10, background:'#E85D04', borderRadius:'50%', boxShadow:'0 0 12px rgba(232,93,4,0.5)' }} />
              <p style={{ fontSize:'clamp(36px,5vw,58px)', fontWeight:900, color:'#E85D04', lineHeight:1, margin:'0 0 14px', fontFamily:"'Arial Black', sans-serif" }}>
                <CountUp target={item.year} />
              </p>
              <h3 style={{ fontSize:13, fontWeight:900, color:'#f0ebe3', letterSpacing:'0.12em', margin:'0 0 12px' }}>{item.title}</h3>
              <p style={{ fontSize:13, color:'#4a3a28', lineHeight:1.75, margin:0 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ GALLERY ══════════════════ */}
      <section style={{ position:'relative', zIndex:1, ...secPad, ...divider, ...glass }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'clamp(36px,5vw,72px)', flexWrap:'wrap', gap:20 }}>
          <div>
            <p style={tag}>// THE GALLERY</p>
            <h2 style={bigHead}>
              <span style={{ display:'block', color:'#f0ebe3' }}>MOMENTS</span>
              <span style={{ display:'block', color:'#E85D04' }}>THAT</span>
              <span style={{ display:'block', color:'transparent', WebkitTextStroke:'2px rgba(240,235,227,0.18)' }}>DEFINE.</span>
            </h2>
          </div>
          <p style={{ fontSize:13, color:'#6a5a48', maxWidth:240, lineHeight:1.75, fontWeight:300 }}>
            Hover to pause · Click thumbnails to jump · Every frame is a chapter.
          </p>
        </div>
        <Slideshow />
      </section>

      {/* ══════════════════ VIDEO ══════════════════ */}
      <section style={{ position:'relative', zIndex:1, ...secPad, ...divider, background:'rgba(4,2,1,0.48)', backdropFilter:'blur(24px)' }}>
        <p style={tag}>// THE REEL</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'clamp(40px,6vw,80px)', flexWrap:'wrap', gap:20 }}>
          <h2 style={bigHead}>
            <span style={{ display:'block', color:'#f0ebe3' }}>SEE IT</span>
            <span style={{ display:'block', color:'#E85D04' }}>MOVE.</span>
          </h2>
          <p style={{ fontSize:13, color:'#6a5a48', maxWidth:240, lineHeight:1.75, fontWeight:300 }}>
            Replace each slot with a &lt;video&gt; tag when your clips are ready.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:12 }}>
          {[
            { num:'01', label:'THE ORIGIN FILM',   desc:'Where it all started — the streets of Nairobi', src:'/videos/clip1.mp4' },
            { num:'02', label:'LATEST COLLECTION', desc:'Cut different. Every piece tells a story.',      src:'/videos/clip2.mp4' },
          ].map((v,i) => (
            <motion.div key={i} className="video-slot"
              initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
              transition={{ delay:i*0.15, duration:0.8 }} viewport={{ once:true }}
              whileHover={{ scale:1.015 }}
              style={{ aspectRatio:'16/10', background:'rgba(10,6,2,0.7)', backdropFilter:'blur(20px)', border:'1px solid rgba(232,93,4,0.15)', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, cursor:'none', transition:'border-color 0.3s' }}
              data-hover>
              {/* Grid */}
              <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(232,93,4,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(232,93,4,0.025) 1px, transparent 1px)', backgroundSize:'44px 44px' }} />
              {/* Scanlines */}
              <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)' }} />

              <div style={{ position:'absolute', top:22, left:24, fontSize:10, letterSpacing:'0.2em', color:'rgba(232,93,4,0.4)', fontWeight:800 }}>{v.num}</div>

              {/* Play button — magnetic */}
              <MagneticButton>
                <motion.div whileHover={{ scale:1.12 }} style={{ width:78, height:78, borderRadius:'50%', border:'1px solid rgba(232,93,4,0.38)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, color:'#E85D04', position:'relative', zIndex:2 }}>▶</motion.div>
              </MagneticButton>

              <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 24px' }}>
                <p style={{ fontSize:12, letterSpacing:'0.2em', fontWeight:900, color:'#f0ebe3', margin:'0 0 8px' }}>{v.label}</p>
                <p style={{ fontSize:12, color:'#6a5a48', margin:0 }}>{v.desc}</p>
              </div>

              {/*
                TO ADD YOUR VIDEO — replace the MagneticButton and div above with:
                <video src={v.src} controls playsInline
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
              */}

              {/* Bottom drawing line */}
              <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }}
                transition={{ delay:0.4+i*0.15, duration:1 }} viewport={{ once:true }}
                style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'linear-gradient(to right, #E85D04, transparent)', transformOrigin:'left' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════ TEAM ══════════════════ */}
      <section style={{ position:'relative', zIndex:1, ...secPad, ...divider, ...glass }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'clamp(40px,6vw,80px)', flexWrap:'wrap', gap:20 }}>
          <div>
            <p style={tag}>// THE ARCHITECTS</p>
            <h2 style={bigHead}>
              <span style={{ display:'block', color:'#f0ebe3' }}>THE ONES</span>
              <span style={{ display:'block', color:'#E85D04' }}>BEHIND</span>
              <span style={{ display:'block', color:'transparent', WebkitTextStroke:'2px rgba(240,235,227,0.18)' }}>IT ALL.</span>
            </h2>
          </div>
          <p style={{ fontSize:13, color:'#6a5a48', maxWidth:240, lineHeight:1.75, fontWeight:300 }}>
            Click any card to flip it and read the story behind the name. Photos dropping soon.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12 }}>
          {TEAM.map((m,i) => <FlipTeamCard key={i} member={m} index={i} />)}
        </div>
      </section>

      {/* ══════════════════ MANIFESTO ══════════════════ */}
      <section ref={manifestoRef} style={{ position:'relative', zIndex:1, overflow:'hidden', padding: isMobile ? '48px 6vw' : 'clamp(140px,20vw,260px) 8vw', background:'#E85D04' }}>
        {/* Noise texture */}
        <div style={{ position:'absolute', inset:0, opacity:0.055, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'128px 128px', mixBlendMode:'overlay' }} />
        {/* Big watermark */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'clamp(80px,22vw,320px)', fontWeight:900, color:'rgba(0,0,0,0.05)', whiteSpace:'nowrap', userSelect:'none', fontFamily:"'Arial Black', sans-serif", letterSpacing:'0.05em' }}>
          GUNFITS
        </div>

        <motion.div initial={{ opacity:0, y:70 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:1, ease:[0.22,1,0.36,1] }} viewport={{ once:true }}
          style={{ position:'relative', zIndex:1, maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:11, letterSpacing:'0.35em', color:'rgba(6,4,1,0.4)', fontWeight:800, marginBottom:52 }}>// THE MANIFESTO</p>
          <h2 style={{ fontSize:'clamp(50px,11vw,150px)', fontWeight:900, color:'#060401', letterSpacing:'-0.03em', lineHeight:0.88, margin:'0 0 52px', fontFamily:"'Arial Black', 'Helvetica Neue', sans-serif" }}>
            <ScrambleText text="WE DON'T" delay={0} /><br />
            <ScrambleText text="FOLLOW"   delay={0.1} /><br />
            <span style={{ color:'rgba(6,4,1,0.2)' }}><ScrambleText text="TRENDS." delay={0.2} /></span><br />
            <ScrambleText text="WE SET THE" delay={0.3} /><br />
            <ScrambleText text="TEMP-"      delay={0.4} /><br />
            <ScrambleText text="ERATURE."   delay={0.5} />
          </h2>
          <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }}
            transition={{ delay:0.8, duration:0.9 }} viewport={{ once:true }}
            style={{ width:56, height:2, background:'rgba(6,4,1,0.2)', margin:'0 auto 24px', transformOrigin:'center' }} />
          <p style={{ fontSize:11, letterSpacing:'0.3em', color:'rgba(6,4,1,0.3)', fontWeight:800 }}>— GUNFITS, NAIROBI — EST. 2022</p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}