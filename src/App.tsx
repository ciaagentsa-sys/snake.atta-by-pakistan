import { useRef } from 'react';
import { useSnakeGame, Difficulty } from './hooks/useSnakeGame';
import { useSwipe } from './hooks/useSwipe';
import { GameBoard } from './components/GameBoard';
import { TouchControls } from './components/TouchControls';

function App() {
  const {
    snake,
    food,
    gameState,
    score,
    difficulty,
    highScores,
    gridSize,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
    setDifficulty,
  } = useSnakeGame();

  const boardRef = useRef<HTMLDivElement>(null);
  useSwipe(boardRef, changeDirection, gameState === 'playing');

  const difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
    { value: 'easy', label: 'Easy', color: 'emerald' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'hard', label: 'Hard', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-[500px] mb-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            🐍 Snake
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Score</div>
              <div className="text-xl font-bold text-emerald-400 tabular-nums">{score}</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Best</div>
              <div className="text-xl font-bold text-yellow-400 tabular-nums">
                {highScores[difficulty]}
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty selector */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Difficulty:</span>
          {difficultyOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                difficulty === opt.value
                  ? opt.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : opt.color === 'yellow'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  : 'bg-slate-800/50 text-gray-500 border border-slate-700/50 hover:text-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {gameState === 'idle' || gameState === 'gameover' ? (
            <button
              onClick={startGame}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98]"
            >
              {gameState === 'gameover' ? '🔄 Play Again' : '▶ Start Game'}
            </button>
          ) : (
            <>
              <button
                onClick={pauseGame}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 border border-slate-600/50 hover:bg-slate-700 text-gray-300 transition-all duration-200 active:scale-[0.98]"
              >
                {gameState === 'paused' ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button
                onClick={resetGame}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 border border-slate-600/50 hover:bg-slate-700 text-gray-300 transition-all duration-200 active:scale-[0.98]"
              >
                🔄 Restart
              </button>
            </>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div ref={boardRef} className="w-full max-w-[500px] touch-none">
        <GameBoard
          snake={snake}
          food={food}
          gridSize={gridSize}
          gameState={gameState}
        />
      </div>

      {/* Touch Controls (mobile) */}
      <TouchControls
        onDirection={changeDirection}
        disabled={gameState !== 'playing'}
      />

      {/* Instructions */}
      <div className="mt-4 text-center text-xs text-gray-600 hidden md:block">
        <p>Arrow keys or WASD to move • Space to pause/resume</p>
      </div>
      <div className="mt-3 text-center text-xs text-gray-600 md:hidden">
        <p>Swipe on the board or use buttons to move</p>
      </div>
    </div>
  );
}

export default App;
