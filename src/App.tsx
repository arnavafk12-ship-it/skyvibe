import React, { useState, useEffect } from 'react';

// Strict Data Contract for TypeScript Compilation
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

// Localization Dictionary Matrix
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
      `${city} के लिए लाइव मौसम रिपोर्ट। मुख्य संकेतक ${temp} डिग्री सेल्सियस पर ${condition} दिखाता है। उमस ${hum} प्रतिशत है, जबकि बारिश की संभावना ${rain} प्रतिशत है। वायु गुणवत्ता सूचकांक ${aqi} है। हवा की गति ${wind} किलोमीटर प्रति घंटा है।`,
    prompt: "क्या आप अगले 10 घंटे का मौसम पूर्वानुमान सुनना चाहते हैं?",
    signOff: "आपका दिन शुभ हो, अलविदा।",
    hourlyIntro: "अगले 10 घंटों का विवरण इस प्रकार है।",
    hourlyItem: (time: string, temp: number) => `${time} बजे, तापमान ${temp} डिग्री सेल्सियस होगा।`
  },
  es: {
    brief: (city: string, condition: string, temp: number, hum: number, rain: number, aqi: number, status: string, wind: number) => 
      `Informe del clima para ${city}. El indicador principal muestra ${condition} a ${temp} grados Celsius. La humedad es del ${hum} por ciento y la probabilidad de lluvia es del ${rain} por ciento. El índice de calidad del aire es de ${aqi}. La velocidad del viento es de ${wind} kilómetros por hora.`,
    prompt: "¿Le gustaría escuchar la narración del pronóstico de 10 horas?",
    signOff: "Que tenga un excelente día, terminando transmisión.",
    hourlyIntro: "Aquí está el pronóstico cronológico de 10 horas.",
    hourlyItem: (time: string, temp: number) => `A las ${time}, estará a ${temp} grados Celsius.`
  }
};

