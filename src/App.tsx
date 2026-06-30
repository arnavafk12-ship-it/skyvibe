import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// ==========================================
// 1. MODULE SLOTS (WEATHER & NEWS COMPONENTS)
// ==========================================
interface SubAppProps {
  voiceCity?: string;
  voiceTopic?: string;
}

function WeatherApp({ voiceCity }: SubAppProps) {
  useEffect(() => {
    if (voiceCity) {
      const speech = new SpeechSynthesisUtterance(`Initiating climate telemetry tracking for ${voiceCity}.`);
      window.speechSynthesis.speak(speech);
    }
  }, [voiceCity]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-3xl m-6 border border-white/5">
      <span className="text-6xl animate-bounce">☀️</span>
      <h2 className="text-2xl font-black text-amber-400 mt-4 uppercase tracking-widest">SkyVibe Climate Engine</h2>
      <p className="text-xs text-white/50 max-w-xs mt-2 font-mono">
        Active Vector Input Location: {voiceCity ? `[${voiceCity.toUpperCase()}]` : '[DEFAULT SYSTEM LAYER]'}
      </p>
    </div>
  );
}

function NewsApp({ voiceTopic }: SubAppProps) {
  useEffect(() => {
    if (voiceTopic) {
      const speech = new SpeechSynthesisUtterance(`Ingesting global news streams regarding ${voiceTopic}.`);
      window.speechSynthesis.speak(speech);
    }
  }, [voiceTopic]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-3xl m-6 border border-white/5">
      <span className="text-6xl">📰</span>
      <h2 className="text-2xl font-black text-cyan-400 mt-4 uppercase tracking-widest">VibeNews Intelligence Wire</h2>
      <p className="text-xs text-white/50 max-w-xs mt-2 font-mono">
        Active Search Index Parameter: {voiceTopic ? `[${voiceTopic.toUpperCase()}]` : '[TOP GLOBAL HEADLINES]'}
      </p>
    </div>
  );
}

// ==========================================
// 2. GLOBAL RESPONSIVE NAVBAR ARCHITECTURE
// ==========================================
interface NavigationProps {
  onVoiceCommand: (text: string) => void;
}

