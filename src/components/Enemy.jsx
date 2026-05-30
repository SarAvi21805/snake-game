const Enemy = ({ enemy }) => {
    const style = {
        left: `${enemy.coords[0]}%`,
        top: `${enemy.coords[1]}%`,
    };

    return <div className="enemy" style={style}></div>;
};

export default Enemy;
