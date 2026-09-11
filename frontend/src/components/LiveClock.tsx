import React, { useState, useEffect, useRef } from 'react';
import { Clock, Settings, ChevronDown } from 'lucide-react';

export interface ClockSettings {
  format: '12' | '24';
  timezone: string;
}

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Kolkata (IST)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

export const LiveClock: React.FC<{ compact?: boolean; className?: string }> = ({ compact = false, className = '' }) => {
  const [format, setFormat] = useState<'12' | '24'>(() => {
    return (localStorage.getItem('wagr_clock_format') as '12' | '24') || '24';
  });
  const [timezone, setTimezone] = useState<string>(() => {
    return localStorage.getItem('wagr_clock_timezone') || 'Asia/Kolkata';
  });

  const [timeString, setTimeString] = useState<string>('');
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Listen to custom event for synced settings across clock instances
  useEffect(() => {
    const handleStorageSync = () => {
      const savedFormat = (localStorage.getItem('wagr_clock_format') as '12' | '24') || '24';
      const savedTz = localStorage.getItem('wagr_clock_timezone') || 'Asia/Kolkata';
      setFormat(savedFormat);
      setTimezone(savedTz);
    };

    window.addEventListener('wagr_clock_update', handleStorageSync);
    return () => window.removeEventListener('wagr_clock_update', handleStorageSync);
  }, []);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: format === '12',
        }).format(now);
        setTimeString(formatted);
      } catch (e) {
        setTimeString(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [format, timezone]);

  // Handle outside click for settings popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    if (popoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popoverOpen]);

  const updateFormat = (newFormat: '12' | '24') => {
    setFormat(newFormat);
    localStorage.setItem('wagr_clock_format', newFormat);
    window.dispatchEvent(new Event('wagr_clock_update'));
  };

  const updateTimezone = (newTz: string) => {
    setTimezone(newTz);
    localStorage.setItem('wagr_clock_timezone', newTz);
    window.dispatchEvent(new Event('wagr_clock_update'));
  };

  const currentTzLabel = TIMEZONE_OPTIONS.find((t) => t.value === timezone)?.label || timezone;

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={popoverRef}>
      {/* Clock Button Display */}
      <button
        type="button"
        onClick={() => setPopoverOpen(!popoverOpen)}
        className="flex items-center space-x-2 bg-dark-card/90 hover:bg-dark-card border border-dark-border/80 hover:border-brand-purple/50 rounded-xl px-3 py-1.5 transition-all text-xs font-mono text-white/90 shadow-inner group cursor-pointer"
        title="Click to configure clock timezone & format"
      >
        <Clock size={13} className="text-brand-purple group-hover:rotate-12 transition-transform" />
        <span className="font-bold tracking-wider text-white font-mono">{timeString || '--:--:--'}</span>
        {!compact && (
          <span className="text-[10px] text-dark-muted font-sans font-semibold bg-dark/60 px-1.5 py-0.5 rounded border border-dark-border/40">
            {currentTzLabel.split(' ')[0]}
          </span>
        )}
        <ChevronDown size={11} className={`text-dark-muted transition-transform ${popoverOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Clock Settings Popover */}
      {popoverOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-dark-card border border-dark-border/80 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in space-y-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-dark-border/40 pb-2">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Settings size={13} className="text-brand-purple" />
              <span>Time Preferences</span>
            </span>
            <span className="text-[10px] text-dark-muted">Display Only</span>
          </div>

          {/* Time Format Option */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">Time Format</label>
            <div className="grid grid-cols-2 gap-1.5 bg-dark/60 p-1 rounded-xl border border-dark-border/40">
              <button
                type="button"
                onClick={() => updateFormat('12')}
                className={`py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  format === '12' ? 'bg-brand-purple text-white shadow-md' : 'text-dark-muted hover:text-white'
                }`}
              >
                12-Hour (AM/PM)
              </button>
              <button
                type="button"
                onClick={() => updateFormat('24')}
                className={`py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  format === '24' ? 'bg-brand-purple text-white shadow-md' : 'text-dark-muted hover:text-white'
                }`}
              >
                24-Hour (18:00)
              </button>
            </div>
          </div>

          {/* Timezone Option */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-muted uppercase tracking-wider block">Display Timezone</label>
            <select
              value={timezone}
              onChange={(e) => updateTimezone(e.target.value)}
              className="w-full bg-dark/80 border border-dark-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple/70 cursor-pointer"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-dark-card text-white">
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
