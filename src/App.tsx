import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// ==========================================
// 1. ADVANCED WEATHER METRICS DASHBOARD
// ==========================================
interface SubAppProps {
  voiceCity?: string;
  voiceTopic?: string;
}

function WeatherApp({ voiceCity }: SubAppProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const target = voiceCity || 'New York';
    setLoading(true);
    setError("");

    fetch(`https://wttr.in/${encodeURIComponent(target)}?format=j1`)
      .then((res) => {
        if (!res.ok) throw new Error("Telemetry payload failure");
        return res.json();
      })
      .then((json) => {
        const current = json.current_condition[0];
        const area = json.nearest_area[0];
        const day = json.weather[0];
        
        setData({
          temp: current.temp_C,
          desc: current.weatherDesc[0].value,
          humidity: current.humidity,
          windSpeed: current.windspeedKmh,
          pressure: current.pressure,
          visibility: current.visibility,
          feelsLike: current.FeelsLikeC,
          city: area.areaName[0].value,
          country: area.country[0].value,
          precip: current.precipMM,
          uvIndex: current.uvIndex,
          maxtemp: day.maxtempC,
          mintemp: day.mintempC,
          sunrise: day.astronomy[0].sunrise,
          sunset: day.astronomy[0].sunset
        });
        setLoading(false);

        const readout = `Weather dashboard loaded for ${area.areaName[0].value}.`;
        const speech = new SpeechSynthesisUtterance(readout);
        window.speechSynthesis.speak(speech);
      })
      .catch((err) => {
        console.error(err);
        setError("Vector tracking lost. Verify terminal location query.");
        setLoading(false);
      });
  }, [voiceCity]);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 text-white min-h-[85vh] flex flex-col justify-center">
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-500 tracking-widest">SYNCHRONIZING WEATHER TELEMETRY...</p>
        </div>
      )}

      {error && (
        <div className="text-center">
          <p className="text-sm font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl inline-block">{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-6 w-full">
          
          {/* Dashboard Header Track */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/[0.08] pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase block mb-1">Live Climate Terminal</span>
              <h2 className="text-4xl font-extrabold tracking-tight">{data.city}</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium tracking-wide">{data.country}</p>
            </div>
            <div className="font-mono text-xs text-slate-500">
              NODE // ACTIVE <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block ml-1 animate-pulse" />
            </div>
          </div>

          {/* Core Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Primary Hero Panel */}
            <div className="md:col-span-2 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between min-h-[280px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-7xl opacity-10">☀️</div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">Primary Atmospheric Layer</span>
                <span className="text-xs font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md text-amber-400 capitalize">{data.desc}</span>
              </div>
              <div className="flex items-baseline gap-2 my-6">
                <span className="text-7xl md:text-8xl font-black tracking-tighter">{data.temp}</span>
                <span className="text-3xl md:text-4xl font-light text-slate-400">°C</span>
              </div>
              <div className="flex gap-4 text-xs font-mono text-slate-400">
                <span>Hi: <strong className="text-white">{data.maxtemp}°</strong></span>
                <span>Lo: <strong className="text-white">{data.mintemp}°</strong></span>
                <span>Feels Like: <strong className="text-amber-400">{data.feelsLike}°C</strong></span>
              </div>
            </div>

            {/* Side Analytics Row */}
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-col md:justify-between md:gap-0 md:space-y-4">
              <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Humidity Ratio</span>
                <div className="text-3xl font-bold tracking-tight mt-2">{data.humidity}%</div>
                <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${data.humidity}%` }} />
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Wind Vectors</span>
                <div className="text-3xl font-bold tracking-tight mt-2">{data.windSpeed} <span className="text-xs text-slate-400 font-sans">km/h</span></div>
                <span className="text-[9px] text-slate-500 font-mono mt-2">VELOCITY MAPPER</span>
              </div>
            </div>

          </div>

          {/* Micro Telemetry Multi-Panel */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 block">BAROMETRIC</span>
              <span className="text-sm font-semibold mt-1 block">{data.pressure} hPa</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 block">VISIBILITY</span>
              <span className="text-sm font-semibold mt-1 block">{data.visibility} km</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 block">PRECIPITATION</span>
              <span className="text-sm font-semibold mt-1 block">{data.precip} mm</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 block">UV INDEX</span>
              <span className="text-sm font-semibold mt-1 block text-amber-400">{data.uvIndex}</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl col-span-2 md:col-span-1">
              <span className="text-[10px] font-mono text-slate-500 block">ASTRONOMY</span>
              <span className="text-[11px] font-medium text-slate-300 mt-1 block">🌅 {data.sunrise}</span>
              <span className="text-[11px] font-medium text-slate-300 block">🌇 {data.sunset}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. DEEP NEWS WIRE TERMINAL DASHBOARD
// ==========================================
function NewsApp({ voiceTopic }: SubAppProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    
    fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=6`)
      .then((res) => {
        if (!res.ok) throw new Error("Content stream node failure");
        return res.json();
      })
      .then((json) => {
        const query = voiceTopic ? voiceTopic.toLowerCase() : "";
        let filtered = json.results;
        
        if (query && query !== "top headlines") {
          filtered = json.results.filter((art: any) => 
            art.title.toLowerCase().includes(query) || art.summary.toLowerCase().includes(query)
          );
        }

        if (filtered.length === 0) filtered = json.results;

        setArticles(filtered);
        setLoading(false);

        if (filtered.length > 0) {
          const readout = `Streaming updates regarding ${voiceTopic || 'Global Feeds'}.`;
          const speech = new SpeechSynthesisUtterance(readout);
          window.speechSynthesis.speak(speech);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to map context metrics.");
        setLoading(false);
      });
  }, [voiceTopic]);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 text-white min-h-[85vh] flex flex-col justify-center">
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
          <div className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-500 tracking-widest">INGESTING GLOBAL INTELLIGENCE STREAMS...</p>
        </div>
      )}

      {error && <p className="text-xs font-mono text-red-400 text-center">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6 w-full">
          
          {/* Dashboard Header Track */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/[0.08] pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase block mb-1">Intelligence Wire Control</span>
              <h2 className="text-4xl font-extrabold tracking-tight">Global Wire Monitor</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium tracking-wide">Target Topic Parameter: <span className="text-white font-mono">{voiceTopic ? voiceTopic.toUpperCase() : 'ALL_STREAMS'}</span></p>
            </div>
            <div className="font-mono text-xs text-slate-500">
              BUFFER // COMPILING [{articles.length}] INDEX NODES
            </div>
          </div>

          {/* Deep Cards Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art: any) => (
              <a 
                key={art.id} 
                href={art.url} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex flex-col justify-between bg-gradient-to-br from-white/[0.02] to-white/[0.005] border border-white/[0.06] p-6 rounded-2xl hover:border-cyan-500/30 hover:bg-white/[0.03] transition-all duration-300 shadow-xl min-h-[220px]"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="uppercase tracking-wider text-cyan-400">{art.news_site || 'Global Wire'}</span>
                    <span>{new Date(art.published_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">{art.title}</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-3">{art.summary}</p>
                </div>
                
                <div className="pt-4 border-t border-white/[0.04] flex justify-between items-center text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors">
                  <span>LAUNCH WIRE DECK</span>
                  <span>&rarr;</span>
                </div>
              </a>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. CORE PLATFORM NAVIGATION
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
      alert("Acoustic hardware modules missing.");
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-50 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            Ω
          </div>
          <span className="text-white font-bold tracking-wider text-sm">NEXUS.OS</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.05]">
            <Link to="/" className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${isActive('/') ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
              <span>🏠</span> Hub
            </Link>
            <Link to="/weather" className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${isActive('/weather') ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
              <span>☀️</span> Climate Dashboard
            </Link>
            <Link to="/news" className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${isActive('/news') ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
              <span>📰</span> News Deck
            </Link>
          </div>

          <button 
            onClick={toggleVoiceMatrix}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all border flex items-center gap-2 ${
              isListening ? 'bg-red-500 border-red-400 animate-pulse text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <span>🎙️</span> {isListening ? 'Listening...' : 'Voice Command'}
          </button>
        </div>

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
            <span className={`h-0.5 w-5 bg-white transition-all duration-200 ${isOpen ? '-rotate-45 translate-y-[4px]' : ''}`} />
          </button>
        </div>

      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-white/[0.08] flex flex-col p-5 space-y-3 md:hidden shadow-2xl transition-all">
          <Link to="/" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-3 ${isActive('/') ? 'bg-white text-slate-950' : 'bg-white/5 text-white'}`}>
            <span>🏠</span> Dashboard Hub
          </Link>
          <Link to="/weather" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-3 ${isActive('/weather') ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-white'}`}>
            <span>☀️</span> Climate Dashboard
          </Link>
          <Link to="/news" onClick={() => setIsOpen(false)} className={`p-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-3 ${isActive('/news') ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-white'}`}>
            <span>📰</span> News Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// 4. MAIN CENTRAL PORTAL HUB OVERVIEW
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          
          <div className="gsap-card bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">☀️</div>
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">Atmospheric Telemetry Network</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Processes complex localized weather streams and structural matrix variables. Say commands like <span className="text-amber-400 font-medium font-mono">"Weather in Paris"</span> to auto-navigate and trigger immediate structural audio translations.
              </p>
            </div>
            <Link to="/weather" className="text-xs font-bold tracking-wider uppercase text-white hover:underline underline-offset-4 pt-4 block">Launch Climate Dashboard &rarr;</Link>
          </div>

          <div className="gsap-card bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl">📰</div>
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">Intelligence News Core</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Aggregates real-time wire coverage across specific international fields. Prompt the system via phrase vectors like <span className="text-cyan-400 font-medium font-mono">"News about science"</span> to execute state sorting pipelines cleanly.
              </p>
            </div>
            <Link to="/news" className="text-xs font-bold tracking-wider uppercase text-white hover:underline underline-offset-4 pt-4 block">Launch Wire Deck &rarr;</Link>
          </div>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// 5. GLOBAL EXECUTIVE CORE ENGINE
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