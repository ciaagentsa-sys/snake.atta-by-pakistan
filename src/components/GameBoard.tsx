import { Position } from '../hooks/useSnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  gameState: string;
}

export function GameBoard({ snake, food, gridSize, gameState }: GameBoardProps) {
  const cellSize = 100 / gridSize;

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
      {/* Grid background */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: gridSize + 1 }).map((_, i) => (
            <g key={i}>
              <line
                x1={`${(i / gridSize) * 100}%`}
                y1="0"
                x2={`${(i / gridSize) * 100}%`}
                y2="100%"
                stroke="#6ee7b7"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1={`${(i / gridSize) * 100}%`}
                x2="100%"
                y2={`${(i / gridSize) * 100}%`}
                stroke="#6ee7b7"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>

        {/* Food */}
        <div
          className="absolute rounded-full transition-all duration-200 animate-pulse"
          style={{
            width: `${cellSize}%`,
            height: `${cellSize}%`,
            left: `${food.x * cellSize}%`,
            top: `${food.y * cellSize}%`,
            background: 'radial-gradient(circle, #f87171 30%, #ef4444 70%)',
            boxShadow: '0 0 12px rgba(239, 68, 68, 0.6), 0 0 24px rgba(239, 68, 68, 0.3)',
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const opacity = 1 - (index / snake.length) * 0.4;
          return (
            <div
              key={index}
              className={`absolute transition-all duration-75 ${isHead ? 'z-10' : ''}`}
              style={{
                width: `${cellSize}%`,
                height: `${cellSize}%`,
                left: `${segment.x * cellSize}%`,
                top: `${segment.y * cellSize}%`,
                padding: '1px',
              }}
            >
              <div
                className={`w-full h-full ${isHead ? 'rounded-md' : 'rounded-sm'}`}
                style={{
                  background: isHead
                    ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
                    : `rgba(16, 185, 129, ${opacity})`,
                  boxShadow: isHead
                    ? '0 0 10px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.3)'
                    : 'none',
                  border: isHead ? '1px solid #6ee7b7' : '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {isHead && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex gap-[2px]">
                      <div className="w-[3px] h-[3px] rounded-full bg-white shadow-[0_0_3px_white]" />
                      <div className="w-[3px] h-[3px] rounded-full bg-white shadow-[0_0_3px_white]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Game state overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
            <div className="text-center animate-fade-in">
              <div className="text-5xl mb-3">🐍</div>
              <h2 className="text-xl font-bold text-emerald-400 mb-2">Snake Game</h2>
              <p className="text-sm text-gray-400">Press Space or tap Start to play</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
            <div className="text-center animate-fade-in">
              <div className="text-4xl mb-2">⏸️</div>
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Paused</h2>
              <p className="text-sm text-gray-400">Press Space to resume</p>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl">
            <div className="text-center animate-fade-in">
              <div className="text-4xl mb-2">💀</div>
              <h2 className="text-xl font-bold text-red-400 mb-2">Game Over</h2>
              <p className="text-sm text-gray-400">Press Space or tap Restart</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
