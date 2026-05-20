import Snake from './Snake';
import Food from './Food';

const Board = ({ snake, food}) => {
    const style = {
        width: '400px',
        height: '400px',
    };

    return (
        <div className='board' style={style}>
            <Snake snakeSegments={snake} />
            <Food dot={food}/>
        </div>
    );
};

export default Board;