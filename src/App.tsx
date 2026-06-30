import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// ==========================================
// 1. MODULE SLOTS (CLEANED SUB-COMPONENTS)
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
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto min-h-[60vh]">
      <h2 className="text-3xl font-light tracking-tight text-white">SkyVibe Climate Engine</h2>
      <p className="text-sm text-slate-400 mt-3 max-w-md font-sans">
        Currently displaying automated atmospheric data mappings for local vector layer: <span className="text-amber-400 font-medium">{voiceCity ? voiceCity : 'Global Default'}</span>.
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
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto min-h-[60vh]">
      <h2 className="text-3xl font-light tracking-tight text-white">VibeNews Intelligence Wire</h2>
      <p className="text-sm text-slate-400 mt-3 max-w-md font-sans">
        Streaming global editorial index parameters configured to filter: <span className="text-cyan-400 font-medium">{voiceTopic ? voiceTopic : 'Top Headlines'}</span>.
      </p>
    </div>
  );
}

// ==========================================
// 2. MINIMAL LUXURY NAVBAR ARCHITECTURE
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
      alert("Acoustic modules are unsupported by this browser architecture.");
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  return (
    <nav className="w-full bg-slate-950/40 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-50 px-8 py-5 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Sleek Corporate Branding */}
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 group">
          <span className="text-white font-semibold tracking-[0.2em] text-sm">NEXUS</span>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider pt-0.5">OS v2</span>
        </Link>

        {/* Minimal Text Links (No buttons here) */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-8 text-xs font-medium tracking-wider uppercase">
            <Link to="/" className={`transition-colors duration-200 ${isActive('/') ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'}`}>
              Overview
            </Link>
            <Link to="/weather" className={`transition-colors duration-200 ${isActive('/weather') ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'}`}>
              Climate
            </Link>
            <Link to="/news" className={`transition-colors duration-200 ${isActive('/news') ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'}`}>
              Intelligence
            </Link>
          </div>

          <span className="h-4 w-[1px] bg-white/10" />

          {/* Premium Clean Action Toggle */}
          <button 
            onClick={toggleVoiceMatrix}
            className={`text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${
              isListening ? 'text-red-400' : 'text-white hover:opacity-80'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
            {isListening ? 'Listening' : 'Voice System'}
          </button>
        </div>

        {/* Clean Menu Burger Trigger */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleVoiceMatrix} className={`text-xs uppercase font-bold tracking-widest ${isListening ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
            [Voice]
          </button>
          
          <button onClick={() => setIsOpen(!isOpen)} className="flex flex-col justify-center items-center w-6 h-5 space-y-1 z-50 focus:outline-none">
            <span className={`h-[1px] w-5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`h-[1px] w-5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-[1px] w-5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 translate-y-[-5px]' : ''}`} />
          </button>
        </div>

      </div>

      {/* Mobile Pop Down */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 border-b border-white/[0.06] flex flex-col p-8 space-y-5 md:hidden text-left shadow-2xl backdrop-blur-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-xs uppercase font-medium tracking-widest text-slate-300 hover:text-white">Central Overview</Link>
          <Link to="/weather" onClick={() => setIsOpen(false)} className="text-xs uppercase font-medium tracking-widest text-slate-300 hover:text-white">Climate Platform</Link>
          <Link to="/news" onClick={() => setIsOpen(false)} className="text-xs uppercase font-medium tracking-widest text-slate-300 hover:text-white">News Intelligence</Link>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// 3. ELEGANT SAASED PORTAL HUB (GSAP OPTIMIZED)
// ==========================================
function DashboardHub() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-hero", { y: 25, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power4.out" });
      gsap.from(".gsap-section", { y: 30, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-start px-6 md:px-16 py-20 md:py-32 antialiased overflow-y-auto relative [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      
      {/* Editorial Tech Ambient Atmosphere Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/[0.03] via-transparent to-transparent pointer-events-none blur-[120px]" />

      <div className="max-w-4xl w-full space-y-28 relative z-10">
        
        {/* Editorial Clean Hero Text */}
        <div className="space-y-6 text-left max-w-3xl">
          <p className="gsap-hero text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase font-mono">
            Platform Overview
          </p>
          <h1 className="gsap-hero text-4xl md:text-6xl font-normal tracking-tight text-white leading-[1.1]">
            A programmatic application layer for contextual streaming data.
          </h1>
          <p className="gsap-hero text-base text-slate-400 max-w-2xl leading-relaxed font-sans font-light">
            Nexus coordinates ambient network inputs to render structural visualization feeds. Tap your mic interface or command the environment using high-level voice instructions.
          </p>
          <div className="gsap-hero pt-4 flex gap-6 text-xs font-semibold tracking-wider uppercase">
            <Link to="/weather" className="text-white hover:underline underline-offset-4">Explore Climate Engine &rarr;</Link>
            <Link to="/news" className="text-slate-400 hover:text-white transition-colors">View Wire Feeds</Link>
          </div>
        </div>

        {/* Clean Modular Info Panel (No button grid borders) */}
        <div className="gsap-section grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pt-12 border-t border-white/[0.08]">
          
          <div className="space-y-3">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">01 // CLIMATE MONITOR</span>
            <h3 className="text-lg font-medium text-white">Atmospheric Telemetry Grid</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Maintains processing lines parsing relative humidity metrics and localization parameters. Fully configured to synthesize and read loaded geographic data back safely via user-controlled strings.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">02 // CONTENT PROCESSING</span>
            <h3 className="text-lg font-medium text-white">Intelligence Matrix Pipeline</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Ingests modern news distributions through direct topic requests. Features automated element overlays avoiding standard structural card boundaries for an immersive browsing workflow.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">03 // VOICE RECOGNITION</span>
            <h3 className="text-lg font-medium text-white">Native Natural Language Parsing</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              A background-monitored intent pipeline powered entirely by local Web Speech API bindings. Parses vocal commands instantly to handle application cross-routing securely.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">04 // INTERPOLATION DESIGN</span>
            <h3 className="text-lg font-medium text-white">Editorial Motion Layout</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Built on production-ready GSAP configurations that avoid unpolished preset animations, prioritizing sleek opacity shifts and typography delays to ensure strict design system guidelines.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN LAYOUT AND CORE ROUTING
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

      {/* Sophisticated subtle notice bar for voice streaming status */}
      {voiceLog && (
        <div className="w-full bg-white/[0.02] border-b border-white/[0.04] px-8 py-3 text-left text-[10px] font-mono tracking-widest text-slate-400 flex items-center gap-3">
          <span className="h-1 w-1 rounded-full bg-indigo-400 animate-ping" />
          LOG // TRANSCRIPT LOGGED: "{voiceLog.toUpperCase()}"
        </div>
      )}

      <Routes>
        <Route path="/" element={<DashboardHub />} />
        <Route path="/weather" element={<WeatherApp voiceCity={cityPayload} />} />
        <Route path="/news" element={<NewsApp voiceTopic={topicPayload} />} />
        <Route 
          path="*" 
          element={
            <div className="flex-1 flex flex-col items-center justify-center text-white min-h-[60vh]">
              <h2 className="text-xs uppercase font-mono tracking-[0.2em] text-slate-500">404 // Node Absent</h2>
              <Link to="/" className="mt-4 text-xs underline underline-offset-4 font-semibold text-white tracking-widest uppercase">
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