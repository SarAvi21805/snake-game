import { useEffect, useState } from 'react';
import Score from './components/Score';
import Board from './components/Board';
import StartScreen from './components/StartScreen';
import './App.css';

const gridSize = 95;

const equalCoords = (a, b) => a[0] === b[0] && a[1] === b[1];
const isInList = (position, list) => list.some((item) => equalCoords(item, position));
const normalizePositions = (positions) => positions.filter((pos, index, self) => self.findIndex((other) => equalCoords(pos, other)) === index);

const getRandomCoordinates = (blocked = []) => {
  let coordinates;
  do {
    const x = Math.floor((Math.random() * (gridSize + 1)) / 5) * 5;
    const y = Math.floor((Math.random() * (gridSize + 1)) / 5) * 5;
    coordinates = [x, y];
  } while (isInList(coordinates, blocked));
  return coordinates;
};

const getRandomFood = (blocked = []) => ({
  coords: getRandomCoordinates(blocked),
  type: Math.random() < 0.5 ? 'red' : 'blue',
});

const getRandomBonus = (blocked = []) => ({
  coords: getRandomCoordinates(blocked),
  type: 'gold',
});

const getInitialSnake = () => [[0, 0], [5, 0]];

const getInitialSpeed = (difficulty) => {
  if (difficulty === 'easy') return 220;
  if (difficulty === 'hard') return 150;
  return 190;
};

const getBaseWalls = (difficulty) => {
  if (difficulty === 'hard') {
    return normalizePositions([
      [20, 20], [25, 20], [30, 20], [35, 20], [20, 25], [20, 30], [20, 35],
      [60, 60], [65, 60], [70, 60], [75, 60], [80, 60], [80, 65], [80, 70],
      [45, 45], [50, 45], [55, 45], [45, 50], [45, 55],
    ]);
  }

  if (difficulty === 'easy') {
    return normalizePositions([
      [30, 30], [35, 30], [40, 30], [30, 35], [30, 40],
      [70, 70], [75, 70], [80, 70], [70, 75], [70, 80],
    ]);
  }

  return normalizePositions([
    [20, 20], [25, 20], [30, 20], [35, 20], [20, 25], [20, 30], [20, 35],
    [60, 60], [65, 60], [70, 60], [75, 60], [80, 60], [80, 65], [80, 70],
  ]);
};

const getExtraWalls = (level) => {
  if (level === 2) return [[10, 50], [15, 50], [20, 50], [25, 50]];
  if (level === 3) return [[50, 10], [50, 15], [50, 20], [50, 25]];
  if (level === 4) return [[60, 30], [65, 30], [70, 30], [75, 30], [80, 30]];
  if (level >= 5) return [[10, 70], [15, 70], [20, 70], [25, 70], [30, 70], [35, 70]];
  return [];
};

const getRandomTunnelPositions = (walls) => {
  const tunnels = [];
  const directions = [[5, 0], [-5, 0], [0, 5], [0, -5]];
  const shuffledWalls = [...walls].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffledWalls.length && tunnels.length < 3; i++) {
    const wall = shuffledWalls[i];
    const possible = directions
      .map(([dx, dy]) => [wall[0] + dx, wall[1] + dy])
      .filter((pos) => pos[0] >= 0 && pos[0] <= gridSize && pos[1] >= 0 && pos[1] <= gridSize)
      .filter((pos) => !isInList(pos, walls) && !isInList(pos, tunnels));

    if (possible.length > 0) {
      tunnels.push(possible[Math.floor(Math.random() * possible.length)]);
    }
  }

  if (tunnels.length === 0) {
    tunnels.push([5, 5]);
  }

  return tunnels;
};

const getRandomLayout = (difficulty) => {
  const baseWalls = getBaseWalls(difficulty);
  const extraWalls = [];
  const areaOptions = [10, 20, 30, 40, 50, 60, 70];

  for (let i = 0; i < 2; i++) {
    const x = areaOptions[Math.floor(Math.random() * areaOptions.length)];
    const y = areaOptions[Math.floor(Math.random() * areaOptions.length)];
    extraWalls.push([x, y], [x + 5, y], [x, y + 5]);
    if (Math.random() > 0.5) extraWalls.push([x + 10, y]);
  }

  const allWalls = normalizePositions([...baseWalls, ...extraWalls]);
  return {
    walls: allWalls,
    tunnels: getRandomTunnelPositions(allWalls),
  };
};

