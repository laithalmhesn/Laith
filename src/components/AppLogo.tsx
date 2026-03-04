interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AppLogo({ size = 'md' }: AppLogoProps) {
  const sizes = {
    sm: { container: 'w-12 h-12 rounded-xl', flame: 'text-2xl', label: 'text-[8px]' },
    md: { container: 'w-16 h-16 rounded-2xl', flame: 'text-3xl', label: 'text-[10px]' },
    lg: { container: 'w-28 h-28 rounded-3xl', flame: 'text-5xl', label: 'text-xs' },
  };
  const s = sizes[size];
  return (
    <div
      className={`${s.container} flex flex-col items-center justify-center flex-shrink-0`}
      style={{
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)',
        boxShadow: '0 8px 32px rgba(22, 163, 74, 0.45)',
      }}
    >
      <span className={s.flame}>🔥</span>
      {size !== 'sm' && (
        <span className={`text-white font-black ${s.label} tracking-widest leading-none mt-0.5`}>GAS</span>
      )}
    </div>
  );
}
