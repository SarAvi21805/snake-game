const Snake = ({ snakeSegments }) => {
    return(
        <>
            {snakeSegments.map((dot, i) => {
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`,
                };

                return <div key={i} className="snake-segment" style={style}></div>
            })}
        </>
    );
};

export default Snake;