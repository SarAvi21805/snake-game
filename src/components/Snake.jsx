const Snake = ({ snakeSegments, snakeColor }) => {
    return(
        <>
            {snakeSegments.map((dot, i) => {
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`,
                    backgroundColor: snakeColor,
                };

                return <div key={i} className="snake-segment" style={style}></div>
            })}
        </>
    );
};

export default Snake;