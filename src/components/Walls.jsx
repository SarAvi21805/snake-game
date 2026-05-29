const Walls = ({ walls }) => {
    return (
        <>
            {walls.map((wall, i) => {
                const style = {
                    left: `${wall[0]}%`,
                    top: `${wall[1]}%`,
                };

                return <div key={i} className="wall" style={style}></div>;
            })}
        </>
    );
};

export default Walls;
