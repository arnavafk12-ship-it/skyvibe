import { useState, useEffect } from 'react';

// ==========================================
// 1. DATA CONTRACTS & TYPE INTERFACES
// ==========================================
interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
  rainChance: number;
  aqi: number;
  hourlyTemp: number[];
  hourlyTime: string[];
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
    brief: (city: string, condition: string, temp: number, hum: number, rain: number, aqi: number, status: string, wind: number) => 
      `Live atmosphere telemetry report for ${city}. The primary indicator shows ${condition} at ${temp} degrees Celsius. Humidity is distributed at ${hum} percent, while precipitation metrics predict a ${rain} percent probability of active rainfall. Air quality register reads ${aqi}, indicating a ${status} status. Current vector wind speed clocks at ${wind} kilometers per hour.`,
    prompt: "Would you like a narration of the 10-hour hourly forecast?",
    signOff: "Have a great day, signing off.",
    hourlyIntro: "Here is your chronological 10-hour lookahead.",
    hourlyItem: (time: string, temp: number) => `At ${time}, it will be ${temp} degrees Celsius.`
  },
  hi: {
    brief: (city: string, condition: string, temp: number, hum: number, rain: number, aqi: number, status: string, wind: number) => 
      `${city} के लिए लाइव मौसम रिपोर्ट। मुख्य संकेतक ${temp} डिग्री सेल्सियस पर ${condition} दिखाता है। उमस ${hum} प्रतिशत है, जबकि बारिश की संभावना ${rain} प्रतिशत है। वायु गुणवत्ता सूचकांक ${aqi} है जो ${status} स्थिति को दर्शाता है। हवा की गति ${wind} किलोमीटर प्रति घंटा है।`,
    prompt: "क्या आप अगले 10 घंटे का मौसम पूर्वानुमान सुनना चाहते हैं?",
    signOff: "आपका दिन शुभ हो, अलविदा।",
    hourlyIntro: "अगले 10 घंटों का विवरण इस प्रकार है।",
    hourlyItem: (time: string, temp: number) => `${time} बजे, तापमान ${temp} डिग्री सेल्सियस होगा।`
  },
  es: {
    brief: (city: string, condition: string, temp: number, hum: number, rain: number, aqi: number, status: string, wind: number) => 
      `Informe del clima para ${city}. El indicador principal muestra ${condition} a ${temp} grados Celsius. La humedad es del ${hum} por ciento y la probabilidad de lluvia es del ${rain} por ciento. El índice de calidad del aire es de ${aqi}, lo que indica un estado ${status}. La velocidad del viento es de ${wind} kilómetros por hora.`,
    prompt: "¿Le gustaría escuchar la narración del pronóstico de 10 horas?",
    signOff: "Que tenga un excelente día, terminando transmisión.",
    hourlyIntro: "Aquí está el pronóstico cronológico de 10 horas.",
    hourlyItem: (time: string, temp: number) => `A las ${time}, estará a ${temp} grados Celsius.`
  },
  fr: {
    brief: (city: string, condition: string, temp: number, hum: number, rain: number, aqi: number, status: string, wind: number) => 
      `Rapport météo en direct pour ${city}. L'indicateur principal affiche ${condition} à ${temp} degrés Celsius. L'humidité est de ${hum} pour cent, tandis que la probabilité de pluie est de ${rain} pour cent. L'indice de qualité de l'air est de ${aqi}, ce qui indique un statut ${status}. La vitesse actuelle du vent est de ${wind} kilomètres par heure.`,
    prompt: "Souhaitez-vous écouter les prévisions horaires sur 10 heures ?",
    signOff: "Bonne journée, fin de la transmission.",
    hourlyIntro: "Voici vos prévisions chronologiques sur 10 heures.",
    hourlyItem: (time: string, temp: number) => `À ${time}, il fera ${temp} degrés Celsius.`
  },
  de: {
    brief: (city: string, condition: string, temp: number, hum: number, rain: number, aqi: number, status: string, wind: number) => 
      `Live-Wetterbericht für ${city}. Die Hauptanzeige meldet ${condition} bei ${temp} Grad Celsius. Die Luftfeuchtigkeit liegt bei ${hum} Prozent, während die Regenwahrscheinlichkeit ${rain} Prozent beträgt. Der Luftqualitätsindex steht bei ${aqi}, was auf einen ${status} Zustand hinweist. Die aktuelle Windgeschwindigkeit beträgt ${wind} Kilometer pro Stunde.`,
    prompt: "Möchten Sie den 10-Stunden-Stundenbericht hören?",
    signOff: "Einen schönen Tag noch, Abmeldung.",
    hourlyIntro: "Hier ist Ihre chronologische 10-Stunden-Vorschau.",
    hourlyItem: (time: string, temp: number) => `Um ${time} werden es ${temp} Grad Celsius sein.`
  },
  it: {
    brief: (city: string, condition: string, temp: number, hum: number, rain: number, aqi: number, status: string, wind: number) => 
      `Bollettino meteo in tempo reale per ${city}. L'indicatore principale mostra ${condition} a ${temp} gradi Celsius. L'umidità è al ${hum} percento, mentre la probabilità di pioggia è del ${rain} percento. L'indice di qualità dell'aria è ${aqi}, il che indica uno stato ${status}. La velocità del vento attuale è di ${wind} chilometri orari.`,
    prompt: "Desideri ascoltare le previsioni orarie per le prossime 10 ore?",
    signOff: "Buona giornata, fine della trasmissione.",
    hourlyIntro: "Ecco le tue previsioni cronologiche per le prossime 10 ore.",
    hourlyItem: (time: string, temp: number) => `Alle ore ${time}, ci saranno ${temp} gradi Celsius.`
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
// 4. MAIN SKYVIBE ENGINE APPLICATION CORNER
// ==========================================
export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Delhi');
  
  // Audio Config Settings States
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(0.95);
  const [pitch, setPitch] = useState<number>(1.05);

  const fetchWeatherByCity = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City match failed! Enter valid geographic name.');
      }

      const { latitude, longitude, name } = geoData.results[0];
      setCity(name);

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability`
      );
      if (!weatherRes.ok) throw new Error('Failed to load telemetry vectors.');
      const data = await weatherRes.json();

      const aqiRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`
      );
      const aqiData = await aqiRes.json();

      setWeather({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        humidity: data.hourly.relative_humidity_2m[0] || 55,
        rainChance: data.hourly.precipitation_probability[0] || 0,
        aqi: aqiData.current?.us_aqi || 45,
        hourlyTemp: data.hourly.temperature_2m,
        hourlyTime: data.hourly.time,
      });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unexpected runtime engine crash occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherByCity('Delhi');

    const loadSystemVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Intelligently find regional Hindi/English voice or fall back to system primary
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

  const getWeatherTheme = (code: number): ThemeConfig => {
    if (code === 0) return { text: 'Clear Sky', icon: '☀️', bgClass: 'from-amber-500 via-orange-600 to-amber-950' };
    if (code >= 1 && code <= 3) return { text: 'Partly Cloudy', icon: '⛅', bgClass: 'from-blue-600 via-slate-700 to-slate-950' };
    if (code >= 51 && code <= 67) return { text: 'Rainy Cascade', icon: '🌧️', bgClass: 'from-slate-700 via-indigo-950 to-zinc-950' };
    if (code >= 95 && code <= 99) return { text: 'Electrical Thunderstorm', icon: '⛈️', bgClass: 'from-purple-900 via-zinc-900 to-black' };
    return { text: 'Moderate Canopy', icon: '🌍', bgClass: 'from-cyan-700 via-slate-800 to-slate-950' };
  };

  const getAQIDesc = (aqi: number) => {
    if (aqi <= 50) return { text: 'Good Health Index', color: 'text-emerald-400' };
    if (aqi <= 100) return { text: 'Moderate Shield', color: 'text-yellow-400' };
    return { text: 'Poor/Unhealthy Vector', color: 'text-red-400' };
  };

  const getLangCode = () => {
    if (!selectedVoice) return 'en';
    const prefix = selectedVoice.lang.split('-')[0].split('_')[0].toLowerCase();
    return TRANSLATIONS[prefix] ? prefix : 'en';
  };

  const handleVoiceSummary = () => {
    if (!weather) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    window.speechSynthesis.cancel();

    const langKey = getLangCode();
    const strings = TRANSLATIONS[langKey];
    const theme = getWeatherTheme(weather.weathercode);
    const aqiStatus = getAQIDesc(weather.aqi).text;
    
    const briefString = strings.brief(
      city, theme.text, weather.temperature, weather.humidity, weather.rainChance, weather.aqi, aqiStatus, weather.windspeed
    );

    const primaryUtterance = new SpeechSynthesisUtterance(briefString);
    if (selectedVoice) primaryUtterance.voice = selectedVoice;
    primaryUtterance.rate = rate;
    primaryUtterance.pitch = pitch;

    primaryUtterance.onend = () => {
      setTimeout(() => {
        const proceedWithHourly = window.confirm(strings.prompt);
        
        let targetText = "";
        if (proceedWithHourly) {
          targetText = `${strings.hourlyIntro} `;
          weather.hourlyTemp.slice(0, 10).forEach((temp, index) => {
            const timeString = new Date(weather.hourlyTime[index]).toLocaleTimeString([], { 
              hour: '2-digit', minute: '2-digit' 
            });
            targetText += `${strings.hourlyItem(timeString, temp)} `;
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
    if (city.trim()) fetchWeatherByCity(city);
  };

  const currentTheme = weather ? getWeatherTheme(weather.weathercode) : { text: 'Synchronizing Matrix', icon: '🌍', bgClass: 'from-slate-950 to-black' };
  const aqiDetails = weather ? getAQIDesc(weather.aqi) : { text: '', color: '' };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${currentTheme.bgClass} flex flex-col items-center justify-start p-4 md:p-10 text-white transition-all duration-700 ease-in-out antialiased`}>
      
      {/* Structural App Header Component */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg animate-fadeIn">
        <h1 className="text-xl font-black tracking-widest flex items-center gap-2">
          <span className="text-2xl">{currentTheme.icon}</span> SKYVIBE.IO
        </h1>
        
        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
          <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Query Global Node..."
              className="w-full md:w-56 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-white text-white placeholder-white/40 shadow-inner"
            />
            <button type="submit" className="bg-white text-slate-900 hover:bg-white/90 text-sm font-extrabold px-5 py-2 rounded-xl transition-all active:scale-95 shadow-md">
              Process
            </button>
          </form>

          {/* Trigger Voice Configurations Panel Button */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 bg-white/10 border border-white/10 hover:border-white/30 rounded-xl hover:scale-105 active:scale-95 transition-all text-xl"
            title="Configure Speech Synthesis Matrix"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Embedded Component Injector */}
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
          SYNCING GEOGRAPHIC CLIMATE ENVIRONMENT...
        </div>
      )}

      {error && (
        <div className="my-auto bg-red-500/20 border border-red-500/40 p-4 rounded-2xl font-bold text-red-200 shadow-xl max-w-md text-center animate-fadeIn">
          ⚠️ Core Exception: {error}
        </div>
      )}

      {weather && !loading && !error && (
        <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">
          
          <div className="lg:col-span-1 space-y-6">
            {/* Primary Core Metric Display Card */}
            <section className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[220px] shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black tracking-tight">{city}</h2>
                  <p className="text-white/60 font-semibold text-xs mt-1 uppercase tracking-widest">{currentTheme.text}</p>
                </div>
                <span className="text-5xl filter drop-shadow-md">{currentTheme.icon}</span>
              </div>
              <div className="my-4">
                <h3 className="text-7xl font-black inline-block tracking-tighter">{weather.temperature}</h3>
                <span className="text-3xl font-light text-white/70 align-super ml-1">°C</span>
              </div>
              <button
                onClick={handleVoiceSummary}
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm tracking-wider flex items-center justify-center transition-all shadow-lg active:scale-[0.98] ${
                  isSpeaking 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse text-white shadow-red-500/30' 
                    : 'bg-white text-slate-900 hover:bg-slate-100 shadow-white/10'
                }`}
              >
                {isSpeaking ? '⏹️ TERMINATE BRIEFING' : '🔊 RUN INTERACTIVE AI NARRATOR'}
              </button>
            </section>

            {/* Grid Array for Secondary Environmental Sensors */}
            <section className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-5 grid grid-cols-2 gap-4 shadow-2xl">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-white/40 block tracking-widest mb-1 uppercase">Air Quality Index</span>
                <span className="text-3xl font-black block tracking-tight">{weather.aqi}</span>
                <span className={`text-[11px] block font-bold mt-1 tracking-tight truncate ${aqiDetails.color}`}>{aqiDetails.text}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-white/40 block tracking-widest mb-1 uppercase">Moisture Canopy</span>
                <span className="text-3xl font-black block tracking-tight">{weather.humidity}%</span>
                <span className="text-[11px] block text-white/40 font-medium mt-1">Relative value</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-white/40 block tracking-widest mb-1 uppercase">Precipitation</span>
                <span className="text-3xl font-black block tracking-tight">{weather.rainChance}%</span>
                <span className="text-[11px] block text-white/40 font-medium mt-1">Rain likelihood</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-white/40 block tracking-widest mb-1 uppercase">Wind Vector</span>
                <span className="text-3xl font-black block tracking-tight">{weather.windspeed} <span className="text-xs font-bold text-white/50">km/h</span></span>
                <span className="text-[11px] block text-white/40 font-medium mt-1">Current dynamic</span>
              </div>
            </section>
          </div>

          {/* Right Sided Chronological Lookahead Module */}
          <section className="lg:col-span-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-full">
            <h3 className="text-xs font-black tracking-widest uppercase text-white/60 mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-md animate-ping"></span> TIME-SERIES CHRONO LOOKAHEAD (10-HOUR STEP INTERVALS)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {weather.hourlyTemp.slice(0, 10).map((temp, index) => {
                const timeString = new Date(weather.hourlyTime[index]).toLocaleTimeString([], { 
                  hour: '2-digit', minute: '2-digit' 
                });
                return (
                  <div 
                    key={index} 
                    className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 hover:scale-[1.01] transition-all duration-150 shadow-inner"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-extrabold px-2.5 py-1.5 bg-white/10 rounded-xl text-white/90 border border-white/5">
                        {timeString}
                      </span>
                      <span className="text-md filter drop-shadow-sm">{currentTheme.icon}</span>
                    </div>
                    <span className="text-xl font-black tracking-tight">{temp}°C</span>
                  </div>
                );
              })}
            </div>
          </section>

        </main>
      )}
    </div>
  );
}