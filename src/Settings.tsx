import React from 'react';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
    rate: number;
    setRate: (rate: number) => void;
    pitch: number;
    setPitch: (pitch: number) => void;
}

export default function Settings({
    isOpen,
    onClose,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch
}: SettingsProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            {/* Modal Card Backdrop Dismissal */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal Content container */}
            <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl space-y-5 text-white z-10 m-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="text-sm font-black tracking-widest uppercase text-white/70 flex items-center gap-2">
                        ⚙️ AUDIO CONFIGURATIONS
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white text-xs font-bold bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-all"
                    >
                        ✕ CLOSE
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Voice Profile Dropdown selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                            Voice & Language Profile
                        </label>
                        {voices.length > 0 ? (
                            <select
                                value={selectedVoice?.name || ''}
                                onChange={(e) => {
                                    const found = voices.find((v) => v.name === e.target.value);
                                    if (found) setSelectedVoice(found);
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/90 focus:outline-none focus:border-white/30 transition-all"
                            >
                                {voices.map((v, i) => (
                                    <option key={i} value={v.name} className="bg-slate-950 text-white text-xs">
                                        {v.name} ({v.lang})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="text-xs text-white/40 italic py-2">Loading core synthesis assets...</div>
                        )}
                    </div>

                    {/* Dynamic Velocity Speed Slider */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                Narration Speed
                            </label>
                            <span className="text-xs font-bold text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
                                {rate}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.05"
                            value={rate}
                            onChange={(e) => setRate(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>

                    {/* Dynamic Tone Pitch Slider */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                Vocal Pitch
                            </label>
                            <span className="text-xs font-bold text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
                                {pitch}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.05"
                            value={pitch}
                            onChange={(e) => setPitch(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}