import Snake from './Snake';
import Food from './Food';
import Walls from './Walls';

const Board = ({ snake, food, walls, snakeColor }) => {
    const style = {
        width: '400px',
        height: '400px',
    };

    return (
        <div className='board' style={style}>
            <Snake snakeSegments={snake} snakeColor={snakeColor} />
            <Food food={food} />
            <Walls walls={walls} />
        </div>
    );
};

export default Board;