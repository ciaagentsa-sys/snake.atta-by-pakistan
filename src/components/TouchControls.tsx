import { Direction } from '../hooks/useSnakeGame';

interface TouchControlsProps {
  onDirection: (dir: Direction) => void;
  disabled: boolean;
}

export function TouchControls({ onDirection, disabled }: TouchControlsProps) {
  const buttonClass = `
    w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center
    bg-slate-800/80 border border-slate-600/50
    text-slate-300 text-2xl font-bold
    active:scale-90 active:bg-emerald-900/50 active:border-emerald-500/50
    transition-all duration-100 select-none touch-manipulation
    ${disabled ? 'opacity-30 pointer-events-none' : ''}
  `;

  return (
    <div className="grid grid-cols-3 gap-2 w-fit mx-auto mt-4 md:hidden">
      <div />
      <button className={buttonClass} onTouchStart={() => onDirection('UP')} aria-label="Up">
        ▲
      </button>
      <div />
      <button className={buttonClass} onTouchStart={() => onDirection('LEFT')} aria-label="Left">
        ◀
      </button>
      <button className={buttonClass} onTouchStart={() => onDirection('DOWN')} aria-label="Down">
        ▼
      </button>
      <button className={buttonClass} onTouchStart={() => onDirection('RIGHT')} aria-label="Right">
        ▶
      </button>
    </div>
  );
}
