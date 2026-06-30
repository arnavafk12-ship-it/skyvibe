import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// DATA ENGINE DECK (MOCK DATA)
// ============================================================================
const ARCHITECTURE_METRICS = [
  {
    id: "01",
    title: "Asynchronous Asset Pipelines",
    tagline: "ASYNC_THREAD_ALLOCATION",
    desc: "Maintains independent rendering pathways by isolating computation cycles away from primary system display fields.",
    accent: "indigo"
  },
  {
    id: "02",
    title: "Dynamic Grid Interpolation",
    tagline: "LAYOUT_MATRIX_DYNAMICS",
    desc: "Utilizes sub-pixel resolution calculations to dynamically adapt visual structural layers based on incoming payload data.",
    accent: "cyan"
  },
  {
    id: "03",
    title: "High-Fidelity Telemetry Modules",
    tagline: "REAL_TIME_STATE_LOGGING",
    desc: "Tracks state transition sequences locally within micro-interaction scopes to immediately stream component rendering states.",
    accent: "purple"
  }
];

const ANALYTICS_DATA_STREAM = [
  { timestamp: "00:00", vector: "SYS_ALPHA", load: 34, status: "STABLE" },
  { timestamp: "04:00", vector: "SYS_BETA", load: 52, status: "OPTIMAL" },
  { timestamp: "08:00", vector: "SYS_GAMMA", load: 89, status: "HIGH_TRAFFIC" },
  { timestamp: "12:00", vector: "SYS_DELTA", load: 41, status: "STABLE" },
  { timestamp: "16:00", vector: "SYS_EPSILON", load: 63, status: "OPTIMAL" },
  { timestamp: "20:00", vector: "SYS_ZETA", load: 72, status: "MAINTENANCE" }
];

function playSystemChime(frequency: number = 440, duration: number = 0.1) {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Acoustic node initialization blocked by browser context.");
  }
}

