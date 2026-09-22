import { useState, useEffect, useCallback, useRef } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;
const SPEEDS: Record<Difficulty, number> = {
  easy: 150,
  medium: 100,
  hard: 60,
};

const getInitialSnake = (): Position[] => [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const getRandomFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(seg => seg.x === food.x && seg.y === food.y));
  return food;
};

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(getInitialSnake());
  const [food, setFood] = useState<Position>(() => getRandomFood(getInitialSnake()));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [highScores, setHighScores] = useState<Record<Difficulty, number>>(() => {
    try {
      const saved = localStorage.getItem('snake-high-scores');
      return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
    } catch {
      return { easy: 0, medium: 0, hard: 0 };
    }
  });

  const directionRef = useRef<Direction>(direction);
  const gameStateRef = useRef<GameState>(gameState);
  const snakeRef = useRef<Position[]>(snake);
  const foodRef = useRef<Position>(food);
  const lastDirectionRef = useRef<Direction>(direction);
  const scoreRef = useRef(score);

  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const saveHighScore = useCallback((newScore: number, diff: Difficulty) => {
    setHighScores(prev => {
      if (newScore > prev[diff]) {
        const updated = { ...prev, [diff]: newScore };
        try {
          localStorage.setItem('snake-high-scores', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = getInitialSnake();
    setSnake(initialSnake);
    setFood(getRandomFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    lastDirectionRef.current = 'RIGHT';
    setScore(0);
    setGameState('idle');
  }, []);

  const startGame = useCallback(() => {
    if (gameState === 'gameover' || gameState === 'idle') {
      const initialSnake = getInitialSnake();
      setSnake(initialSnake);
      setFood(getRandomFood(initialSnake));
      setDirection('RIGHT');
      directionRef.current = 'RIGHT';
      lastDirectionRef.current = 'RIGHT';
      setScore(0);
    }
    setGameState('playing');
  }, [gameState]);

  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  const changeDirection = useCallback((newDir: Direction) => {
    const current = lastDirectionRef.current;
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opposites[newDir] !== current) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const dir = directionRef.current;

      lastDirectionRef.current = dir;

      switch (dir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState('gameover');
        saveHighScore(scoreRef.current, difficulty);
        return;
      }

      // Check self collision
      if (currentSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameState('gameover');
        saveHighScore(scoreRef.current, difficulty);
        return;
      }

      const newSnake = [head, ...currentSnake];
      const currentFood = foodRef.current;

      // Check food collision
      if (head.x === currentFood.x && head.y === currentFood.y) {
        setScore(prev => prev + 1);
        setFood(getRandomFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }, SPEEDS[difficulty]);

    return () => clearInterval(interval);
  }, [gameState, difficulty, saveHighScore]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
        W: 'UP',
        S: 'DOWN',
        A: 'LEFT',
        D: 'RIGHT',
      };

      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        if (gameStateRef.current === 'idle' || gameStateRef.current === 'gameover') {
          startGame();
        } else {
          pauseGame();
        }
        return;
      }

      const newDir = keyMap[e.key];
      if (newDir) {
        e.preventDefault();
        if (gameStateRef.current === 'idle') {
          startGame();
        }
        if (gameStateRef.current === 'playing') {
          changeDirection(newDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, startGame, pauseGame]);

  return {
    snake,
    food,
    direction,
    gameState,
    score,
    difficulty,
    highScores,
    gridSize: GRID_SIZE,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
    setDifficulty,
  };
}
