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
    <div className="gradient-green px-4 pt-10 pb-4 flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-white font-bold text-lg">{title}</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleLang}
          className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition"
        >
          {switchLangLabel}
        </button>
        <button
          onClick={onExit}
          className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition"
        >
          {isRTL ? 'خروج' : 'Exit'}
        </button>
      </div>
    </div>
  );
}
