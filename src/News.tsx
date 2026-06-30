import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// ==========================================
// 1. DATA CONTRACTS & TYPE INTERFACES
// ==========================================
interface Article {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
}

interface NewsData {
  totalArticles: number;
  feedLanguage: string;
  articles: Article[];
}

interface ThemeConfig {
  text: string;
  icon: string;
  bgClass: string;
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
}

// ==========================================
// 2. EXPANDED LOCALIZATION MATRIX
// ==========================================
const TRANSLATIONS: Record<string, any> = {
  en: {
    brief: (query: string, count: number, topSource: string, title: string) => 
      `Live news telemetry update for segment ${query}. The dispatch center has aggregated ${count} active global reports. The primary headline is anchored by ${topSource}, stating: ${title}.`,
    prompt: "Would you like a full chronological narration of the remaining news feed summaries?",
    signOff: "Broadcast cycle terminated. Standing by for next sync.",
    feedIntro: "Commencing secondary index lookahead sequence.",
    feedItem: (source: string, index: number, title: string) => `Item ${index}, from ${source}: ${title}.`
  },
  hi: {
    brief: (query: string, count: number, topSource: string, title: string) => 
      `${query} के लिए लाइव समाचार बुलेटिन। हमारे सिस्टम ने ${count} सक्रिय वैश्विक रिपोर्टों को संकलित किया है। मुख्य समाचार ${topSource} द्वारा प्रसारित किया गया है, जिसका शीर्षक है: ${title}।`,
    prompt: "क्या आप शेष समाचार फीड का पूरा विवरण सुनना चाहते हैं?",
    signOff: "समाचार प्रसारण चक्र समाप्त हुआ। अगले सिंक की प्रतीक्षा की जा रही है।",
    feedIntro: "अगले समाचार अनुक्रमों का विवरण इस प्रकार है।",
    feedItem: (source: string, index: number, title: string) => `क्रमांक ${index}, ${source} से: ${title}।`
  },
  es: {
    brief: (query: string, count: number, topSource: string, title: string) => 
      `Actualización de noticias en vivo para el segmento ${query}. El centro de despacho ha acumulado ${count} informes globales activos. El titular principal está anclado por ${topSource}, afirmando: ${title}.`,
    prompt: "¿Le gustaría una narración cronológica completa de los resúmenes restantes?",
    signOff: "Ciclo de transmisión terminado. Esperando próxima sincronización.",
    feedIntro: "Comenzando la secuencia de revisión del feed de noticias.",
    feedItem: (source: string, index: number, title: string) => `Artículo ${index}, de ${source}: ${title}.`
  },
  fr: {
    brief: (query: string, count: number, topSource: string, title: string) => 
      `Mise à jour des informations en direct pour le segment ${query}. Le centre de répartition a agrégé ${count} rapports mondiaux actifs. Le titre principal est ancré par ${topSource}, déclarant: ${title}.`,
    prompt: "Souhaitez-vous une narration chronologique complète des autres résumés de l'actualité ?",
    signOff: "Cycle de diffusion terminé. En attente de la prochaine synchronisation.",
    feedIntro: "Début de la séquence d'analyse du flux secondaire.",
    feedItem: (source: string, index: number, title: string) => `Numéro ${index}, de ${source}: ${title}.`
  },
  de: {
    brief: (query: string, count: number, topSource: string, title: string) => 
      `Live-Nachrichten-Update für den Suchsegment ${query}. Die Zentrale hat ${count} aktive globale Berichte aggregiert. Die Hauptschlagzeile stammt von ${topSource} und lautet: ${title}.`,
    prompt: "Möchten Sie eine vollständige chronologische Vorlesung der restlichen Nachrichten-Feeds?",
    signOff: "Übertragungszyklus beendet. Bereit für die nächste Synchronisierung.",
    feedIntro: "Beginne mit der Analyse der sekundären Nachrichten-Feeds.",
    feedItem: (source: string, index: number, title: string) => `Eintrag ${index}, von ${source}: ${title}.`
  },
  it: {
    brief: (query: string, count: number, topSource: string, title: string) => 
      `Aggiornamento notizie in tempo reale per il segmento ${query}. Il centro informazioni ha aggregato ${count} report globali attivi. Il titolo principale è gestito da ${topSource}, che afferma: ${title}.`,
    prompt: "Desideri una narrazione cronologica completa dei restanti riassunti delle notizie?",
    signOff: "Ciclo di trasmissione terminato. In attesa del prossimo aggiornamento.",
    feedIntro: "Inizio della sequenza di analisi del feed secondario.",
    feedItem: (source: string, index: number, title: string) => `Articolo ${index}, da ${source}: ${title}.`
  }
};

