import  { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// ==========================================
// 1. MODULE SLOTS (STYLISH VIEWPORTS)
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto min-h-[50vh]">
      <span className="text-5xl mb-4 animate-pulse">☀️</span>
      <h2 className="text-2xl font-bold tracking-tight text-white">Climate Workspace Grid</h2>
      <p className="text-sm text-slate-400 mt-2 font-mono">
        Active Target Vector: <span className="text-amber-400 font-semibold">{voiceCity ? voiceCity.toUpperCase() : 'GLOBAL_CORE'}</span>
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto min-h-[50vh]">
      <span className="text-5xl mb-4">📰</span>
      <h2 className="text-2xl font-bold tracking-tight text-white">Intelligence News Stream</h2>
      <p className="text-sm text-slate-400 mt-2 font-mono">
        Active Index Query: <span className="text-cyan-400 font-semibold">{voiceTopic ? voiceTopic.toUpperCase() : 'TOP_HEADLINES'}</span>
      </p>
    </div>
  );
}

// ==========================================
// 2. RESPONSIVE NAVIGATION WITH ICONS
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
      alert("Voice modules are unsupported by this browser.");
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-50 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand Terminal */}
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            Ω
          </div>
          <span className="text-white font-bold tracking-wider text-sm">NEXUS.OS</span>
        </Link>

        {/* Desktop Links with Structural Icons */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.05]">
            <Link to="/" className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${isActive('/') ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
              <span>🏠</span> Hub
            </Link>
            <Link to="/weather" className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${isActive('/weather') ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
              <span>☀️</span> Climate
            </Link>
            <Link to="/news" className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${isActive('/news') ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
              <span>📰</span> News
            </Link>
          </div>

          {/* Prompt Action Node */}
          <button 
            onClick={toggleVoiceMatrix}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all border flex items-center gap-2 ${
              isListening ? 'bg-red-500 border-red-400 animate-pulse text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <span>🎙️</span> {isListening ? 'Listening...' : 'Voice Control'}
          </button>
        </div>

        {/* Mobile Smooth Action Block */}
        <div className="flex items-center gap-2.5 md:hidden">
          <button 
            onClick={toggleVoiceMatrix}
            className={`p-2.5 rounded-xl border text-sm transition-all active:scale-95 ${isListening ? 'bg-red-500 text-white border-red-400' : 'bg-white/5 text-slate-300 border-white/10'}`}
          >
            🎙️
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 space-y-1 z-50 active:scale-95 transition-transform"
          >
            <span className={`h-0.5 w-5 bg-white transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
            <span className={`h-0.5 w-5 bg-white transition-all duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-0.5 w-5 bg-white transition-all duration-200 ${isOpen ? '-rotate-45 translate-y-[-4px]' : ''}`} />
          </button>
        </div>

      </div>

      {/* Hardware Accelerated Mobile Menu Layer */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-white/[0.08] flex flex-col p-5 space-y-3 md:hidden shadow-2xl transition-all">
          <Link to="/" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-3 ${isActive('/') ? 'bg-white text-slate-950' : 'bg-white/5 text-white'}`}>
            <span>🏠</span> Dashboard Hub
          </Link>
          <Link to="/weather" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-3 ${isActive('/weather') ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-white'}`}>
            <span>☀️</span> SkyVibe Climate
          </Link>
          <Link to="/news" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-3 ${isActive('/news') ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-white'}`}>
            <span>📰</span> Intelligence Wire
          </Link>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// 3. FEATURE PORTAL HUB (GSAP POWERED)
// ==========================================
function DashboardHub() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-hero", { y: 25, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out" });
      gsap.from(".gsap-card", { y: 35, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", delay: 0.3 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-start px-6 md:px-16 py-16 md:py-24 antialiased overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <div className="max-w-5xl w-full space-y-20">
        
        {/* Dynamic Typography Hero Segment */}
        <div className="space-y-4 max-w-3xl">
          <span className="gsap-hero text-xs font-bold tracking-[0.3em] text-indigo-400 uppercase font-mono bg-indigo-500/10 px-3 py-1 rounded-md inline-block">
            Enterprise Workspace
          </span>
          <h1 className="gsap-hero text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            An ecosystem configured to handle real-time streaming intent.
          </h1>
          <p className="gsap-hero text-sm md:text-base text-slate-400 leading-relaxed font-light">
            Nexus integrates responsive web components with browser voice interaction trees. Activate the voice integrator parameter or explore our custom sub-systems directly via the feature terminals listed below.
          </p>
        </div>

        {/* Feature Cards Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          
          <div className="gsap-card bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 shadow-xl relative overflow-hidden group">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">☀️</div>
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">Atmospheric Telemetry Network</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Processes complex localized weather streams and structural matrix variables. Say commands like <span className="text-amber-400 font-medium font-mono">"Weather in Chicago"</span> to auto-navigate and trigger immediate structural audio translations.
              </p>
            </div>
            <Link to="/weather" className="text-xs font-bold tracking-wider uppercase text-white hover:underline underline-offset-4 pt-4 block">Launch Climate Node &rarr;</Link>
          </div>

          <div className="gsap-card bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 shadow-xl relative overflow-hidden group">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl">📰</div>
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">Intelligence News Core</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Aggregates real-time wire coverage across specific international fields. Prompt the system via phrase vectors like <span className="text-cyan-400 font-medium font-mono">"News about robotics"</span> to execute state sorting pipelines cleanly.
              </p>
            </div>
            <Link to="/news" className="text-xs font-bold tracking-wider uppercase text-white hover:underline underline-offset-4 pt-4 block">Launch Wire Feed &rarr;</Link>
          </div>

          <div className="gsap-card bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">🎙️</div>
            <h3 className="text-xl font-bold tracking-tight text-white">Natural Speech Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Powered by native browser Web Speech parameters. Decodes raw acoustic vocal strings to perform routing state operations safely without additional backend layout requests.
            </p>
          </div>

          <div className="gsap-card bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">🌪️</div>
            <h3 className="text-xl font-bold tracking-tight text-white">GSAP Tween Interleaving</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Engineered with clean transform matrix offsets that completely replace standard tracking layouts. Ensures seamless UI transitions on mobile and desktop viewports.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN ENTRY & INTELLIGENT ROUTER
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
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden text-white antialiased selection:bg-white selection:text-black">
      <GlobalNavigationBar onVoiceCommand={handleSmartVoiceParsing} />

      {voiceLog && (
        <div className="w-full bg-indigo-500/10 border-b border-indigo-500/20 px-6 py-2.5 text-center text-[11px] font-mono tracking-wider text-indigo-300 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
          SYSTEM // CAPTURED COMMAND: "{voiceLog.toUpperCase()}"
        </div>
      )}

      <Routes>
        <Route path="/" element={<DashboardHub />} />
        <Route path="/weather" element={<WeatherApp voiceCity={cityPayload} />} />
        <Route path="/news" element={<NewsApp voiceTopic={topicPayload} />} />
        <Route 
          path="*" 
          element={
            <div className="flex-1 flex flex-col items-center justify-center text-white min-h-[50vh]">
              <h2 className="text-xs uppercase font-mono tracking-widest text-slate-500">404 // Node Absent</h2>
              <Link to="/" className="mt-4 text-xs underline underline-offset-4 font-bold tracking-wider uppercase text-white">
                Return Dashboard
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