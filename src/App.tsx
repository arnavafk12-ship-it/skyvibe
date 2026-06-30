import { useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugin for scroll-driven animations
gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Elegant orchestrated stagger-in on page load
      const tl = gsap.timeline();
      tl.from(".hero-badge", { y: -20, opacity: 0, duration: 0.8, ease: "power4.out" })
        .from(".hero-title", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.6")
        .from(".hero-desc", { y: 30, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.8")
        .from(".hero-cta", { scale: 0.9, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      {/* Structural Abstract Fluid Backdrops */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl space-y-8 relative z-10">
        <span className="hero-badge inline-block text-xs font-mono font-semibold tracking-[0.3em] uppercase bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400">
          Next-Gen Interface Matrix
        </span>
        
        <h1 className="hero-title text-5xl md:text-8xl font-black tracking-tight leading-[1.05] bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          Crafting Digital ecosystems with intent.
        </h1>
        
        <p className="hero-desc text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
          An immersive playground engineered with performant web primitives, glassmorphism layouts, and smooth structural animation systems.
        </p>

        <div className="hero-cta pt-4">
          <button className="bg-white text-slate-950 font-semibold text-xs font-mono tracking-wider px-8 py-4 rounded-xl border border-white hover:bg-transparent hover:text-white transition-colors duration-300 shadow-xl shadow-white/5 uppercase">
            Initialize Core Node
          </button>
        </div>
      </div>

      {/* Decorative Animated Scroll Tracker Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Scroll Down</span>
        <div className="h-8 w-5 rounded-full border border-slate-700 p-1">
          <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full mx-auto animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function GridFeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Trigger elegant reveal animation sequence upon entering viewport track
      gsap.from(".section-header", {
        scrollTrigger: {
          trigger: ".section-header",
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".grid-container",
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-slate-950 text-white py-24 md:py-32 px-6 border-y border-white/[0.04]"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        <div className="section-header space-y-2">
          <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">Architecture Node</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Engineered for absolute fidelity.</h2>
        </div>

        <div className="grid-container grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card bg-gradient-to-br from-white/[0.03] to-white/[0.005] border border-white/[0.06] p-8 rounded-3xl flex flex-col justify-between min-h-[240px] hover:border-indigo-500/30 transition-all duration-300 shadow-xl group">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-mono text-indigo-400 font-bold">01</div>
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">Async Pipeline</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">High performance asset streaming configuration models enabling layout pipelines to compile seamlessly.</p>
            </div>
          </div>

          <div className="feature-card bg-gradient-to-br from-white/[0.03] to-white/[0.005] border border-white/[0.06] p-8 rounded-3xl flex flex-col justify-between min-h-[240px] hover:border-purple-500/30 transition-all duration-300 shadow-xl group">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-mono text-purple-400 font-bold">02</div>
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">Adaptive Vectors</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Dynamic structural sizing properties designed to calibrate perfectly across varied viewport contexts instantly.</p>
            </div>
          </div>

          <div className="feature-card bg-gradient-to-br from-white/[0.03] to-white/[0.005] border border-white/[0.06] p-8 rounded-3xl flex flex-col justify-between min-h-[240px] hover:border-emerald-500/30 transition-all duration-300 shadow-xl group">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono text-emerald-400 font-bold">03</div>
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">Low-Latency Deck</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Optimized runtime memory utilization cycles to sustain high refresh benchmarks on processing layers.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function ImmersiveShowcaseSection() {
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kinetic reveal sequence targeting horizontal canvas components
      gsap.from(".showcase-panel", {
        scrollTrigger: {
          trigger: ".showcase-trigger",
          start: "top 70%",
          toggleActions: "play none none reverse"
        },
        scaleX: 0.95,
        opacity: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power4.out"
      });

      gsap.from(".showcase-text", {
        scrollTrigger: {
          trigger: ".showcase-trigger",
          start: "top 65%",
          toggleActions: "play none none reverse"
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, showcaseRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={showcaseRef}
      className="showcase-trigger w-full bg-slate-950 text-white py-24 md:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        
        <div className="lg:col-span-2 space-y-6">
          <span className="showcase-text text-xs font-mono tracking-widest text-indigo-400 uppercase block">Telemetry Monitor</span>
          <h2 className="showcase-text text-3xl md:text-5xl font-bold tracking-tight leading-tight">Advanced state instrumentation control.</h2>
          <p className="showcase-text text-xs text-slate-400 font-light leading-relaxed">
            Monitor streaming payload pipelines inside our localized diagnostics window. Real-time logging layers map micro-interaction updates directly to structural viewport schemas effortlessly.
          </p>
          <div className="showcase-text pt-2">
            <button className="text-xs font-mono font-bold tracking-wider uppercase border border-white/10 bg-white/5 hover:bg-white hover:text-slate-950 px-5 py-3 rounded-xl transition-all duration-300">
              Access Core Sandbox &rarr;
            </button>
          </div>
        </div>

        {/* Structural Interactive Console Showcase Element */}
        <div className="showcase-panel lg:col-span-3 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] p-6 rounded-3xl shadow-2xl relative min-h-[300px] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-4">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
            <span className="text-[10px] font-mono text-slate-500 ml-2 uppercase tracking-widest">NEXUS_TERMINAL_CORE_LOG</span>
          </div>

          <div className="font-mono text-[11px] text-slate-400 space-y-2 py-6 flex-1">
            <p className="text-indigo-400">[SYSTEM] Syncing global operational environment arrays...</p>
            <p className="text-emerald-400">[SUCCESS] Graphics processing hardware pipeline bound to local layout window.</p>
            <p className="text-slate-500">[LOG] Render thread optimization loop clocked at nominal frame speed vectors.</p>
            <p className="text-amber-400 animate-pulse">[READY] Standing by for streaming text processing parameters...</p>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 border-t border-white/[0.04] pt-4">
            <span>VERSION 4.2.0-STABLE</span>
            <span>METRIC LAYER READY</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default function ApplicationEntrypoint() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 selection:bg-white selection:text-slate-950 antialiased overflow-x-hidden">
        {/* Navigation Track */}
        <nav className="w-full bg-slate-950/60 backdrop-blur-xl border-b border-white/[0.05] fixed top-0 left-0 z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">Ω</div>
              <span className="text-white font-bold text-xs font-mono tracking-widest">NEXUS.OS</span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">SYS_ONLINE // 2026</span>
          </div>
        </nav>

        {/* Section Matrix */}
        <main>
          <HeroSection />
          <GridFeaturesSection />
          <ImmersiveShowcaseSection />
        </main>

        {/* Global Footer Grid */}
        <footer className="w-full bg-slate-950 text-slate-600 font-mono text-[10px] text-center py-8 border-t border-white/[0.04]">
          &copy; {new Date().getFullYear()} NEXUS.OS WORKSPACE FRAMEWORK. ALL RIGHTS RESERVED.
        </footer>
      </div>
    </BrowserRouter>
  );
}