import Snake from './Snake';
import Food from './Food';
import Walls from './Walls';
import Tunnel from './Tunnel';
import Bonus from './Bonus';
import Enemy from './Enemy';

const Board = ({ snake, food, walls, tunnels, snakeColor, bonus, enemy }) => {
    const style = {
        width: '400px',
        height: '400px',
    };

    return (
        <div className='board' style={style}>
            <Snake snakeSegments={snake} snakeColor={snakeColor} />
            <Food food={food} />
            <Walls walls={walls} />
            <Tunnel tunnels={tunnels} />
            {bonus && <Bonus bonus={bonus} />}
            <Enemy enemy={enemy} />
        </div>
    );
};

export default Board;