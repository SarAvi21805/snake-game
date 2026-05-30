const Tunnel = ({ tunnels }) => {
    return (
        <>
            {tunnels.map((tunnel, i) => {
                const style = {
                    left: `${tunnel[0]}%`,
                    top: `${tunnel[1]}%`,
                };

                return <div key={i} className="tunnel" style={style}></div>;
            })}
        </>
    );
};

export default Tunnel;