// ============================================================================
// MODULE 1: HERO CANVAS DISPLAY LAYER
// ============================================================================
export function HeroStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundBlobRef = useRef<HTMLDivElement>(null);
  const metricsPanelRef = useRef<HTMLDivElement>(null);
  const [internalTick, setInternalTick] = useState<number>(0);

  useEffect(() => {
    const clock = setInterval(() => setInternalTick(t => t + 1), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      tl.fromTo(".system-badge", 
        { opacity: 0, y: -30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );

      tl.fromTo(".char-mask span",
        { opacity: 0, y: 80, rotateX: -40 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.5, stagger: 0.05 },
        "-=0.9"
      );

      tl.fromTo(".hero-description-block",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.2 },
        "-=1.1"
      );

      tl.fromTo(".cta-button-wrapper",
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.4)" },
        "-=0.8"
      );

      tl.fromTo(".architectural-card-node",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
        "-=0.6"
      );

      const coordinateTracker = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const shiftX = (clientX - window.innerWidth / 2) * 0.05;
        const shiftY = (clientY - window.innerHeight / 2) * 0.05;
        
        gsap.to(backgroundBlobRef.current, {
          x: shiftX,
          y: shiftY,
          duration: 2,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", coordinateTracker);
      return () => window.removeEventListener("mousemove", coordinateTracker);
    }, containerRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (metricsPanelRef.current) {
      gsap.fromTo(".metric-row-item", 
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          stagger: 0.1,
          scrollTrigger: {
            trigger: metricsPanelRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-slate-950 text-white min-h-screen relative flex flex-col justify-start items-center overflow-hidden">
      <div ref={backgroundBlobRef} className="absolute inset-0 pointer-events-none z-0 opacity-30 select-none">
        <div className="absolute top-[15%] left-[20%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-6xl w-full px-6 pt-24 pb-32 space-y-24 relative z-10 flex-1 flex flex-col justify-center">
        <div className="space-y-10 text-center max-w-5xl mx-auto">
          <div className="system-badge inline-flex items-center gap-3 bg-white/[0.02] border border-white/[0.08] px-5 py-2.5 rounded-full backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-indigo-300 uppercase font-black">NEXUS ENTERPRISE FRAMEWORK</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.92] text-white">
            <span className="block overflow-hidden char-mask"><span className="block">ENGINEERING</span></span>
            <span className="block overflow-hidden char-mask"><span className="block bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">INTELLIGENT STRUCTS</span></span>
          </h1>

          <p className="hero-description-block text-slate-400 font-light text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
            Execute state synchronization processes through standardized layout primitives. Seamlessly connect atmospheric monitoring matrices with live distribution arrays.
          </p>

          <div className="cta-button-wrapper flex flex-wrap gap-4 justify-center items-center pt-4">
            <Link to="/weather" onClick={() => playSystemChime(587, 0.15)} className="px-8 py-4 bg-white text-slate-950 text-xs font-mono font-black tracking-widest rounded-xl hover:bg-transparent hover:text-white border border-white transition-all duration-300">
              Initialize Weather Terminal
            </Link>
            <Link to="/news" onClick={() => playSystemChime(659, 0.12)} className="px-8 py-4 bg-white/5 text-white text-xs font-mono font-black tracking-widest rounded-xl hover:bg-white/10 border border-white/10 transition-all duration-300">
              Launch Intelligence Wire
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {ARCHITECTURE_METRICS.map((node) => (
            <div key={node.id} className="architectural-card-node group bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] p-8 rounded-3xl flex flex-col justify-between min-h-[280px] shadow-2xl transition-all duration-300">
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-white/5 border border-white/10 rounded text-slate-400">{node.tagline}</span>
                  <span className="text-xs font-mono text-slate-600">#{node.id}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{node.title}</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">{node.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={metricsPanelRef} className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-5">
            <h4 className="text-xs font-mono tracking-widest text-slate-400 uppercase">Live Thread Allocator Log</h4>
            <span className="text-[10px] font-mono text-indigo-400">SYNC INDEX: {internalTick}</span>
          </div>
          <div className="space-y-3 font-mono">
            {ANALYTICS_DATA_STREAM.map((stream, idx) => (
              <div key={idx} className="metric-row-item flex justify-between p-3.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-xs gap-2">
                <span>[{stream.timestamp}] {stream.vector}</span>
                <span className="font-bold text-indigo-400">{stream.load}% // {stream.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODULE 2: WEATHER TERMINAL DECK (DYNAMIC CITY SEARCH CAPABLE)
// ============================================================================
interface WeatherProps {
  voiceCity?: string;
}

export function WeatherApp({ voiceCity }: WeatherProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isPromptActive, setIsPromptActive] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const defaultQueryLocation = voiceCity || 'New York';
    setLoading(true);
    setError("");

    fetch(`https://wttr.in/${encodeURIComponent(defaultQueryLocation)}?format=j1`)
      .then((res) => {
        if (!res.ok) throw new Error("City data sync failed or city context missing.");
        return res.json();
      })
      .then((json) => {
        const current = json.current_condition[0];
        const area = json.nearest_area[0];
        const day = json.weather[0];
        
        const combinedHours = [...json.weather[0].hourly, ...json.weather[1].hourly];
        const processedHourly = combinedHours.slice(0, 4).map((h: any) => {
          const rawHour = parseInt(h.time) / 100;
          return {
            time: `${rawHour === 0 ? '12' : rawHour > 12 ? rawHour - 12 : rawHour} ${rawHour >= 12 ? 'PM' : 'AM'}`,
            temp: h.tempC,
            desc: h.weatherDesc[0].value,
            precip: h.chanceofrain
          };
        });

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
          maxtemp: day.maxtempC,
          mintemp: day.mintempC,
          hourly: processedHourly
        });
        setLoading(false);

        const dialogueUtterance = new SpeechSynthesisUtterance(`Climate data configured for ${area.areaName[0].value}. Temperature reads ${current.temp_C} degrees.`);
        dialogueUtterance.onend = () => {
          setIsPromptActive(true);
          initializeUserVoiceInquiryChannel();
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(dialogueUtterance);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [voiceCity]);

  useEffect(() => {
    if (!loading && data) {
      gsap.fromTo(".weather-cascade-node", 
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, [loading, data]);

  const initializeUserVoiceInquiryChannel = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const sessionRecognition = new SpeechRecognition();
    sessionRecognition.onresult = (event: any) => {
      const parsedTranscript = event.results[0][0].transcript.toLowerCase();
      if (parsedTranscript.includes("yes") || parsedTranscript.includes("sure")) {
        const summaryNarrative = `Upcoming hours look like ${data.hourly[1]?.temp || data.temp} degrees with ${data.hourly[1]?.desc || data.desc}.`;
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(summaryNarrative));
      }
      setIsPromptActive(false);
    };
    recognitionRef.current = sessionRecognition;
    sessionRecognition.start();
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 text-white min-h-[85vh] flex flex-col justify-center">
      {loading ? (
        <p className="text-center font-mono text-xs text-slate-500 animate-pulse">ACQUIRING WEATHER MATRICES...</p>
      ) : error ? (
        <p className="text-center text-red-400 font-mono text-sm border border-red-500/20 bg-red-500/5 p-6 rounded-2xl">🚨 Error: {error}. Make sure the city name is typed correctly.</p>
      ) : (
        <div className="space-y-8 w-full">
          <div className="weather-cascade-node flex justify-between items-end border-b border-white/[0.08] pb-6">
            <div>
              <h2 className="text-4xl font-black">{data.city}</h2>
              <p className="text-xs text-slate-500 mt-1 font-mono">{data.country.toUpperCase()} // STATION_ACTIVE</p>
            </div>
            {isPromptActive && <div className="bg-amber-500 text-slate-950 font-mono text-[10px] px-3 py-1 rounded-full animate-bounce">🎙️ TALK NOW</div>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="weather-cascade-node lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08] p-8 rounded-3xl">
              <span className="text-xs font-mono text-slate-400 capitalize">{data.desc}</span>
              <div className="text-7xl font-black my-4">{data.temp}°C</div>
              <div className="text-xs text-slate-500 font-mono">Feels Like: {data.feelsLike}°C</div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Humidity & Wind</span>
              <div className="text-2xl font-black">{data.humidity}% Humidity</div>
              <div className="text-sm text-slate-400 font-mono">{data.windSpeed} km/h Wind</div>
            </div>
          </div>

          <div className="weather-cascade-node bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase">Timeline Forecast progression</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.hourly.map((hour: any, idx: number) => (
                <div key={idx} className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-xl text-center">
                  <span className="text-xs font-mono text-slate-500 block">{hour.time}</span>
                  <span className="text-2xl font-black block my-1">{hour.temp}°C</span>
                  <span className="text-[10px] text-amber-400 font-mono capitalize block truncate">{hour.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODULE 3: SHARED ELEMENT NEWS MATRICES
// ============================================================================
interface NewsProps {
  voiceTopic?: string;
}

export function NewsApp({ voiceTopic }: NewsProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  
  const cardElementsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const overlayModalContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=6`)
      .then((res) => res.json())
      .then((json) => {
        const structuralQueryToken = voiceTopic ? voiceTopic.toLowerCase() : "";
        let finalFilterResults = json.results;
        
        if (structuralQueryToken && structuralQueryToken !== "top headlines") {
          finalFilterResults = json.results.filter((art: any) => 
            art.title.toLowerCase().includes(structuralQueryToken)
          );
        }
        setArticles(finalFilterResults.length === 0 ? json.results : finalFilterResults);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [voiceTopic]);

  useEffect(() => {
    if (!loading && articles.length > 0) {
      gsap.fromTo(".news-deck-card-node", 
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: "power4.out" }
      );
    }
  }, [loading, articles]);

  const triggerSharedElementTransitionLayout = (articlePayload: any, id: string) => {
    setSelectedArticle(articlePayload);
    setTimeout(() => {
      if (overlayModalContainerRef.current && cardElementsRef.current[id]) {
        const visualCardBoundingBox = cardElementsRef.current[id]!.getBoundingClientRect();
        
        gsap.fromTo(overlayModalContainerRef.current, 
          {
            x: visualCardBoundingBox.left - (window.innerWidth - 640) / 2,
            y: visualCardBoundingBox.top - (window.innerHeight - 520) / 2,
            width: visualCardBoundingBox.width,
            height: visualCardBoundingBox.height,
            opacity: 0.4
          },
          { x: 0, y: 0, width: "100%", height: "auto", opacity: 1, duration: 0.5, ease: "power4.out" }
        );
      }
    }, 0);
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 text-white min-h-[90vh] relative">
      {loading ? (
        <p className="text-center font-mono text-xs text-slate-500 animate-pulse">ACQUIRING ARCHIVAL REPOS...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : (
        <div className="space-y-8 w-full">
          <div className="border-b border-white/[0.08] pb-6">
            <h2 className="text-4xl font-black">Global Wire Monitor</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art: any) => (
              <div 
                key={art.id} 
                ref={(el) => { cardElementsRef.current[art.id] = el; }}
                onClick={() => triggerSharedElementTransitionLayout(art, art.id)}
                className="news-deck-card-node group cursor-pointer bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-48 w-full bg-slate-900 relative">
                  <img src={art.image_url} alt="" className="w-full h-full object-cover opacity-50" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-white line-clamp-2">{art.title}</h4>
                  <span className="text-[9px] font-mono text-cyan-400 block mt-4">{art.news_site.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedArticle && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <div ref={overlayModalContainerRef} className="bg-slate-900 border border-white/[0.08] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
                <div className="h-64 w-full relative">
                  <img src={selectedArticle.image_url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 bg-slate-950 text-white h-8 w-8 rounded-full flex items-center justify-center">✕</button>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-black">{selectedArticle.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedArticle.summary}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GLOBAL CONTROLS NAVBAR WITH MANUAL SEARCH INPUT & SPEECH handshakes
// ============================================================================
interface NavigationControlProps {
  onVoiceIntentIngested: (parsedText: string) => void;
}

function UniversalPlatformNavbar({ onVoiceIntentIngested }: NavigationControlProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAcousticCapturing, setIsAcousticCapturing] = useState<boolean>(false);
  const [textSearchQuery, setTextSearchQuery] = useState<string>("");
  const recognitionInstanceRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionEngine = new SpeechRecognition();
      recognitionEngine.onstart = () => setIsAcousticCapturing(true);
      recognitionEngine.onend = () => setIsAcousticCapturing(false);
      recognitionEngine.onresult = (event: any) => {
        onVoiceIntentIngested(event.results[0][0].transcript);
      };
      recognitionInstanceRef.current = recognitionEngine;
    }
  }, [onVoiceIntentIngested]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textSearchQuery.trim()) {
      onVoiceIntentIngested(`weather in ${textSearchQuery}`);
      setTextSearchQuery("");
    }
  };

  return (
    <nav className="w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <span className="text-white font-black tracking-[0.2em] text-xs font-mono">NEXUS.OS</span>
        </Link>

        {/* INPUT COMPONENT ADDED SECURELY */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs relative hidden sm:block">
          <input 
            type="text"
            value={textSearchQuery}
            onChange={(e) => setTextSearchQuery(e.target.value)}
            placeholder="Type city name + Press Enter..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </form>

        <div className="hidden md:flex items-center gap-6 shrink-0">
          <div className="flex gap-4 font-mono text-[10px]">
            <Link to="/" className="text-slate-400 hover:text-white">HUB</Link>
            <Link to="/weather" className="text-slate-400 hover:text-white">CLIMATE</Link>
            <Link to="/news" className="text-slate-400 hover:text-white">WIRE</Link>
          </div>
          <button onClick={() => recognitionInstanceRef.current?.start()} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono whitespace-nowrap">
            {isAcousticCapturing ? "LISTENING..." : "🎙️ VOICE INPUT"}
          </button>
        </div>

        <div className="flex md:hidden gap-2">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-white flex flex-col justify-center items-center space-y-1">
            <span className="h-0.5 w-4 bg-white" />
            <span className="h-0.5 w-4 bg-white" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 p-5 flex flex-col space-y-3 md:hidden border-b border-white/10">
          <form onSubmit={handleSearchSubmit} className="w-full relative mb-2">
            <input 
              type="text"
              value={textSearchQuery}
              onChange={(e) => setTextSearchQuery(e.target.value)}
              placeholder="Search city directly..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white"
            />
          </form>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-mono text-white p-2 bg-white/5 rounded-lg">HUB WORKSPACE</Link>
          <Link to="/weather" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-mono text-white p-2 bg-white/5 rounded-lg">CLIMATE HUB</Link>
          <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-mono text-white p-2 bg-white/5 rounded-lg">WIRE INFRA</Link>
        </div>
      )}
    </nav>
  );
}

// ============================================================================
// SYSTEM EXECUTION SHELL LAYER
// ============================================================================
function MasterApplicationLayoutShell() {
  const applicationRouteNavigator = useNavigate();
  const [capturedVoiceLog, setCapturedVoiceLog] = useState<string>("");
  const [dynamicCityPayload, setDynamicCityPayload] = useState<string>("");
  const [dynamicTopicPayload, setDynamicTopicPayload] = useState<string>("");

  const processDynamicVoiceInputRoutingPipeline = (rawVoiceText: string) => {
    const cleanedTextString = rawVoiceText.toLowerCase().trim();
    setCapturedVoiceLog(rawVoiceText);

    if (cleanedTextString.includes('weather') || cleanedTextString.includes('climate')) {
      const segments = cleanedTextString.split(' in ');
      if (segments[1]) {
        setDynamicCityPayload(segments[1]);
      } else {
        const words = cleanedTextString.split(' ');
        setDynamicCityPayload(words[words.length - 1]);
      }
      applicationRouteNavigator('/weather');
    } 
    else if (cleanedTextString.includes('news') || cleanedTextString.includes('feed')) {
      const segments = cleanedTextString.split(' about ');
      if (segments[1]) setDynamicTopicPayload(segments[1]);
      applicationRouteNavigator('/news');
    } 
    else if (cleanedTextString.includes('home') || cleanedTextString.includes('hub')) {
      applicationRouteNavigator('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white antialiased">
      <UniversalPlatformNavbar onVoiceIntentIngested={processDynamicVoiceInputRoutingPipeline} />
      
      {capturedVoiceLog && (
        <div className="w-full bg-indigo-500/10 border-b border-indigo-500/15 px-6 py-2 text-center text-[10px] font-mono text-indigo-300 uppercase">
          LOGGED COMMAND: "{capturedVoiceLog}"
        </div>
      )}

      <div className="flex-1 flex flex-col w-full relative z-10">
        <Routes>
          <Route path="/" element={<HeroStage />} />
          <Route path="/weather" element={<WeatherApp voiceCity={dynamicCityPayload} />} />
          <Route path="/news" element={<NewsApp voiceTopic={dynamicTopicPayload} />} />
        </Routes>
      </div>

      <footer className="w-full border-t border-white/[0.04] py-6 text-center text-[9px] font-mono text-slate-600 tracking-widest uppercase">
        &copy; 2026 NEXUS FRAMEWORK LABS.
      </footer>
    </div>
  );
}

export default function FullScaleApplicationWorkspace() {
  return (
    <BrowserRouter>
      <MasterApplicationLayoutShell />
    </BrowserRouter>
  );
}