// ==========================================
// 3. INTEGRATED SETTINGS OVERLAY MODULE
// ==========================================
function SettingsModal({ 
  isOpen, onClose, voices, selectedVoice, setSelectedVoice, rate, setRate, pitch, setPitch 
}: SettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-white/15 w-full max-w-lg rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-black tracking-wide">AUDIO CORE ENGINE</h2>
            <p className="text-xs text-white/40 mt-0.5">Configure system synthesis parameters</p>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold hover:bg-white/20 transition-all active:scale-90"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest font-black text-white/50 block">Voice Architecture Profile</label>
            <select
              value={selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : ''}
              onChange={(e) => {
                const target = voices.find(v => `${v.name} (${v.lang})` === e.target.value);
                if (target) setSelectedVoice(target);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white text-white/90 shadow-inner"
            >
              {voices.map((voice, idx) => (
                <option key={idx} value={`${voice.name} (${voice.lang})`} className="bg-slate-900 text-white">
                  {voice.name} ({voice.lang}) {voice.localService ? '📦' : '🌐'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-bold text-white/70">
              <span className="uppercase tracking-widest text-[11px] text-white/50">Tempo Rate Speed</span>
              <span className="bg-white/10 px-2 py-0.5 rounded font-mono">{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-bold text-white/70">
              <span className="uppercase tracking-widest text-[11px] text-white/50">Frequency Pitch Tuning</span>
              <span className="bg-white/10 px-2 py-0.5 rounded font-mono">{pitch.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-white text-slate-950 font-black px-6 py-2.5 text-xs tracking-wider rounded-xl hover:bg-white/90 active:scale-95 transition-all shadow-md"
          >
            APPLY METRICS
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN SKYVIBE NEWS MATRIX CORNER
// ==========================================
export default function NewsApp() {
  const [news, setNews] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('Top Headlines');
  const [anchoredIndex, setAnchoredIndex] = useState<number | null>(null);
  
  // Audio Config Settings States
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(0.95);
  const [pitch, setPitch] = useState<number>(1.05);

  const fetchNewsByQuery = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = 'https://api.spaceflightnewsapi.net/v4/articles?limit=10';
      
      // If user inputs a specific category, filter by it, otherwise grab general top trending items
      if (query && query !== 'Top Headlines') {
        url += `&search=${encodeURIComponent(query.trim())}`;
      }

      const newsRes = await fetch(url);
      if (!newsRes.ok) throw new Error('Failed to load global wire transmissions.');
      const data = await newsRes.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('No articles found matching trending indexing parameters.');
      }

      const mappedArticles: Article[] = data.results.map((item: any) => ({
        title: item.title,
        description: item.summary || 'No secondary string dispatch payload attached.',
        source: item.news_site || 'Global Wire',
        url: item.url,
        publishedAt: item.published_at,
        category: query.toUpperCase()
      }));

      setNews({
        totalArticles: mappedArticles.length,
        feedLanguage: 'en',
        articles: mappedArticles
      });
      setAnchoredIndex(null); 
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unexpected news pipeline framework crash occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsByQuery('Top Headlines');

    const loadSystemVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        const preferredVoice = availableVoices.find(
          (v) => v.lang === 'en-IN' || v.lang.includes('en_IN')
        ) || availableVoices.find((v) => v.lang.includes('en')) || availableVoices[0];
        
        setSelectedVoice(preferredVoice || null);
      }
    };

    loadSystemVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadSystemVoices;
    }
  }, []);

  const getNewsTheme = (query: string): ThemeConfig => {
    const check = query.toLowerCase();
    if (check.includes('headline') || check.includes('top')) return { text: 'Global Mainframe', icon: '🌐', bgClass: 'from-slate-900 via-indigo-950 to-black' };
    if (check.includes('tech') || check.includes('crypto')) return { text: 'Cyber Network', icon: '⚡', bgClass: 'from-cyan-900 via-slate-900 to-black' };
    if (check.includes('space') || check.includes('science')) return { text: 'Cosmic Operations', icon: '🚀', bgClass: 'from-purple-950 via-slate-900 to-zinc-950' };
    return { text: 'General Dispatch', icon: '📰', bgClass: 'from-slate-800 via-slate-950 to-neutral-950' };
  };

  const getLangCode = () => {
    if (!selectedVoice) return 'en';
    const prefix = selectedVoice.lang.split('-')[0].split('_')[0].toLowerCase();
    return TRANSLATIONS[prefix] ? prefix : 'en';
  };

  const handleVoiceSummary = () => {
    if (!news || news.articles.length === 0) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    window.speechSynthesis.cancel();

    const langKey = getLangCode();
    const strings = TRANSLATIONS[langKey];
    const topArticle = news.articles[anchoredIndex || 0];
    
    const briefString = strings.brief(
      searchQuery, news.totalArticles, topArticle.source, topArticle.title
    );

    const primaryUtterance = new SpeechSynthesisUtterance(briefString);
    if (selectedVoice) primaryUtterance.voice = selectedVoice;
    primaryUtterance.rate = rate;
    primaryUtterance.pitch = pitch;

    primaryUtterance.onend = () => {
      setTimeout(() => {
        const proceedWithFeed = window.confirm(strings.prompt);
        
        let targetText = "";
        if (proceedWithFeed) {
          targetText = `${strings.feedIntro} `;
          news.articles.filter((_, idx) => idx !== anchoredIndex).slice(0, 5).forEach((art, index) => {
            targetText += `${strings.feedItem(art.source, index + 1, art.title)} `;
          });
        } else {
          targetText = strings.signOff;
        }

        const secondaryUtterance = new SpeechSynthesisUtterance(targetText);
        if (selectedVoice) secondaryUtterance.voice = selectedVoice;
        secondaryUtterance.rate = rate;
        secondaryUtterance.pitch = pitch;
        
        secondaryUtterance.onend = () => setIsSpeaking(false);
        secondaryUtterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(secondaryUtterance);
      }, 150);
    };

    primaryUtterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(primaryUtterance);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchNewsByQuery(searchQuery || 'Top Headlines');
  };

  const currentTheme = getNewsTheme(searchQuery);
  const activeAnchorArticle = anchoredIndex !== null ? news?.articles[anchoredIndex] : null;

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${currentTheme.bgClass} flex flex-col items-center justify-start p-4 md:p-10 text-white transition-all duration-700 ease-in-out antialiased`}>
      
      {/* Structural App Header Component */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
        <h1 className="text-xl font-black tracking-widest flex items-center gap-2">
          <span className="text-2xl">{currentTheme.icon}</span> VIBENEWS.NET
        </h1>
        
        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
          <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              value={searchQuery === 'Top Headlines' ? '' : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value || 'Top Headlines')}
              placeholder="Filter Headlines..."
              className="w-full md:w-56 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-white text-white placeholder-white/40 shadow-inner"
            />
            <button type="submit" className="bg-white text-slate-900 hover:bg-white/90 text-sm font-extrabold px-5 py-2 rounded-xl transition-all active:scale-95 shadow-md">
              Ingest
            </button>
          </form>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 bg-white/10 border border-white/10 hover:border-white/30 rounded-xl hover:scale-105 active:scale-95 transition-all text-xl"
            title="Configure Speech Synthesis Matrix"
          >
            ⚙️
          </button>
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        rate={rate}
        setRate={setRate}
        pitch={pitch}
        setPitch={setPitch}
      />

      {loading && (
        <div className="my-auto flex flex-col items-center gap-2 tracking-widest text-sm font-bold text-white/70">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          INGESTING BROADCAST TRANSMISSIONS NETWORK FEED...
        </div>
      )}

      {error && (
        <div className="my-auto bg-red-500/20 border border-red-500/40 p-4 rounded-2xl font-bold text-red-200 shadow-xl max-w-md text-center">
          ⚠️ Wire Exception: {error}
        </div>
      )}

      {news && !loading && !error && (
        <LayoutGroup>
          <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            <div className="lg:col-span-1 space-y-6">
              {/* Primary Core Metric Display Card */}
              <section className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[240px] shadow-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight truncate max-w-[180px]">{searchQuery}</h2>
                    <p className="text-white/60 font-semibold text-xs mt-1 uppercase tracking-widest">{currentTheme.text}</p>
                  </div>
                  <span className="text-5xl filter drop-shadow-md">{currentTheme.icon}</span>
                </div>
                <div className="my-4">
                  <h3 className="text-6xl font-black inline-block tracking-tighter">{news.totalArticles}</h3>
                  <span className="text-lg font-bold text-white/50 align-baseline ml-2">Feeds Live</span>
                </div>
                <button
                  onClick={handleVoiceSummary}
                  className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm tracking-wider flex items-center justify-center transition-all shadow-lg active:scale-[0.98] ${
                    isSpeaking 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse text-white shadow-red-500/30' 
                      : 'bg-white text-slate-900 hover:bg-slate-100 shadow-white/10'
                  }`}
                >
                  {isSpeaking ? '⏹️ TERMINATE DISPATCH' : '🔊 LIVE MULTILINGUAL AI BROADCASTER'}
                </button>
              </section>
            </div>

            {/* Right Sided Top Headlines Flow */}
            <section className="lg:col-span-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-full">
              <h3 className="text-xs font-black tracking-widest uppercase text-white/60 mb-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-md animate-ping"></span> TOP 10 GLOBAL WIRE INDEX FLOW
              </h3>
              
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {news.articles.slice(0, 10).map((article, index) => {
                  return (
                    <motion.div 
                      key={index} 
                      layoutId={`card-container-${index}`}
                      onClick={() => setAnchoredIndex(index)}
                      className="flex flex-col p-4 rounded-2xl cursor-pointer bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-150 shadow-inner space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white/10 rounded-lg text-white/70 border border-white/5">
                          TOP {index + 1} &bull; {article.source}
                        </span>
                        <span className="text-[11px] font-mono text-white/40">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white/90 tracking-tight leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-xs text-white/50 line-clamp-1">
                        {article.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </main>

          {/* Modal Overlay shared element popup menu layer */}
          <AnimatePresence>
            {anchoredIndex !== null && activeAnchorArticle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                <motion.div 
                  layoutId={`card-container-${anchoredIndex}`}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className="bg-slate-900 border border-white/15 w-full max-w-xl rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-4 relative"
                >
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2.5 py-1 rounded-md tracking-widest uppercase inline-block">
                        🔥 POPULAR GLOBAL TELEMETRY
                      </span>
                      <p className="text-[11px] font-mono text-white/40 mt-1">Source Pipeline: {activeAnchorArticle.source}</p>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnchoredIndex(null);
                      }}
                      className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold hover:bg-white/20 transition-all active:scale-90"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="text-xl font-black tracking-tight text-white leading-snug">
                    {activeAnchorArticle.title}
                  </h3>
                  
                  <p className="text-sm text-white/70 leading-relaxed font-medium">
                    {activeAnchorArticle.description}
                  </p>

                  <div className="flex justify-between items-center text-xs pt-4 border-t border-white/10 text-white/40 font-mono">
                    <span>Released: {new Date(activeAnchorArticle.publishedAt).toLocaleDateString()}</span>
                    <a 
                      href={activeAnchorArticle.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-white text-slate-950 font-black px-4 py-2 text-xs rounded-xl hover:bg-white/90 active:scale-95 transition-all shadow-md"
                    >
                      LAUNCH URL ↗
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      )}
    </div>
  );
}