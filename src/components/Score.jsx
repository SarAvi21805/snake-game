const Score = ({ playerName, score, bestScore, level }) => {
    return (
        <div className="score-board">
            <div>
                <h3>{playerName}</h3>
                <h2>Puntaje: {score}</h2>
            </div>
            <div>
                <h2>Récord: {bestScore.score}</h2>
                <p>{bestScore.name}</p>
            </div>
            <div>
                <h2>Nivel: {level}</h2>
            </div>
        </div>
    );
};

export default Score;