const getStoredScores = () => {
  const stored = localStorage.getItem('snakeScoresList');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

function App() {
  const [playerName, setPlayerName] = useState(localStorage.getItem('snakePlayerName') || '');
  const [difficulty, setDifficulty] = useState('normal');
  const [snakeColor, setSnakeColor] = useState('#4caf50');
  const [gameState, setGameState] = useState('start');
  const [startView, setStartView] = useState('menu');
  const [snake, setSnake] = useState(getInitialSnake());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(getInitialSpeed(difficulty));
  const [score, setScore] = useState(0);
  const [scoreboard, setScoreboard] = useState(getStoredScores);
  const [level, setLevel] = useState(1);
  const [initialLayout] = useState(() => getRandomLayout(difficulty));
  const [walls, setWalls] = useState(initialLayout.walls);
  const [tunnels, setTunnels] = useState(initialLayout.tunnels);
  const [food, setFood] = useState(getRandomFood([...snake, ...initialLayout.walls, ...initialLayout.tunnels]));
  const [bonus, setBonus] = useState(null);
  const [enemy, setEnemy] = useState({ coords: [80, 80] });
  const [foodEaten, setFoodEaten] = useState(0);
  const [bonusTimer, setBonusTimer] = useState(0);
  const [enemyTick, setEnemyTick] = useState(0);

  const bestScore = scoreboard[0] || { score: 0, name: 'Nadie' };

  const addScoreRecord = (record) => {
    const updated = [...scoreboard, record]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setScoreboard(updated);
    localStorage.setItem('snakeScoresList', JSON.stringify(updated));
  };

  const goToMenu = () => {
    setGameState('start');
    setStartView('menu');
  };

  const goToScores = () => {
    setGameState('start');
    setStartView('scores');
  };

  useEffect(() => {
    localStorage.setItem('snakeBestScore', JSON.stringify(bestScore));
  }, [bestScore]);

  useEffect(() => {
    localStorage.setItem('snakePlayerName', playerName);
  }, [playerName]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'start') return;

      if (e.keyCode === 80) {
        setGameState((current) => (current === 'playing' ? 'paused' : 'playing'));
        return;
      }

      if (e.keyCode === 82) {
        restartGame();
        return;
      }

      if (gameState !== 'playing') return;

      switch (e.keyCode) {
        case 38:
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 40:
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 37:
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 39:
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        let head = newSnake[newSnake.length - 1];

        switch (direction) {
          case 'RIGHT':
            head = [head[0] + 5, head[1]];
            break;
          case 'LEFT':
            head = [head[0] - 5, head[1]];
            break;
          case 'DOWN':
            head = [head[0], head[1] + 5];
            break;
          case 'UP':
            head = [head[0], head[1] - 5];
            break;
          default:
            break;
        }

        newSnake.push(head);
        newSnake.shift();

        // Verificar si la cabeza entra en un túnel
        const tunnelIndex = tunnels.findIndex((tunnel) => equalCoords(head, tunnel));
        if (tunnelIndex !== -1) {
          // Encontrar otro túnel (el siguiente en el array)
          const exitIndex = (tunnelIndex + 1) % tunnels.length;
          const exitTunnel = tunnels[exitIndex];
          // Teletransportar la cabeza al otro túnel
          newSnake[newSnake.length - 1] = [...exitTunnel];
        }

        setEnemyTick((current) => current + 1);
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, gameState, speed, tunnels]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const head = snake[snake.length - 1];

    const isOutside = head[0] < 0 || head[0] > gridSize || head[1] < 0 || head[1] > gridSize;
    const hitsWall = isInList(head, walls);
    const hitsBody = snake.slice(0, -1).some((segment) => equalCoords(segment, head));
    const hitsEnemy = equalCoords(head, enemy.coords);

    if (isOutside || hitsWall || hitsBody || hitsEnemy) {
      setGameState('gameover');
      addScoreRecord({ score, name: playerName || 'Anónimo', difficulty, date: new Date().toLocaleDateString() });
      return;
    }

    if (bonus && equalCoords(head, bonus.coords)) {
      setScore((prevScore) => prevScore + 10);
      setBonus(null);
    }

    if (equalCoords(head, food.coords)) {
      eatFood();
    }
  }, [snake, food, bonus, walls, enemy, gameState, score, playerName]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const snakeHead = snake[snake.length - 1];
    const inTunnel = isInList(snakeHead, tunnels);
    const delay = inTunnel ? (difficulty === 'hard' ? 2 : 3) : (difficulty === 'hard' ? 3 : difficulty === 'normal' ? 4 : 5);
    if (enemyTick === 0 || enemyTick % delay !== 0) return;

    setEnemy((prevEnemy) => {
      const head = snake[snake.length - 1];
      const [ex, ey] = prevEnemy.coords;
      const dx = head[0] - ex;
      const dy = head[1] - ey;
      const stepX = Math.sign(dx) * 5;
      const stepY = Math.sign(dy) * 5;

      const tryPosition = (pos) => {
        if (pos[0] < 0 || pos[0] > gridSize || pos[1] < 0 || pos[1] > gridSize) return false;
        if (isInList(pos, walls)) return false;
        if (isInList(pos, snake.slice(0, -1))) return false;
        return true;
      };

      const primary = Math.abs(dx) >= Math.abs(dy) ? [ex + stepX, ey] : [ex, ey + stepY];
      const alternate = Math.abs(dx) >= Math.abs(dy) ? [ex, ey + stepY] : [ex + stepX, ey];

      if (tryPosition(primary)) return { coords: primary };
      if (tryPosition(alternate)) return { coords: alternate };
      return prevEnemy;
    });
  }, [enemyTick, snake, gameState, walls, tunnels, difficulty]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (bonus) return;

    setBonusTimer((current) => {
      const next = current + 1;
      if (next >= 8) {
        setBonus(getRandomBonus([...snake, ...walls, food.coords, enemy.coords]));
        return 0;
      }
      return next;
    });
  }, [snake, gameState, bonus, walls, food, enemy]);

  useEffect(() => {
    if (!bonus) return;
    const timeout = setTimeout(() => setBonus(null), 12000);
    return () => clearTimeout(timeout);
  }, [bonus]);

  useEffect(() => {
    if (level <= 1) return;
    setWalls((currentWalls) => normalizePositions([...currentWalls, ...getExtraWalls(level)]));
  }, [level]);

  const eatFood = () => {
    const points = food.type === 'red' ? 5 : 3;
    const growBy = food.type === 'red' ? 3 : 1;
    const newSpeed = Math.max(60, speed - (difficulty === 'hard' ? 16 : difficulty === 'easy' ? 8 : 12));

    setScore((prevScore) => prevScore + points);
    setFoodEaten((prevCount) => {
      const nextCount = prevCount + 1;
      if (nextCount % 3 === 0) setLevel((current) => Math.min(5, current + 1));
      return nextCount;
    });
    expandSnake(growBy);
    setSpeed(newSpeed);
    setFood(getRandomFood([...snake, ...walls, ...tunnels, enemy.coords]));
  };

  const expandSnake = (count = 1) => {
    setSnake((prevSnake) => {
      const updatedSnake = [...prevSnake];
      for (let i = 0; i < count; i++) {
        updatedSnake.unshift([...prevSnake[0]]);
      }
      return updatedSnake;
    });
  };

  const restartGame = () => {
    const initialSnake = getInitialSnake();
    const initialEnemy = { coords: [80, 80] };
    const initialLayout = getRandomLayout(difficulty);
    setSnake(initialSnake);
    setDirection('RIGHT');
    setSpeed(getInitialSpeed(difficulty));
    setScore(0);
    setLevel(1);
    setWalls(initialLayout.walls);
    setTunnels(initialLayout.tunnels);
    setFood(getRandomFood([...initialSnake, ...initialLayout.walls, ...initialLayout.tunnels, initialEnemy.coords]));
    setBonus(null);
    setEnemy(initialEnemy);
    setFoodEaten(0);
    setBonusTimer(0);
    setEnemyTick(0);
    setGameState('playing');
  };

  const handleStart = () => {
    restartGame();
  };

  if (gameState === 'start') {
    return (
      <StartScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        snakeColor={snakeColor}
        setSnakeColor={setSnakeColor}
        view={startView}
        onChangeView={setStartView}
        onStart={handleStart}
        scores={scoreboard}
        bestScore={bestScore}
      />
    );
  }

  return (
    <div className="game-container">
      <h1>Snake React Game</h1>
      <div className="status-row">
        <Score playerName={playerName} score={score} bestScore={bestScore} level={level} />
        <div className="game-info">
          <p>Dificultad: {difficulty}</p>
          <p>Velocidad: {Math.round(1000 / speed)} pts/s</p>
          <p>Presiona P para pausar y R para reiniciar.</p>
        </div>
      </div>
      <Board snake={snake} food={food} walls={walls} tunnels={tunnels} snakeColor={snakeColor} bonus={bonus} enemy={enemy} />

      {gameState === 'paused' && (
        <div className="overlay-screen">
          <div className="overlay-card">
            <h2>Juego en pausa</h2>
            <p>Presiona P para continuar.</p>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="overlay-screen">
          <div className="overlay-card">
            <h2>¡Game Over!</h2>
            <p>{playerName}, tu puntaje fue {score}</p>
            <div className="overlay-actions">
              <button onClick={restartGame}>Reiniciar</button>
              <button onClick={goToMenu}>Menú principal</button>
              <button onClick={goToScores}>Ver puntajes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
