import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCookie from 'react-use-cookie';
import useWebSocket from 'react-use-websocket';
import StatusBar from '../components/Nav';
import { GameStore, refreshGameState, websocketReducer } from "../gameState";
import { wsURL } from '../config/defaults';
import Button from 'react-bootstrap/Button';
import _axios from './../config/axios';
import Card from 'react-bootstrap/Card';



const ViewPage = () => {
    const [userToken, setUserToken] = useCookie("token", false);
    const { players, gameState, words } = GameStore.useState(s => s);


    useEffect(() => {
        if (userToken) {
            refreshGameState();
        }
    }, [userToken]);

    const {
        sendJsonMessage: sendMessage,
        readyState,
    } = useWebSocket(wsURL + "/owner", {
        onMessage: websocketReducer,
        shouldReconnect: (closeEvent) => {
            if (closeEvent.reason === "NOT_LOGGED_IN") {
                setUserToken("");
            }
            return !(closeEvent.code >= 4000 && closeEvent.code < 5000);
        },
    });

    useEffect(() => {
        GameStore.update(s => { s.sendMessage = sendMessage; s.websocketState = readyState; });
    });

    const start = async () => {
        await _axios.put("game/state", { state: "RUNNING" });
    };

    const getStyle = width => ({ bottom: "1rem", width: `${width}rem`, right: gameState === "JOINING" ? `calc(50% - (${width}rem / 2))` : "1rem" });

    return (
        <>
            <StatusBar />
            {!userToken ?
                <p className="p-3">
                    You have to login first! go <Link to="/">here</Link>
                </p>
                :
                <>
                    {
                        gameState === "JOINING" ? <><div>
                            {players.map(p =>
                                <Card className='p-3 m-2'>
                                    {p.username}
                                </Card>)}

                        </div>
                            <br />
                            <Button className="m-3" onClick={start}>Start</Button></> : <div className="d-flex"><div className='d-flex flex-column camel-container mt-3'>
                                {players.map(p => <PlayerCamel key={p.id} player={p} words={words} />)}
                            </div>
                            <div className="finish">
                                | Finish!
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
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

    }, [player]);

    return <div className='player-camel' style={{ left: `${(player.index / words.length) * 100}%` }}>
        <img className='img-fluid' src={image} alt="camel" />
        <Card className="p-2">{player.username} {player.index} / {words.length}</Card>
    </div>;
};

export default ViewPage;
