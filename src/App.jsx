import { useEffect, useState } from 'react';
import Score from './components/Score';
import Board from './components/Board';
import './App.css';

// Función para generar coordenadas aleatorias en la grilla del tablero
const getRandomCoordinates = () => {
  let min = 0;
  let max = 95;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 5) * 5;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 5) * 5;
  return [x, y];
};

const getRandomFood = () => ({
  coords: getRandomCoordinates(),
  type: Math.random() < 0.5 ? 'red' : 'blue',
});

const getWalls = () => [
  [20, 20], [25, 20], [30, 20], [35, 20],
  [20, 25], [20, 30], [20, 35],
  [60, 60], [65, 60], [70, 60], [75, 60], [80, 60], [80, 65], [80, 70],
];

function App() {
  const [snake, setSnake] = useState([[0, 0], [5, 0]]);
  const [food, setFood] = useState(getRandomFood());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [snakeColor, setSnakeColor] = useState('#4caf50');
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('bestScore')) || 0);
  const [walls] = useState(getWalls());

  // Escucha del teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.keyCode) {
        case 38: if (direction !== 'DOWN') setDirection('UP'); break;
        case 40: if (direction !== 'UP') setDirection('DOWN'); break;
        case 37: if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 39: if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Loop del juego
  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      let dots = [...snake];
      let head = dots[dots.length - 1];

      switch (direction) {
        case 'RIGHT': head = [head[0] + 5, head[1]]; break;
        case 'LEFT': head = [head[0] - 5, head[1]]; break;
        case 'DOWN': head = [head[0], head[1] + 5]; break;
        case 'UP': head = [head[0], head[1] - 5]; break;
      }

      dots.push(head);
      dots.shift();
      setSnake(dots);
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver, speed]);

  useEffect(() => {
    localStorage.setItem('bestScore', bestScore.toString());
  }, [bestScore]);

  // Detección de colisiones y comida
  useEffect(() => {
    const head = snake[snake.length - 1];

    // Colisión con paredes del tablero
    if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
      onGameOver();
    }

    // Colisión con las barreras interiores
    if (walls.some(wall => head[0] === wall[0] && head[1] === wall[1])) {
      onGameOver();
    }

    // Colisión con el cuerpo
    snake.slice(0, -1).forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) onGameOver();
    });

    // Comer comida
    if (head[0] === food.coords[0] && head[1] === food.coords[1]) {
      eatFood();
    }
  }, [snake, food, walls]);

  const eatFood = () => {
    const points = food.type === 'red' ? 5 : 3;
    const growBy = food.type === 'red' ? 3 : 1;

    setFood(getRandomFood());
    expandSnake(growBy);
    setScore(s => s + points);
    if (speed > 50) setSpeed(speed - 5);
  };

  const expandSnake = (count = 1) => {
    let newSnake = [...snake];
    for (let i = 0; i < count; i++) {
      newSnake.unshift([...snake[0]]);
    }
    setSnake(newSnake);
  };

  const onGameOver = () => {
    setGameOver(true);
    setBestScore(prev => Math.max(prev, score));
  };

  const resetGame = () => {
    setSnake([[0, 0], [5, 0]]);
    setFood(getRandomFood());
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setSpeed(200);
  };

  return(
    <div className='game-container'>
      <h1>Snake React Game</h1>
      <div className='status-row'>
        <Score score={score} bestScore={bestScore} />
        <div className='snake-controls'>
          <p>Color de la serpiente:</p>
          <div className='color-options'>
            {[
              { label: 'Verde', value: '#4caf50' },
              { label: 'Azul', value: '#2196f3' },
              { label: 'Naranja', value: '#ff9800' },
            ].map(color => (
              <button
                key={color.value}
                type='button'
                className={snakeColor === color.value ? 'active' : ''}
                onClick={() => setSnakeColor(color.value)}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>
      </div>
      <Board snake={snake} food={food} walls={walls} snakeColor={snakeColor} />
      {gameOver && (
        <div className='game-over'>
          <h2>¡Game Over!</h2>
          <button onClick={resetGame}>Reiniciar</button>
        </div>
      )}
    </div>
  );
}

export default App;