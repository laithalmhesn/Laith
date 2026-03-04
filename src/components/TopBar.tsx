"use client";

interface TopBarProps {
  title: string;
  isRTL: boolean;
  switchLangLabel: string;
  onToggleLang: () => void;
  onExit: () => void;
}

export function TopBar({ title, isRTL, switchLangLabel, onToggleLang, onExit }: TopBarProps) {
  return (
    <div className="gradient-green px-5 pt-10 pb-5 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <h1 className="text-white font-black text-lg">{title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className="text-white/80 text-xs bg-white/20 px-2.5 py-1.5 rounded-full hover:bg-white/30 transition font-medium"
          >
            {switchLangLabel}
          </button>
          <button
            onClick={onExit}
            className="text-white/80 text-xs bg-white/20 px-2.5 py-1.5 rounded-full hover:bg-white/30 transition font-medium"
          >
            {isRTL ? 'خروج' : 'Exit'}
          </button>
        </div>
      </div>
    </div>
  );
}
