const Food = ({ food }) => {
    const style = {
        left: `${food.coords[0]}%`,
        top: `${food.coords[1]}%`,
        backgroundColor: food.type === 'red' ? '#f44336' : '#2196f3',
    };

    return <div className="food" style={style}></div>
};

export default Food;