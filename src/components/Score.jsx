const Score = ({ score, bestScore }) => {
    return (
        <div className="score-board">
            <div><h2>Puntaje: {score}</h2></div>
            <div><h2>Récord: {bestScore}</h2></div>
        </div>
    );
};

export default Score;