import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// Import your large engine sub-modules here
// (Assuming they are in the same folder or adjusted accordingly)
import WeatherApp from './Weather.tsx'; // Your 400+ line Weather component
import NewsApp from './News.tsx';    // Your 400+ line News component

// ==========================================
// 1. ANIMATED GLOBAL NAVIGATION HEADER
// ==========================================
function GlobalNavigationBar() {
  const location = useLocation();

  // Helper to determine active state styling
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Core System Branding */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
            Ω
          </div>
          <div>
            <span className="text-white font-black tracking-widest text-sm block">NEXUS.OS</span>
            <span className="text-[10px] text-white/40 block font-mono tracking-tight uppercase -mt-0.5">Central Management Unit</span>
          </div>
        </Link>

        {/* Dynamic Route Switching Toggles */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          <Link
            to="/"
            className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all duration-200 ${
              isActive('/') 
                ? 'bg-white text-slate-950 shadow-md' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            🏠 Hub
          </Link>
          
          <Link
            to="/weather"
            className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all duration-200 ${
              isActive('/weather') 
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            ☀️ Weather
          </Link>

          <Link
            to="/news"
            className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all duration-200 ${
              isActive('/news') 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            📰 News
          </Link>
        </div>

      </div>
    </nav>
  );
}

// ==========================================
// 2. NEXUS SYSTEM HOMEPAGE CENTRAL HUB
// ==========================================
function DashboardHub() {
  return (
    <div className="min-h-[calc(100-57px)] w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex flex-col items-center justify-center p-6 md:p-12 antialiased">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fadeIn">
        
        {/* Hub Heading Matrix */}
        <div className="space-y-3">
          <span className="text-xs font-black tracking-[0.3em] text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
            System Control Terminal
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Welcome to Your Dashboard
          </h1>
          <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
            Select a processing node below to initiate high-fidelity telemetry tracking or real-time news wire summaries with full multilingual AI voice generation capabilities.
          </p>
        </div>

        {/* Node Route Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          
          {/* Weather Node Anchor Card */}
          <Link 
            to="/weather" 
            className="group relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-6 rounded-3xl text-left hover:border-amber-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[180px] hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-xl rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                ☀️
              </div>
              <span className="text-xs font-mono text-white/30 tracking-widest uppercase">NODE // 01</span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-black tracking-tight group-hover:text-amber-400 transition-colors">SkyVibe Climate Engine</h3>
              <p className="text-xs text-white/40 mt-1 leading-normal">
                Process global coordinate indices, gather humidity analytics, and synthesize weather voice alerts.
              </p>
            </div>
          </Link>

          {/* News Node Anchor Card */}
          <Link 
            to="/news" 
            className="group relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-6 rounded-3xl text-left hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[180px] hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-xl rounded-2xl group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                📰
              </div>
              <span className="text-xs font-mono text-white/30 tracking-widest uppercase">NODE // 02</span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-black tracking-tight group-hover:text-cyan-400 transition-colors">VibeNews Intelligence Wire</h3>
              <p className="text-xs text-white/40 mt-1 leading-normal">
                Ingest cosmic, technological, and general journalistic feeds mapped to speech synthesizers.
              </p>
            </div>
          </Link>

        </div>

        {/* Global Terminal Footer */}
        <div className="text-[10px] font-mono text-white/20 pt-10 uppercase tracking-widest border-t border-white/5">
          Platform Architecture: React 18 &bull; React Router v6 &bull; Tailwind CSS v3
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN ROUTER SWITCH & APP ORCHESTRATOR
// ==========================================
export default function ApplicationEntrypoint() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans select-none overflow-x-hidden selection:bg-white selection:text-black">
        
        {/* Global Layout Navigation */}
        <GlobalNavigationBar />

        {/* Router Window Matrix */}
        <Routes>
          {/* Root Hub route */}
          <Route path="/" element={<DashboardHub />} />
          
          {/* Weather App Route Mapping */}
          <Route path="/weather" element={<WeatherApp />} />
          
          {/* News App Route Mapping */}
          <Route path="/news" element={<NewsApp />} />
          
          {/* Strict 404 Catch-All Fallback Redirect */}
          <Route 
            path="*" 
            element={
              <div className="flex-1 flex flex-col items-center justify-center text-center text-white p-6 bg-slate-950">
                <span className="text-4xl mb-2">🚨</span>
                <h2 className="text-xl font-black tracking-widest uppercase">404 - Matrix Out of Bounds</h2>
                <p className="text-xs text-white/40 mt-1 max-w-xs">The tracking parameters target a path that does not exist in the mainframe routing protocol.</p>
                <Link to="/" className="mt-5 text-xs bg-white text-slate-950 px-5 py-2 rounded-xl font-black tracking-wider hover:bg-white/90 active:scale-95 transition-all">
                  RETURN TO HOME NODE
                </Link>
              </div>
            } 
          />
        </Routes>

      </div>
    </BrowserRouter>
  );
}