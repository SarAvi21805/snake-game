import { useState } from 'react';

const StartScreen = ({
  playerName,
  setPlayerName,
  difficulty,
  setDifficulty,
  snakeColor,
  setSnakeColor,
  onStart,
  onChangeView,
  view,
  scores,
  bestScore,
}) => {
  const [selectedView, setSelectedView] = useState(view);

  const handleViewChange = (next) => {
    setSelectedView(next);
    onChangeView(next);
  };

  const colors = [
    { value: '#4caf50', label: 'Verde' },
    { value: '#2196f3', label: 'Azul' },
    { value: '#ff9800', label: 'Naranja' },
    { value: '#e91e63', label: 'Rosa' },
    { value: '#9c27b0', label: 'Morado' },
    { value: '#00bcd4', label: 'Turquesa' },
  ];

  return (
    <div className="start-screen">
      <div className="start-card">
        <div className="start-tabs">
          {['menu', 'instructions', 'scores'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={selectedView === tab ? 'tab active' : 'tab'}
              onClick={() => handleViewChange(tab)}
            >
              {tab === 'menu' ? 'Inicio' : tab === 'instructions' ? 'Instrucciones' : 'Puntajes'}
            </button>
          ))}
        </div>

        {selectedView === 'menu' && (
          <>
            <h2>Bienvenido a Snake React</h2>
            <label>
              Nombre de jugador
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>
            <div className="setting-group">
              <p>Dificultad</p>
              <div className="radio-options">
                {['easy', 'normal', 'hard'].map((level) => (
                  <label key={level}>
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div className="setting-group">
              <p>Color de la serpiente</p>
              <div className="color-options">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={snakeColor === color.value ? 'color-circle active' : 'color-circle'}
                    onClick={() => setSnakeColor(color.value)}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.label}
                  />
                ))}
              </div>
            </div>
            <button className="primary-button" onClick={onStart} disabled={!playerName.trim()}>
              Comenzar juego
            </button>
            <p className="hint">Usa flechas para mover, P para pausar y R para reiniciar.</p>
          </>
        )}

        {selectedView === 'instructions' && (
          <div className="instructions-panel">
            <h2>Cómo jugar</h2>
            <ul>
              <li>Usa las flechas para mover la serpiente.</li>
              <li>Come la comida roja o azul para sumar puntos.</li>
              <li>Las paredes y el enemigo te hacen perder.</li>
              <li>Los túneles te dan un respiro y ralentizan al enemigo.</li>
              <li>P toca P para pausar y R para reiniciar.</li>
              <li>Sube de nivel al comer más comida: aparecen más paredes.</li>
            </ul>
            <div className="instruction-box">
              <strong>Puntos:</strong> roja +5 y crece 3, azul +3 y crece 1, bonus +10.
            </div>
          </div>
        )}

        {selectedView === 'scores' && (
          <div className="scoreboard-panel">
            <h2>Mejores puntajes</h2>
            {scores.length === 0 ? (
              <p>No hay puntajes guardados todavía.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Jugador</th>
                    <th>Puntaje</th>
                    <th>Dificultad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((item, index) => (
                    <tr key={`${item.name}-${item.score}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.score}</td>
                      <td>{item.difficulty}</td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="best-score-summary">
              <p>Récord: {bestScore.name} - {bestScore.score}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
