import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

const storageKey = 'smarthire-brightness';

const modes = [
  { id: 'bright', label: 'Bright', icon: 'sun', base: 1, saturation: 1 },
  { id: 'soft', label: 'Soft', icon: 'sun', base: 0.92, saturation: 0.94 },
  { id: 'night', label: 'Night', icon: 'moon', base: 0.78, saturation: 0.86 },
];

const clamp = (value) => Math.min(115, Math.max(70, Number(value) || 100));

const getInitialSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved?.mode && modes.some((mode) => mode.id === saved.mode)) {
      return { mode: saved.mode, level: clamp(saved.level) };
    }
  } catch {
    localStorage.removeItem(storageKey);
  }

  return { mode: 'bright', level: 100 };
};

const applyBrightness = ({ mode, level }) => {
  const selected = modes.find((item) => item.id === mode) || modes[0];
  const finalBrightness = Math.max(0.55, Math.min(1.2, selected.base * (clamp(level) / 100)));

  document.documentElement.dataset.brightnessMode = selected.id;
  document.documentElement.style.setProperty('--app-filter-brightness', finalBrightness.toFixed(2));
  document.documentElement.style.setProperty('--app-filter-saturation', selected.saturation.toString());
};

const BrightnessToggle = ({ onSelect }) => {
  const [settings, setSettings] = useState(getInitialSettings);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const selectedMode = modes.find((mode) => mode.id === settings.mode) || modes[0];

  useEffect(() => {
    applyBrightness(settings);
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!panelRef.current?.contains(event.target)) setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectMode = (mode) => {
    setSettings((current) => ({ ...current, mode }));
    onSelect?.();
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        onClick={() => setOpen((current) => !current)}
        aria-label="Brightness settings"
        aria-expanded={open}
        title="Brightness settings"
      >
        <Icon name={selectedMode.icon} className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-950">Brightness</p>
              <p className="text-xs text-slate-500">Saved on this browser</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {settings.level}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                  settings.mode === mode.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => selectMode(mode.id)}
              >
                <Icon name={mode.icon} className="h-4 w-4" />
                {mode.label}
              </button>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold text-slate-500">Intensity</span>
            <input
              type="range"
              min="70"
              max="115"
              step="5"
              value={settings.level}
              onChange={(event) => setSettings((current) => ({ ...current, level: clamp(event.target.value) }))}
              className="w-full accent-primary-600"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default BrightnessToggle;
