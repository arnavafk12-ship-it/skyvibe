import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// Mock sub-module placeholders for demonstration; bind to your core code sheets
const WeatherApp = () => <div className="p-8 text-center font-mono text-xs text-amber-400">⚡ Weather Engine Operational Grid.</div>;
const NewsApp = () => <div className="p-8 text-center font-mono text-xs text-cyan-400">📰 News Intelligence Wire Active.</div>;

// ==========================================
// 1. RESPONSIVE HAMBURGER NAVIGATION CORE
// ==========================================
function GlobalNavigationBar({ onVoiceCommand }: { onVoiceCommand: (text: string) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isActive = (path: string) => location.pathname === path;

  // Initialize Speech Recognition Core
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        onVoiceCommand(command);
      };
      recognitionRef.current = rec;
    }
  }, [onVoiceCommand]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API voice parameters are unsupported in this client workspace.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <nav className="w-full bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 px-6 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Core System Branding */}
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
            Ω
          </div>
          <div>
            <span className="text-white font-black tracking-widest text-sm block">NEXUS.OS</span>
            <span className="text-[10px] text-white/40 block font-mono tracking-tight uppercase -mt-0.5">V2 Core Matrix</span>
          </div>
        </Link>

        {/* Desktop Interface & Audio Controls */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
            <Link to="/" className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all ${isActive('/') ? 'bg-white text-slate-950 shadow-md' : 'text-white/60 hover:text-white'}`}>
              🏠 Hub
            </Link>
            <Link to="/weather" className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all ${isActive('/weather') ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-white/60 hover:text-white'}`}>
              ☀️ Climate
            </Link>
            <Link to="/news" className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all ${isActive('/news') ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-white/60 hover:text-white'}`}>
              📰 News
            </Link>
          </div>

          {/* Voice Prompt Interface Button */}
          <button 
            onClick={toggleVoiceInput}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider border transition-all flex items-center gap-2 ${
              isListening 
                ? 'bg-red-500 border-red-400 animate-pulse text-white' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isListening ? '🎙️ LISTENING...' : '🎤 VOICE COMMAND'}
          </button>
        </div>

        {/* Mobile Hamburger Layout Action */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={toggleVoiceInput}
            className={`p-2 rounded-xl text-sm border transition-all ${isListening ? 'bg-red-500 text-white border-red-400' : 'bg-white/5 text-white border-white/10'}`}
          >
            🎤
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50 relative"
            aria-label="Toggle Route Menu"
          >
            <span className={`h-0.5 w-6 bg-white rounded transition-transform duration-300 ${isOpen ? 'transform rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-6 bg-white rounded transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-0.5 w-6 bg-white rounded transition-transform duration-300 ${isOpen ? 'transform -rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

      </div>

      {/* Mobile Routing Menu Drawer */}
      <AnimateMobileMenu isOpen={isOpen} setIsOpen={setIsOpen} isActive={isActive} />
    </nav>
  );
}

function AnimateMobileMenu({ isOpen, setIsOpen, isActive }: { isOpen: boolean, setIsOpen: (o: boolean) => void, isActive: (p: string) => boolean }) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-white/10 flex flex-col p-6 space-y-4 md:hidden shadow-2xl z-40 animate-fadeIn">
      <Link to="/" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-sm font-bold tracking-wider text-center ${isActive('/') ? 'bg-white text-slate-950' : 'bg-white/5 text-white'}`}>
        🏠 CENTRAL HUB TERMINAL
      </Link>
      <Link to="/weather" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-sm font-bold tracking-wider text-center ${isActive('/weather') ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-white'}`}>
        ☀️ SKYVIBE CLIMATE ENGINE
      </Link>
      <Link to="/news" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-sm font-bold tracking-wider text-center ${isActive('/news') ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-white'}`}>
        📰 VIBENEWS INTELLIGENCE WIRE
      </Link>
    </div>
  );
}

// ==========================================
// 2. ELEGANT HUB WITH GSAP ORCHESTRATION
// ==========================================
function DashboardHub() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Text Fade Down
      gsap.from(".gsap-hero-item", {
        y: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });

      // App Target Cards Fade Up
      gsap.from(".gsap-card-item", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.4)",
        delay: 0.3
      });

      // Deep Text Features Section Sequential Slide In
      gsap.from(".gsap-feature-row", {
        x: -30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.6
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex flex-col items-center justify-start p-6 md:p-16 antialiased overflow-y-auto scrollbar-none [scrollbar-width:none]">
      <div className="max-w-5xl w-full space-y-16">
        
        {/* GSAP Managed Hero Block */}
        <div ref={headerRef} className="text-center space-y-4">
          <span className="gsap-hero-item text-xs font-black tracking-[0.3em] text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full inline-block">
            SYSTEM CENTRAL INTERFACE
          </span>
          <h1 className="gsap-hero-item text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-none">
            Orchestrate Your Data Workspace
          </h1>
          <p className="gsap-hero-item text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed font-medium">
            Seamlessly navigate high-fidelity climate analytics or streaming micro-content wire frameworks. Built with a production-grade Web Speech pipeline for zero-latency cross-routing.
          </p>
        </div>

        {/* Primary Interactive Module Nodes */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link to="/weather" className="gsap-card-item group relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 rounded-3xl text-left hover:border-amber-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between min-h-[200px] hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-2xl rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">☀️</div>
              <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">NODE // 01</span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-black tracking-tight group-hover:text-amber-400 transition-colors">Climate Engine</h3>
              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                Analyze relative humidity metrics, dynamic atmospheric coordinates, and execute localized multilingual synthesis feeds.
              </p>
            </div>
          </Link>

          <Link to="/news" className="gsap-card-item group relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 rounded-3xl text-left hover:border-cyan-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between min-h-[200px] hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-2xl rounded-2xl group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">📰</div>
              <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">NODE // 02</span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-black tracking-tight group-hover:text-cyan-400 transition-colors">Intelligence Wire</h3>
              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                Ingest international wire matrices, filter real-time global news indices, and engage shared pop-up element overlays.
              </p>
            </div>
          </Link>
        </div>

        {/* Feature-Dense Documentation Grid */}
        <div ref={featureRef} className="border-t border-white/10 pt-12 space-y-8">
          <h2 className="gsap-feature-row text-xs font-black tracking-[0.2em] text-white/40 uppercase">
            ARCHITECTURAL FRAMEWORK SPECIFICATIONS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="gsap-feature-row space-y-2">
              <h4 className="text-sm font-black tracking-tight text-white/90">🎙️ Speech Recognition Engine</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Utilizes browser-native Web Speech interface configurations to extract text streams directly from your acoustic prompt patterns, triggering semantic commands on-the-fly.
              </p>
            </div>

            <div className="gsap-feature-row space-y-2">
              <h4 className="text-sm font-black tracking-tight text-white/90">🌪️ Tweener Mechanics (GSAP)</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Orchestrates complex animation trees with hardware-accelerated transforms, guaranteeing pristine framerates when entering or leaving micro-content states.
              </p>
            </div>

            <div className="gsap-feature-row space-y-2">
              <h4 className="text-sm font-black tracking-tight text-white/90">🧬 Strict Layout Management</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Engineered completely within structural TypeScript guidelines, leveraging declarative cross-platform routes to guarantee type-safety across all sub-app channels.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN ROUTER & SPEECH LOGIC ROUTER
// ==========================================
export default function ApplicationEntrypoint() {
  const [voiceLog, setVoiceLog] = useState<string>("");

  const handleGlobalVoiceInput = (rawText: string) => {
    const cleanedText = rawText.toLowerCase().trim();
    setVoiceLog(rawText);

    // Dynamic Navigation Route Trigger
    if (cleanedText.includes('weather') || cleanedText.includes('climate') || cleanedText.includes('go to one')) {
      window.location.pathname = '/weather';
    } else if (cleanedText.includes('news') || cleanedText.includes('feed') || cleanedText.includes('go to two')) {
      window.location.pathname = '/news';
    } else if (cleanedText.includes('home') || cleanedText.includes('hub') || cleanedText.includes('back')) {
      window.location.pathname = '/';
    } else {
      console.warn(`Unmapped intent payload received: "${rawText}"`);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans select-none overflow-x-hidden selection:bg-white selection:text-black">
        
        {/* Global Navigation Layout Block */}
        <GlobalNavigationBar onVoiceCommand={handleGlobalVoiceInput} />

        {/* Global Voice Processing Status Banner */}
        {voiceLog && (
          <div className="w-full bg-indigo-600/20 border-b border-indigo-500/30 px-6 py-2 text-center text-[11px] font-mono tracking-wider text-indigo-300 flex items-center justify-center gap-2 animate-fadeIn">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
            LAST CAPTURED INPUT INTENT: "{voiceLog.toUpperCase()}"
          </div>
        )}

        {/* Component Switching Matrix */}
        <Routes>
          <Route path="/" element={<DashboardHub />} />
          <Route path="/weather" element={<WeatherApp />} />
          <Route path="/news" element={<NewsApp />} />
          <Route 
            path="*" 
            element={
              <div className="flex-1 flex flex-col items-center justify-center text-center text-white p-6 bg-slate-950">
                <h2 className="text-xl font-black tracking-widest uppercase">404 - Matrix Boundary Lost</h2>
                <Link to="/" className="mt-4 text-xs bg-white text-slate-950 px-5 py-2 rounded-xl font-black tracking-wider hover:bg-white/90 transition-all">
                  RETURN HOME
                </Link>
              </div>
            } 
          />
        </Routes>

      </div>
    </BrowserRouter>
  );
}