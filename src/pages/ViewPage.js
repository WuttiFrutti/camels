import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBar from '../components/Nav';
import { GameStore } from "../gameState";
import Button from 'react-bootstrap/Button';
import _axios from './../config/axios';
import Card from 'react-bootstrap/Card';
import { useWs } from '../hooks/useWs';
import { useMemoizedState } from '../hooks/useMemoizedState';
import StatusCircle from '../components/StatusCircle';
import EndGame from "../components/EndGame";

const ViewPage = () => {
    return <>
        <StatusBar />
        <View />
        <EndGame />
    </>;
};

const View = () => {
    const hasToken = useWs(true);
    const { players, words } = GameStore.useState();
    const gameState = useMemoizedState(s => s.gameState);

    const start = async () => {
        await _axios.put("game/state", { state: "RUNNING" });
    };

    if (!hasToken) {
        return <p className="p-3">
            You have to login first! go <Link to="/">here</Link>
        </p>;
    }


    if (gameState === "JOINING") {
        return <>
            <div>
                {
                    players.map(p =>
                        <Card className='p-3 m-2 justify-content-between flex-row'>
                            {p.username}
                            <StatusCircle state={p.readyState} />
                        </Card>
                    )
                }
            </div>
            <br />
            <Button className="m-3" onClick={start}>Start</Button>
        </>;
    }




    if (gameState === "RUNNING") {
        return <>
            <div className="d-flex">
                <div className='d-flex flex-column camel-container mt-3'>
                    {players.map(p => <PlayerCamel key={p.id} player={p} words={words} />)}
                </div>
                <div className='finishline'></div>
                <div className="finish">Finish!</div>
            </div>
        </>;
    }

    return null;
};

const PlayerCamel = ({ player, words }) => {
    const [image, setImage] = useState("standing-camel.gif");
    const [oldIndex, setOldIndex] = useState(player.index);

    useEffect(() => {
        if (oldIndex !== player.index) {
            setImage("walking-camel.gif");
            setTimeout(() => {
                setImage("standing-camel.gif");
            }, 2000);
        }
        setOldIndex(player.index);

    }, [player, oldIndex]);

    return <div className='player-camel' style={{ left: `${(player.index / words.length) * 100}%` }}>
        <img className='img-fluid' src={image} alt="camel" />
        <Card className="p-2 flex-row justify-content-between">
            <span>{player.username} {player.index || 0} / {words.length}</span>
            <StatusCircle state={player.readyState} />
        </Card>
    </div>;
};

export default ViewPage;