export default function UltimateWeatherDashboard() {
  // Application State Management
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Delhi');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // 1. Core Logic: Fetch Weather, Geocoding & Air Quality APIs
  const fetchWeatherByCity = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City nahi mili! Sahi naam dalein.');
      }

      const { latitude, longitude, name } = geoData.results[0];
      setCity(name);

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability`
      );
      if (!weatherRes.ok) throw new Error('Weather metrics load nahi ho paye.');
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
      else setError('An unexpected runtime crash occurred.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Lifecycle Effects for System Integration
  useEffect(() => {
    fetchWeatherByCity('Delhi');

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

  // 3. Helper Logic: Environmental Theme Dynamic Mapper
  const getWeatherTheme = (code: number): ThemeConfig => {
    if (code === 0) {
      return { text: 'Clear Sky', icon: '☀️', bgClass: 'from-amber-500 via-orange-600 to-amber-950' };
    }
    if (code >= 1 && code <= 3) {
      return { text: 'Partly Cloudy', icon: '⛅', bgClass: 'from-blue-600 via-slate-700 to-slate-950' };
    }
    if (code >= 51 && code <= 67) {
      return { text: 'Rainy Day', icon: '🌧️', bgClass: 'from-slate-700 via-indigo-950 to-zinc-950' };
    }
    if (code >= 95 && code <= 99) {
      return { text: 'Thunderstorm', icon: '⛈️', bgClass: 'from-purple-900 via-zinc-900 to-black' };
    }
    return { text: 'Moderate Sky', icon: '🌍', bgClass: 'from-cyan-700 via-slate-800 to-slate-950' };
  };

  const getAQIDesc = (aqi: number) => {
    if (aqi <= 50) return { text: 'Good Health Index', color: 'text-emerald-400' };
    if (aqi <= 100) return { text: 'Moderate Shield', color: 'text-yellow-400' };
    return { text: 'Unhealthy/Poor', color: 'text-red-400' };
  };

  // Helper to extract language prefix (e.g., 'en-US' -> 'en')
  const getLangCode = () => {
    if (!selectedVoice) return 'en';
    const prefix = selectedVoice.lang.split('-')[0].split('_')[0].toLowerCase();
    return TRANSLATIONS[prefix] ? prefix : 'en';
  };

  // 4. Feature Execution: Audio Synthesizer Engine with Confirmation Flow
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
    
    // Phase 1: Speak current weather summary
    const briefString = strings.brief(
      city, 
      theme.text, 
      weather.temperature, 
      weather.humidity, 
      weather.rainChance, 
      weather.aqi, 
      aqiStatus, 
      weather.windspeed
    );

    const utterance = new SpeechSynthesisUtterance(briefString);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Trigger confirmation flow when Phase 1 finishes
    utterance.onend = () => {
      // Small timeout keeps UI thread unblocked for custom execution state tracking
      setTimeout(() => {
        const proceedWithHourly = window.confirm(strings.prompt);
        
        let finalNarrationText = "";
        if (proceedWithHourly) {
          // Construct 10 hours narration script
          let hourlyText = `${strings.hourlyIntro} `;
          weather.hourlyTemp.slice(0, 10).forEach((temp, index) => {
            const timeString = new Date(weather.hourlyTime[index]).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            hourlyText += `${strings.hourlyItem(timeString, temp)} `;
          });
          finalNarrationText = hourlyText;
        } else {
          finalNarrationText = strings.signOff;
        }

        const secondaryUtterance = new SpeechSynthesisUtterance(finalNarrationText);
        if (selectedVoice) secondaryUtterance.voice = selectedVoice;
        secondaryUtterance.rate = 0.95;
        secondaryUtterance.pitch = 1.05;
        
        secondaryUtterance.onend = () => setIsSpeaking(false);
        secondaryUtterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(secondaryUtterance);
      }, 200);
    };

    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) fetchWeatherByCity(city);
  };

  const currentTheme = weather ? getWeatherTheme(weather.weathercode) : { text: 'Syncing', icon: '🌍', bgClass: 'from-slate-950 to-black' };
  const aqiDetails = weather ? getAQIDesc(weather.aqi) : { text: '', color: '' };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${currentTheme.bgClass} flex flex-col items-center justify-start p-4 md:p-10 text-white transition-all duration-700 ease-in-out antialiased`}>
      
      {/* App Header Structure */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
        <h1 className="text-xl font-black tracking-widest flex items-center gap-2">
          <span className="text-2xl">{currentTheme.icon}</span> SKYVIBE.IO
        </h1>
        
        {/* Dynamic Controls Grid */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-center">
          {/* Voice Engine Dropdown Selection */}
          {voices.length > 0 && (
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const found = voices.find((v) => v.name === e.target.value);
                if (found) setSelectedVoice(found);
              }}
              className="w-full sm:w-64 bg-black/30 border border-white/10 rounded-xl px-2 py-2 text-xs text-white/80 focus:outline-none"
            >
              {voices.map((v, i) => (
                <option key={i} value={v.name} className="bg-slate-900 text-white text-xs">
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          )}

          {/* Core Input Form */}
          <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search Global Matrix..."
              className="w-full md:w-56 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-white text-white placeholder-white/40 shadow-inner"
            />
            <button type="submit" className="bg-white text-slate-900 hover:bg-white/90 text-sm font-extrabold px-5 py-2 rounded-xl transition-all active:scale-95 shadow-md">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Loading Vector Representation */}
      {loading && (
        <div className="my-auto flex flex-col items-center gap-2 tracking-widest text-sm font-bold text-white/70">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          FETCHING CLIMATE INFRASTRUCTURE...
        </div>
      )}

      {/* Runtime Exception UI View */}
      {error && (
        <div className="my-auto bg-red-500/20 border border-red-500/40 p-4 rounded-2xl font-bold text-red-200 shadow-xl max-w-md text-center">
          ⚠️ Core Exception: {error}
        </div>
      )}

      {/* Dashboard Grid System Presentation */}
      {weather && !loading && !error && (
        <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">
          
          {/* Main Core Display Block */}
          <div className="lg:col-span-1 space-y-6">
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
                {isSpeaking ? '⏹️ TERMINATE BRIEFING' : '🔊 INITIATE AI BRIEFING'}
              </button>
            </section>

            {/* Matrix Data Cards */}
            <section className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-5 grid grid-cols-2 gap-4 shadow-2xl">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-white/40 block tracking-widest mb-1 uppercase">Atmosphere AQI</span>
                <span className="text-3xl font-black block tracking-tight">{weather.aqi}</span>
                <span className={`text-[11px] block font-bold mt-1 ${aqiDetails.color}`}>{aqiDetails.text}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-white/40 block tracking-widest mb-1 uppercase">Moisture Ratio</span>
                <span className="text-3xl font-black block tracking-tight">{weather.humidity}%</span>
                <span className="text-[11px] block text-white/40 font-medium mt-1">Relative value</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-white/40 block tracking-widest mb-1 uppercase">Precipitation</span>
                <span className="text-3xl font-black block tracking-tight">{weather.rainChance}%</span>
                <span className="text-[11px] block text-white/40 font-medium mt-1">Rain likelihood</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-white/40 block tracking-widest mb-1 uppercase">Wind Velocity</span>
                <span className="text-3xl font-black block tracking-tight">{weather.windspeed} <span className="text-xs font-bold text-white/50">km/h</span></span>
                <span className="text-[11px] block text-white/40 font-medium mt-1">Current vector</span>
              </div>
            </section>
          </div>

          {/* Sequential 10 Hour Card Timeline */}
          <section className="lg:col-span-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-full">
            <h3 className="text-xs font-black tracking-widest uppercase text-white/60 mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-md animate-ping"></span> CHRONOLOGICAL HOURLY LOOKAHEAD (10H)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {weather.hourlyTemp.slice(0, 10).map((temp, index) => {
                const timeString = new Date(weather.hourlyTime[index]).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
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