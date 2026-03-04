interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AppLogo({ size = 'md' }: AppLogoProps) {
  const sizes = {
    sm: { container: 'w-12 h-12 rounded-xl', flame: 'text-2xl' },
    md: { container: 'w-16 h-16 rounded-2xl', flame: 'text-3xl' },
    lg: { container: 'w-28 h-28 rounded-3xl', flame: 'text-5xl' },
  };
  const s = sizes[size];
  return (
    <div className={`${s.container} bg-white flex flex-col items-center justify-center card-shadow-lg flex-shrink-0`}>
      <span className={s.flame}>🔥</span>
      {size === 'lg' && (
        <span className="text-green-700 font-black text-xs tracking-tight leading-none mt-0.5">GAS</span>
      )}
    </div>
  );
}
