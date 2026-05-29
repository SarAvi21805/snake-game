import { useEffect, useState } from 'react';
import Score from './components/Score';
import Board from './components/Board';
import Snake from './components/Snake';
import Food from './components/Food';
import './App.css';

// Función para generar comida aleatoria (múltiplos de 5 para encajar con pasos de 5%)
const getRandomCoordinates = () => {
  let min = 0;
  let max = 95;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 5) * 5;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 5) * 5;
  return [x, y];
};

function App() {
  const [snake, setSnake] = useState([[0, 0], [5, 0]]);
  const [food, setFood] = useState(getRandomCoordinates());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

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

  // Detección de colisiones y comida
  useEffect(() => {
    const head = snake[snake.length - 1];

    // Colisión con paredes
    if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
      onGameOver();
    }

    // Colisión con el cuerpo
    snake.slice(0, -1).forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) onGameOver();
    });

    // Comer comida
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(getRandomCoordinates());
      expandSnake();
      setScore(s => s + 10);
      if(speed > 50) setSpeed(speed - 5); // Aumentando la dificultad
    }
  }, [snake]);

  const expandSnake = () => {
    let newSnake = [...snake];
    newSnake.unshift([...snake[0]]); // Añadiendo un segmento al inicio duplicando el primer segmento
    setSnake(newSnake);
  };

  const onGameOver = () => {
    setGameOver(true);
  };

  const resetGame = () => {
    setSnake([[0, 0], [5, 0]]);
    setFood(getRandomCoordinates());
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setSpeed(200);
  };

  return(
    <div className='game-container'>
      <h1>Snake React Game</h1>
      <Score score={score} />
      <Board snake={snake} food={food} />
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