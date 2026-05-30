const Bonus = ({ bonus }) => {
    const style = {
        left: `${bonus.coords[0]}%`,
        top: `${bonus.coords[1]}%`,
        backgroundColor: bonus.type === 'gold' ? '#ffeb3b' : '#ffffff',
        border: '2px solid #fbc02d',
        boxShadow: '0 0 8px rgba(255, 235, 59, 0.6)',
    };

    return <div className="bonus" style={style}></div>;
};

export default Bonus;
