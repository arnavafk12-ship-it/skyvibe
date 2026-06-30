import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Initialize core animation registration metrics
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// DATA ENGINE DECK (MOCK REPOSITORIES FOR CORE CONTINUITY)
// ============================================================================
const ARCHITECTURE_METRICS = [
  {
    id: "01",
    title: "Asynchronous Asset Pipelines",
    tagline: "ASYNC_THREAD_ALLOCATION",
    desc: "Maintains independent rendering pathways by isolating computation cycles away from primary system display fields, driving execution efficiency to optimum thresholds.",
    accent: "indigo"
  },
  {
    id: "02",
    title: "Dynamic Grid Interpolation",
    tagline: "LAYOUT_MATRIX_DYNAMICS",
    desc: "Utilizes sub-pixel resolution calculations to dynamically adapt visual structural layers based on incoming payload data parameters seamlessly across device frames.",
    accent: "cyan"
  },
  {
    id: "03",
    title: "High-Fidelity Telemetry Modules",
    tagline: "REAL_TIME_STATE_LOGGING",
    desc: "Tracks state transition sequences locally within micro-interaction scopes to immediately stream component rendering states to logging terminals.",
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

// ============================================================================
// SYSTEM UTILITIES & TEXT-TO-SPEECH HOOKS
// ============================================================================
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

      // Tracking parallax positioning metrics via desktop mouse displacement fields
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

  // Structural scroll trigger reveal configurations targeting the metrics tracking deck
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
      
      {/* Immersive Structural Fluid Lighting Background Elements */}
      <div ref={backgroundBlobRef} className="absolute inset-0 pointer-events-none z-0 opacity-30 select-none">
        <div className="absolute top-[15%] left-[20%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-[45%] right-[30%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Main Structural Display Layout */}
      <div className="max-w-6xl w-full px-6 pt-24 pb-32 space-y-24 relative z-10 flex-1 flex flex-col justify-center">
        
        <div className="space-y-10 text-center max-w-5xl mx-auto">
          <div className="system-badge inline-flex items-center gap-3 bg-white/[0.02] border border-white/[0.08] px-5 py-2.5 rounded-full backdrop-blur-xl shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-indigo-300 uppercase font-black">NEXUS ENTERPRISE PLATFORM FRAMEWORK v4.9</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.92] select-none text-white">
            <span className="block overflow-hidden char-mask"><span className="block">ENGINEERING</span></span>
            <span className="block overflow-hidden char-mask"><span className="block bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">INTELLIGENT STRUCTS</span></span>
            <span className="block overflow-hidden char-mask"><span className="block">FOR REALTIME FEEDS</span></span>
          </h1>

          <p className="hero-description-block text-slate-400 font-light text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
            Execute state synchronization processes through standardized layout primitives. Seamlessly connect atmospheric monitoring matrices with live distribution arrays using vocal intent capture arrays.
          </p>

          <div className="cta-button-wrapper flex flex-wrap gap-4 justify-center items-center pt-4">
            <Link to="/weather" onClick={() => playSystemChime(587, 0.15)} className="px-8 py-4 bg-white text-slate-950 text-xs font-mono font-black tracking-widest rounded-xl hover:bg-transparent hover:text-white border border-white transition-all duration-300 shadow-2xl uppercase">
              Initialize Weather Terminal
            </Link>
            <Link to="/news" onClick={() => playSystemChime(659, 0.12)} className="px-8 py-4 bg-white/5 text-white text-xs font-mono font-black tracking-widest rounded-xl hover:bg-white/10 border border-white/10 transition-all duration-300 uppercase">
              Launch Intelligence Wire
            </Link>
          </div>
        </div>

        {/* Dynamic Architectural Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {ARCHITECTURE_METRICS.map((node) => (
            <div 
              key={node.id}
              className="architectural-card-node group bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] p-8 rounded-3xl flex flex-col justify-between min-h-[280px] shadow-2xl hover:border-white/20 hover:bg-white/[0.01] transition-all duration-300"
            >
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-white/5 border border-white/10 rounded text-slate-400 uppercase tracking-wider">{node.tagline}</span>
                  <span className="text-xs font-mono text-slate-600 font-bold">#{node.id}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-300">{node.title}</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">{node.desc}</p>
              </div>
              <div className="pt-6 border-t border-white/[0.04] text-[9px] font-mono text-slate-500 flex justify-between items-center tracking-widest uppercase">
                <span>STATUS_VALIDATED</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Live Visualizer Substation */}
        <div ref={metricsPanelRef} className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div className="space-y-1">
              <h4 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full" /> Live Thread Allocator Log
              </h4>
              <p className="text-[10px] font-mono text-slate-600">INTERNAL CYCLES CLOCKED AT SYNC INDEX: {internalTick}</p>
            </div>
            <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded">SYSTEM_STABLE</span>
          </div>
          
          <div className="space-y-3 font-mono">
            {ANALYTICS_DATA_STREAM.map((stream, idx) => (
              <div key={idx} className="metric-row-item flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-xs text-slate-300 hover:bg-white/[0.02] transition-colors gap-2">
                <div className="flex items-center gap-4">
                  <span className="text-slate-600">[{stream.timestamp}]</span>
                  <span className="font-bold text-white tracking-wide">{stream.vector}</span>
                </div>
                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <div className="flex items-center gap-2 w-32 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stream.load}%` }} />
                  </div>
                  <span className="text-right w-12 font-bold">{stream.load}%</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-right ${stream.status === 'HIGH_TRAFFIC' ? 'text-amber-400 bg-amber-500/5' : 'text-slate-400 bg-white/5'}`}>{stream.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// MODULE 2: WEATHER TERMINAL DECK (10-HOUR CLIMATE MONITOR)
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
        if (!res.ok) throw new Error("Telemetry sync failed on primary target cluster.");
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
          precip: current.precipMM,
          uvIndex: current.uvIndex,
          maxtemp: day.maxtempC,
          mintemp: day.mintempC,
          sunrise: day.astronomy[0].sunrise,
          sunset: day.astronomy[0].sunset,
          hourly: processedHourly
        });
        setLoading(false);

        // Core Readout Transmission sequence followed immediately by speech prompt integration hooks
        const narrativeOutput = `Climate diagnostic tracking complete for ${area.areaName[0].value}. The current reading indicates ${current.temp_C} degrees centigrade. Would you like me to parse your comprehensive ten-hour forecast summary?`;
        const dialogueUtterance = new SpeechSynthesisUtterance(narrativeOutput);
        
        dialogueUtterance.onend = () => {
          setIsPromptActive(true);
          playSystemChime(600, 0.1);
          initializeUserVoiceInquiryChannel();
        };
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(dialogueUtterance);
      })
      .catch((err) => {
        setError(err.message || "Localized routing array loss.");
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
    sessionRecognition.continuous = false;
    sessionRecognition.interimResults = false;
    sessionRecognition.lang = 'en-US';

    sessionRecognition.onresult = (event: any) => {
      const parsedTranscript = event.results[0][0].transcript.toLowerCase();
      if (parsedTranscript.includes("yes") || parsedTranscript.includes("sure") || parsedTranscript.includes("ok") || parsedTranscript.includes("yeah")) {
        executeDetailedHourlyVoiceNarration();
      } else {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Telemetry secondary output track canceled."));
      }
      setIsPromptActive(false);
    };

    sessionRecognition.onend = () => setIsPromptActive(false);
    recognitionRef.current = sessionRecognition;
    sessionRecognition.start();
  };

  const executeDetailedHourlyVoiceNarration = () => {
    if (!data) return;
    const summaryNarrative = `Parsing outlook array parameters. Within the upcoming hours, localized temperatures will stabilize near ${data.hourly[1]?.temp || data.temp} degrees, exhibiting continuing trends of ${data.hourly[1]?.desc || data.desc}. Check back periodically for sensor calibrations.`;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(summaryNarrative));
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 text-white min-h-[85vh] flex flex-col justify-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-500 tracking-[0.25em]">ACQUIRING STRATOSPHERIC METRIC FEEDS...</p>
        </div>
      ) : error ? (
        <div className="text-center font-mono text-xs text-red-400 border border-red-500/10 bg-red-500/5 p-6 rounded-2xl max-w-md mx-auto">
          🚨 ERROR // TELEMETRY LINK LOSS: {error}
        </div>
      ) : (
        <div className="space-y-8 w-full">
          
          <div className="weather-cascade-node flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/[0.08] pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase block mb-1.5">Climate Capture Station</span>
              <h2 className="text-4xl font-black tracking-tight">{data.city}</h2>
              <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">{data.country} // METRIC_AXIS_NODE</p>
            </div>
            {isPromptActive && (
              <div className="bg-amber-500 text-slate-950 font-mono font-black text-[10px] px-4 py-2 rounded-full animate-bounce tracking-widest shadow-xl shadow-amber-500/20">
                🎙️ REPLY "YES" VIA MICROPHONE VECTOR NOW
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Primary Metrics Vector Display Card */}
            <div className="weather-cascade-node lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08] p-8 rounded-3xl flex flex-col justify-between min-h-[280px] relative shadow-2xl group hover:border-white/15 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">Primary Atmospheric Layer</span>
                <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded text-amber-400 font-bold uppercase tracking-wider capitalize">{data.desc}</span>
              </div>
              <div className="flex items-baseline gap-2 my-6">
                <span className="text-7xl md:text-8xl font-black tracking-tighter">{data.temp}</span>
                <span className="text-3xl font-light text-slate-500">°C</span>
              </div>
              <div className="flex flex-wrap gap-6 text-xs font-mono text-slate-400 border-t border-white/[0.05] pt-4">
                <span>PEAK BAR: <strong className="text-white">{data.maxtemp}°</strong></span>
                <span>FLOOR BAR: <strong className="text-white">{data.mintemp}°</strong></span>
                <span>THERMAL INDEX: <strong className="text-amber-400">{data.feelsLike}°C</strong></span>
              </div>
            </div>

            {/* Quick Diagnostic Readings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="weather-cascade-node bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl flex flex-col justify-between min-h-[135px] shadow-xl">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Air Moisture Saturation</span>
                <div className="text-3xl font-black tracking-tight mt-1">{data.humidity}%</div>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full" style={{ width: `${data.humidity}%` }} />
                </div>
              </div>
              <div className="weather-cascade-node bg-white/[0.02] border border-white/[0.06] p-6 rounded-2xl flex flex-col justify-between min-h-[135px] shadow-xl">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Anemometer Wind Vector</span>
                <div className="text-3xl font-black tracking-tight mt-1">{data.windSpeed} <span className="text-xs text-slate-500 font-mono font-normal">km/h</span></div>
                <span className="text-[9px] font-mono text-slate-600 mt-2">VELOCITY VECTOR ORIENTATION VALID</span>
              </div>
            </div>

          </div>

          {/* Expanded 10-Hour Outlook Grid Tracking Array */}
          <div className="weather-cascade-node bg-gradient-to-b from-white/[0.01] to-transparent border border-white/[0.05] rounded-3xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <span className="w-1.5 h-3 bg-amber-400 rounded-full" />
              10-Hour Forecast Progression Window Matrix
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.hourly.map((hour: any, idx: number) => (
                <div key={idx} className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-xl flex flex-col justify-between items-center text-center space-y-3 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                  <span className="text-xs font-mono font-bold text-slate-400">{hour.time}</span>
                  <span className="text-3xl font-black text-white">{hour.temp}°C</span>
                  <span className="text-[10px] text-amber-400 font-mono tracking-wide truncate max-w-full capitalize">{hour.desc}</span>
                  <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-2.5 py-0.5 rounded-full">🌧️ {hour.precip}% PROB</span>
                </div>
              ))}
            </div>
          </div>

          {/* Micro Telemetry Framework Metadata Row */}
          <div className="weather-cascade-node grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl font-mono">
              <span className="text-[9px] text-slate-600 block">BAROMETRIC WEIGHT</span>
              <span className="text-xs font-bold mt-1 block text-slate-300">{data.pressure} hPa</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl font-mono">
              <span className="text-[9px] text-slate-600 block">VISIBILITY THRESHOLD</span>
              <span className="text-xs font-bold mt-1 block text-slate-300">{data.visibility} km</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl font-mono">
              <span className="text-[9px] text-slate-600 block">UV INDEX DENSITY</span>
              <span className="text-xs font-bold mt-1 block text-amber-500">{data.uvIndex} SPECTRA</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl font-mono">
              <span className="text-[9px] text-slate-600 block">ASTRO COORDINATES</span>
              <span className="text-[10px] font-bold mt-1 block text-slate-400 truncate">🌅 {data.sunrise} // 🌇 {data.sunset}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODULE 3: SHARED ELEMENT NEWS MATRICES (INTERPOLATED MODALS)
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
    setError("");
    
    fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=6`)
      .then((res) => {
        if (!res.ok) throw new Error("Publisher stream handshake protocol failed.");
        return res.json();
      })
      .then((json) => {
        const structuralQueryToken = voiceTopic ? voiceTopic.toLowerCase() : "";
        let finalFilterResults = json.results;
        
        if (structuralQueryToken && structuralQueryToken !== "top headlines") {
          finalFilterResults = json.results.filter((art: any) => 
            art.title.toLowerCase().includes(structuralQueryToken) || art.summary.toLowerCase().includes(structuralQueryToken)
          );
        }

        setArticles(finalFilterResults.length === 0 ? json.results : finalFilterResults);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to structure inbound news wire streams.");
        setLoading(false);
      });
  }, [voiceTopic]);

  useEffect(() => {
    if (!loading && articles.length > 0) {
      gsap.fromTo(".news-deck-card-node", 
        { opacity: 0, scale: 0.96, y: 35 },
        { opacity: 1, scale: 1, y: 0, duration: 0.75, stagger: 0.1, ease: "power4.out" }
      );
    }
  }, [loading, articles]);

  const triggerSharedElementTransitionLayout = (articlePayload: any, id: string) => {
    playSystemChime(784, 0.08);
    setSelectedArticle(articlePayload);
    
    setTimeout(() => {
      if (overlayModalContainerRef.current && cardElementsRef.current[id]) {
        const visualCardBoundingBox = cardElementsRef.current[id]!.getBoundingClientRect();
        
        // Match starting positions exactly with original card elements for seamless continuation
        gsap.fromTo(overlayModalContainerRef.current, 
          {
            x: visualCardBoundingBox.left - (window.innerWidth - 640) / 2,
            y: visualCardBoundingBox.top - (window.innerHeight - 520) / 2,
            width: visualCardBoundingBox.width,
            height: visualCardBoundingBox.height,
            borderRadius: "16px",
            opacity: 0.4
          },
          {
            x: 0,
            y: 0,
            width: "100%",
            height: "auto",
            borderRadius: "24px",
            opacity: 1,
            duration: 0.5,
            ease: "power4.out"
          }
        );

        // Subtly introduce informational elements inside modal container viewports
        gsap.fromTo(".modal-element-vector", 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.18, ease: "power2.out" }
        );
      }
    }, 0);
  };

  const gracefullyCloseModalDeck = () => {
    if (overlayModalContainerRef.current) {
      gsap.to(overlayModalContainerRef.current, {
        opacity: 0,
        scale: 0.97,
        y: 15,
        duration: 0.28,
        ease: "power3.in",
        onComplete: () => setSelectedArticle(null)
      });
    }
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 text-white min-h-[90vh] relative">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse pt-24">
          <div className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-500 tracking-[0.25em]">ACQUIRING DIRECT ARCHIVAL REPOS...</p>
        </div>
      ) : error ? (
        <p className="text-xs font-mono text-red-400 border border-red-500/20 bg-red-500/5 p-4 rounded-xl max-w-max mx-auto text-center">{error}</p>
      ) : (
        <div className="space-y-8 w-full">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/[0.08] pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase block mb-1.5">Archival Wire Substation</span>
              <h2 className="text-4xl font-black tracking-tight">Global Wire Monitor</h2>
            </div>
            <div className="font-mono text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-md">
              FILTER_METRIC // {voiceTopic ? voiceTopic.toUpperCase() : 'ALL_INDEX_NODES'}
            </div>
          </div>

          {/* Core Structured Dashboard Cards Display Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art: any) => (
              <div 
                key={art.id} 
                ref={el => cardElementsRef.current[art.id] = el}
                onClick={() => triggerSharedElementTransitionLayout(art, art.id)}
                className="news-deck-card-node group cursor-pointer bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] rounded-2xl overflow-hidden hover:border-cyan-500/30 hover:bg-white/[0.01] transition-all duration-300 shadow-2xl flex flex-col h-full"
              >
                <div className="h-48 w-full overflow-hidden bg-slate-900 relative">
                  <img src={art.image_url} alt="" className="w-full h-full object-cover grayscale opacity-45 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out" />
                  <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-[9px] text-cyan-400 font-mono px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest font-black shadow-lg">{art.news_site || 'NODE_STREAM'}</span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 transition-colors group-hover:text-cyan-300 duration-300">{art.title}</h4>
                    <p className="text-xs text-slate-400 font-light line-clamp-3 leading-relaxed">{art.summary}</p>
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase flex justify-between items-center border-t border-white/[0.05] pt-4 font-black tracking-wider">
                    <span>EXPLORE INTEL DISPATCH</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interpolated Shared Element Overlay Modal Element */}
          {selectedArticle && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div 
                ref={overlayModalContainerRef} 
                className="bg-slate-900 border border-white/[0.08] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto"
              >
                <div className="h-72 w-full relative">
                  <img src={selectedArticle.image_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <button 
                    onClick={gracefullyCloseModalDeck} 
                    className="absolute top-4 right-4 bg-slate-950/80 border border-white/10 text-white h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm hover:bg-white hover:text-black transition-all shadow-2xl active:scale-90"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-8 space-y-5">
                  <div className="modal-element-vector flex justify-between items-center text-xs font-mono text-slate-400">
                    <span className="text-cyan-400 uppercase font-black tracking-widest">{selectedArticle.news_site}</span>
                    <span>{new Date(selectedArticle.published_at).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="modal-element-vector text-xl font-black tracking-tight text-white leading-snug">{selectedArticle.title}</h3>
                  <p className="modal-element-vector text-xs text-slate-300 leading-relaxed font-light">{selectedArticle.summary}</p>
                  
                  <div className="modal-element-vector pt-5 border-t border-white/[0.06] flex justify-end">
                    <a 
                      href={selectedArticle.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-white text-slate-950 text-[10px] font-mono font-black tracking-widest px-6 py-3.5 rounded-xl hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all uppercase"
                    >
                      Launch Publisher Stream Channel &rarr;
                    </a>
                  </div>
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
// PLATFORM FRAMEWORK NAVIGATION CONTROL SYSTEM (FULLY RESPONSIVE HAMBURGER INFRA)
// ============================================================================
interface NavigationControlProps {
  onVoiceIntentIngested: (parsedText: string) => void;
}

function UniversalPlatformNavbar({ onVoiceIntentIngested }: NavigationControlProps) {
  const currentRouteLocation = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAcousticCapturing, setIsAcousticCapturing] = useState<boolean>(false);
  const recognitionInstanceRef = useRef<any>(null);

  const determineActiveRouteStatus = (targetPath: string) => currentRouteLocation.pathname === targetPath;

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionEngine = new SpeechRecognition();
      recognitionEngine.continuous = false;
      recognitionEngine.interimResults = false;
      recognitionEngine.lang = 'en-US';

      recognitionEngine.onstart = () => {
        setIsAcousticCapturing(true);
        playSystemChime(523, 0.08);
      };
      
      recognitionEngine.onend = () => setIsAcousticCapturing(false);
      
      recognitionEngine.onresult = (event: any) => {
        const dynamicCommandText = event.results[0][0].transcript;
        onVoiceIntentIngested(dynamicCommandText);
      };
      
      recognitionInstanceRef.current = recognitionEngine;
    }
  }, [onVoiceIntentIngested]);

  const triggerVoiceCaptureModule = () => {
    if (!recognitionInstanceRef.current) {
      alert("Acoustic components unavailable or blocked on this system channel.");
      return;
    }
    if (isAcousticCapturing) {
      recognitionInstanceRef.current.stop();
    } else {
      recognitionInstanceRef.current.start();
    }
  };

  return (
    <nav className="w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50 px-6 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Core Brand Matrix Vector Anchor */}
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-sm transition-transform group-hover:rotate-12 duration-300">Ω</div>
          <span className="text-white font-black tracking-[0.2em] text-xs font-mono">NEXUS.OS</span>
        </Link>

        {/* Desktop Device Context Route Bar Configurations */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.05]">
            <Link to="/" className={`px-4 py-2 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase transition-all ${determineActiveRouteStatus('/') ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>CORE HUB</Link>
            <Link to="/weather" className={`px-4 py-2 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase transition-all ${determineActiveRouteStatus('/weather') ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>CLIMATE NODE</Link>
            <Link to="/news" className={`px-4 py-2 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase transition-all ${determineActiveRouteStatus('/news') ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>WIRE FEED</Link>
          </div>

          <button 
            onClick={triggerVoiceCaptureModule}
            className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black tracking-wider uppercase transition-all border flex items-center gap-2.5 ${
              isAcousticCapturing ? 'bg-red-500 border-red-400 text-white animate-pulse' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <span>🎙️</span> {isAcousticCapturing ? 'LISTENING_FEED...' : 'VOICE_INPUT_CONTROL'}
          </button>
        </div>

        {/* Mobile Device Viewport Navigation Controls Grid */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={triggerVoiceCaptureModule} 
            className={`p-2.5 rounded-xl border text-xs transition-all active:scale-90 ${isAcousticCapturing ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-white/5 text-slate-300 border-white/10'}`}
          >
            🎙️
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 space-y-1 relative"
          >
            <span className={`h-0.5 w-4 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`h-0.5 w-4 bg-white transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-0.5 w-4 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-[3.5px]' : ''}`} />
          </button>
        </div>

      </div>

      {/* Responsive Mobile Navigation Drawer Overlay Grid Section */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-white/[0.08] flex flex-col p-5 space-y-3 md:hidden shadow-2xl z-50 animate-fade-in">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className={`p-3.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 ${determineActiveRouteStatus('/') ? 'bg-white text-slate-950' : 'bg-white/5 text-white'}`}
          >
            🏠 SYSTEM CORE WORKSPACE
          </Link>
          <Link 
            to="/weather" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className={`p-3.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 ${determineActiveRouteStatus('/weather') ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-white'}`}
          >
            ☀️ CLIMATE MONITOR HUB
          </Link>
          <Link 
            to="/news" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className={`p-3.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 ${determineActiveRouteStatus('/news') ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-white'}`}
          >
            📰 JOURNAL WIRE INFRA
          </Link>
        </div>
      )}
    </nav>
  );
}

// ============================================================================
// MASTER ARCHITECTURE WORKSPACE WRAPPER SHELL
// ============================================================================
function MasterApplicationLayoutShell() {
  const applicationRouteNavigator = useNavigate();
  const [capturedVoiceLog, setCapturedVoiceLog] = useState<string>("");
  const [dynamicCityPayload, setDynamicCityPayload] = useState<string>("");
  const [dynamicTopicPayload, setDynamicTopicPayload] = useState<string>("");

  const processDynamicVoiceInputRoutingPipeline = (rawVoiceText: string) => {
    const cleanedTextString = rawVoiceText.toLowerCase().trim();
    setCapturedVoiceLog(rawVoiceText);

    if (cleanedTextString.includes('weather') || cleanedTextString.includes('climate') || cleanedTextString.includes('temperature')) {
      let pinpointedCity = "";
      if (cleanedTextString.includes(' in ')) {
        pinpointedCity = cleanedTextString.split(' in ')[1];
      } else {
        const componentsArray = cleanedTextString.split(' ');
        pinpointedCity = componentsArray[componentsArray.length - 1];
      }
      if (pinpointedCity) {
        setDynamicCityPayload(pinpointedCity.charAt(0).toUpperCase() + pinpointedCity.slice(1).replace(/[^a-zA-Z]/g, ""));
      }
      applicationRouteNavigator('/weather');
    } 
    else if (cleanedTextString.includes('news') || cleanedTextString.includes('feed') || cleanedTextString.includes('articles')) {
      let pinpointedTopic = "";
      if (cleanedTextString.includes('about ')) {
        pinpointedTopic = cleanedTextString.split('about ')[1];
      }
      if (pinpointedTopic) {
        setDynamicTopicPayload(pinpointedTopic.charAt(0).toUpperCase() + pinpointedTopic.slice(1));
      }
      applicationRouteNavigator('/news');
    } 
    else if (cleanedTextString.includes('home') || cleanedTextString.includes('hub') || cleanedTextString.includes('main')) {
      applicationRouteNavigator('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans overflow-x-hidden text-white antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Global Interface Shell Header */}
      <UniversalPlatformNavbar onVoiceIntentIngested={processDynamicVoiceInputRoutingPipeline} />
      
      {/* Captured Voice Transcript Ticker Bar */}
      {capturedVoiceLog && (
        <div className="w-full bg-indigo-500/10 border-b border-indigo-500/15 px-6 py-2.5 text-center text-[10px] font-mono tracking-widest text-indigo-300 uppercase animate-pulse z-40 relative">
          SYSTEM WIRE // PARSED COMMAND INGESTION SEQUENCE: "{capturedVoiceLog.toUpperCase()}"
        </div>
      )}

      {/* App Functional Viewport Content Sections */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        <Routes>
          <Route path="/" element={<HeroStage />} />
          <Route path="/weather" element={<WeatherApp voiceCity={dynamicCityPayload} />} />
          <Route path="/news" element={<NewsApp voiceTopic={dynamicTopicPayload} />} />
          <Route path="*" element={<div className="text-center py-24 font-mono text-xs text-slate-600 tracking-widest uppercase">404 // REQUESTED ROUTE ARTIFACT NON-EXISTENT</div>} />
        </Routes>
      </div>

      {/* Global Framework Interface Footer */}
      <footer className="w-full border-t border-white/[0.04] bg-slate-950 py-8 text-center text-[9px] font-mono text-slate-600 tracking-[0.25em] uppercase relative z-20">
        &copy; 2026 NEXUS FRAMEWORK LABS. OPERATIONAL ARRAYS REGISTERED SECURE.
      </footer>
    </div>
  );
}

// ============================================================================
// SYSTEM ENTRYPOINT INITIALIZER
// ============================================================================
export default function FullScaleApplicationWorkspace() {
  return (
    <BrowserRouter>
      <MasterApplicationLayoutShell />
    </BrowserRouter>
  );
}