function GlobalNavigationBar({ onVoiceCommand }: NavigationProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isActive = (path: string) => location.pathname === path;

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

  const toggleVoiceMatrix = () => {
    if (!recognitionRef.current) {
      alert("Acoustic synthesis modules are unsupported by this client architecture.");
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  return (
    <nav className="w-full bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 px-6 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white shadow-lg group-hover:scale-105 transition-all">
            Ω
          </div>
          <div>
            <span className="text-white font-black tracking-widest text-sm block">NEXUS.OS</span>
            <span className="text-[10px] text-white/40 block font-mono tracking-tight uppercase -mt-0.5">V2 Core Matrix</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
            <Link to="/" className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all ${isActive('/') ? 'bg-white text-slate-950' : 'text-white/60 hover:text-white'}`}>
              Hub
            </Link>
            <Link to="/weather" className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all ${isActive('/weather') ? 'bg-amber-500 text-slate-950' : 'text-white/60 hover:text-white'}`}>
              Climate
            </Link>
            <Link to="/news" className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all ${isActive('/news') ? 'bg-cyan-500 text-slate-950' : 'text-white/60 hover:text-white'}`}>
              News
            </Link>
          </div>

          <button 
            onClick={toggleVoiceMatrix}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider border transition-all flex items-center gap-2 ${
              isListening ? 'bg-red-500 border-red-400 animate-pulse text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isListening ? '🎙️ LISTENING...' : '🎤 VOICE INTEGRATOR'}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={toggleVoiceMatrix}
            className={`p-2 rounded-xl text-sm border transition-all ${isListening ? 'bg-red-500 text-white border-red-400' : 'bg-white/5 text-white border-white/10'}`}
          >
            🎤
          </button>
          
          <button onClick={() => setIsOpen(!isOpen)} className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50 relative">
            <span className={`h-0.5 w-6 bg-white rounded transition-transform duration-300 ${isOpen ? 'transform rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-6 bg-white rounded transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-0.5 w-6 bg-white rounded transition-transform duration-300 ${isOpen ? 'transform -rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-white/10 flex flex-col p-6 space-y-4 md:hidden shadow-2xl z-40">
          <Link to="/" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-sm font-bold tracking-wider text-center ${isActive('/') ? 'bg-white text-slate-950' : 'bg-white/5 text-white'}`}>
            🏠 CENTRAL DASHBOARD HUB
          </Link>
          <Link to="/weather" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-sm font-bold tracking-wider text-center ${isActive('/weather') ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-white'}`}>
            ☀️ SKYVIBE CLIMATE ENGINE
          </Link>
          <Link to="/news" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-sm font-bold tracking-wider text-center ${isActive('/news') ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-white'}`}>
            📰 VIBENEWS INTELLIGENCE WIRE
          </Link>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// 3. CENTRAL HUB (GSAP POWERED)
// ==========================================
function DashboardHub() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-hero", { y: -30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" });
      gsap.from(".gsap-card", { y: 40, opacity: 0, duration: 0.9, stagger: 0.2, ease: "back.out(1.2)", delay: 0.2 });
      gsap.from(".gsap-feature", { x: -20, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", delay: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex flex-col items-center justify-start p-6 md:p-16 antialiased overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <div className="max-w-5xl w-full space-y-16">
        
        <div className="text-center space-y-4">
          <span className="gsap-hero text-xs font-black tracking-[0.3em] text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full inline-block">
            System Control Console
          </span>
          <h1 className="gsap-hero text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-none">
            Automate Your Operations
          </h1>
          <p className="gsap-hero text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed font-medium">
            A centralized system optimized for streaming high-fidelity intelligence indices. Click the voice microphone element or speak direct context commands to prompt routing parameters dynamically.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link to="/weather" className="gsap-card group bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 rounded-3xl hover:border-amber-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between min-h-[200px] hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-2xl rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">☀️</div>
              <span className="text-[10px] font-mono text-white/30 tracking-widest">NODE // 01</span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-black tracking-tight group-hover:text-amber-400 transition-colors">Climate Module</h3>
              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                Processes atmospheric vectors, measures dynamic tracking indices, and provides instant audio readout confirmations.
              </p>
            </div>
          </Link>

          <Link to="/news" className="gsap-card group bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 rounded-3xl hover:border-cyan-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between min-h-[200px] hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-2xl rounded-2xl group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">📰</div>
              <span className="text-[10px] font-mono text-white/30 tracking-widest">NODE // 02</span>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-black tracking-tight group-hover:text-cyan-400 transition-colors">Intelligence Wire</h3>
              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                Filters real-time international journalistic feeds and presents micro-content summary telemetry arrays inside popups.
              </p>
            </div>
          </Link>
        </div>

        <div className="border-t border-white/10 pt-12 space-y-6">
          <h2 className="gsap-feature text-xs font-black tracking-[0.2em] text-white/40 uppercase">ARCHITECTURE SYSTEM PROTOCOLS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="gsap-feature space-y-2">
              <h4 className="text-sm font-black tracking-tight text-white/90">🎤 Natural Audio Translation</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Extracts string entities directly from live user voice feeds, parsing semantic criteria to execute routes automatically.
              </p>
            </div>
            <div className="gsap-feature space-y-2">
              <h4 className="text-sm font-black tracking-tight text-white/90">🌪️ Tweener Interpolation</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Uses hardware-accelerated GSAP timelines to stagger layout grids smoothly with zero viewport calculations.
              </p>
            </div>
            <div className="gsap-feature space-y-2">
              <h4 className="text-sm font-black tracking-tight text-white/90">🛡️ Strict Pipeline Typings</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Compiled under strict type guidelines to guarantee structural data mapping safety across all viewport configurations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN LAYOUT AND SPEECH MANAGER
// ==========================================
function MainLayoutWrapper() {
  const navigate = useNavigate();
  const [voiceLog, setVoiceLog] = useState<string>("");
  const [cityPayload, setCityPayload] = useState<string>("");
  const [topicPayload, setTopicPayload] = useState<string>("");

  const handleSmartVoiceParsing = (rawText: string) => {
    const cleanedText = rawText.toLowerCase().trim();
    setVoiceLog(rawText);

    if (cleanedText.includes('weather') || cleanedText.includes('climate') || cleanedText.includes('temperature')) {
      let extractedCity = "";
      if (cleanedText.includes(' in ')) extractedCity = cleanedText.split(' in ')[1];
      else if (cleanedText.includes(' at ')) extractedCity = cleanedText.split(' at ')[1];
      else {
        const words = cleanedText.split(' ');
        extractedCity = words[words.length - 1];
      }

      if (extractedCity) {
        const capitalizedCity = extractedCity.charAt(0).toUpperCase() + extractedCity.slice(1);
        setCityPayload(capitalizedCity);
      }
      navigate('/weather');
    } 
    
    else if (cleanedText.includes('news') || cleanedText.includes('feed') || cleanedText.includes('headlines') || cleanedText.includes('articles')) {
      let extractedTopic = "";
      if (cleanedText.includes('about ')) extractedTopic = cleanedText.split('about ')[1];
      else if (cleanedText.includes('for ')) extractedTopic = cleanedText.split('for ')[1];

      if (extractedTopic) {
        const capitalizedTopic = extractedTopic.charAt(0).toUpperCase() + extractedTopic.slice(1);
        setTopicPayload(capitalizedTopic);
      } else {
        setTopicPayload("Top Headlines");
      }
      navigate('/news');
    } 
    
    else if (cleanedText.includes('home') || cleanedText.includes('hub') || cleanedText.includes('back')) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans select-none overflow-x-hidden text-white">
      <GlobalNavigationBar onVoiceCommand={handleSmartVoiceParsing} />

      {voiceLog && (
        <div className="w-full bg-indigo-600/20 border-b border-indigo-500/30 px-6 py-2 text-center text-[10px] font-mono tracking-wider text-indigo-300 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
          INTENT RECORDED // REGISTERED TRANSCRIPT: "{voiceLog.toUpperCase()}"
        </div>
      )}

      <Routes>
        <Route path="/" element={<DashboardHub />} />
        <Route path="/weather" element={<WeatherApp voiceCity={cityPayload} />} />
        <Route path="/news" element={<NewsApp voiceTopic={topicPayload} />} />
        <Route 
          path="*" 
          element={
            <div className="flex-1 flex flex-col items-center justify-center text-white bg-slate-950">
              <h2 className="text-sm font-black tracking-widest uppercase">404 // Boundary Lost</h2>
              <Link to="/" className="mt-4 text-[10px] bg-white text-slate-950 px-4 py-2 rounded-xl font-bold tracking-widest">
                RETURN RESET
              </Link>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default function ApplicationEntrypoint() {
  return (
    <BrowserRouter>
      <MainLayoutWrapper />
    </BrowserRouter>
  );
}