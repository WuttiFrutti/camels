import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCookie from 'react-use-cookie';
import useWebSocket from 'react-use-websocket';
import StatusBar from '../components/Nav';
import { GameStore, refreshGameState, websocketReducer } from "../gameState"
import { wsURL } from '../config/defaults';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import _axios from './../config/axios';
import { Container } from 'react-bootstrap';



const GamePage = () => {
    const [userToken, setUserToken] = useCookie("token", false);
    const { players, gameState, word} = GameStore.useState(s => s);
    const [morse, setMorse] = useState("");
    const [timer, setTimer] = useState();

    useEffect(() => {
        if (userToken) {
            refreshGameState();
        }
    }, [userToken])

    const {
        sendJsonMessage: sendMessage,
        readyState,
    } = useWebSocket(wsURL, {
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
    })

    const submit = async (e) => {
        e.preventDefault();
        await _axios.post("game/advance", { word: morse.replaceAll("/"," ") });
        refreshGameState();
        setMorse("");
    }

    const down = () => {
        console.log("yeet", Date.now())
        setTimer(Date.now());
    }

    const up = () => {
        
        if(Date.now() - timer >= 200){
            setMorse(morse + "-")
        }else{
            setMorse(morse + ".")
        }
    }

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
                        gameState === "RUNNING" ? <>
                            <Container className="mt-3">
                                <Form onSubmit={submit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Woord: { word }</Form.Label>
                                        <Form.Control readOnly value={morse} type="text" placeholder="Woord" />
                                    </Form.Group>
                                    <Button variant="primary" className="morse-button" onTouchStart={down} onTouchEnd={up}>
                                        Press
                                    </Button>
                                    <div className='d-flex justify-content-around'>
                                    <Button variant="primary" onClick={() => setMorse(morse + "/")}>
                                        Slash
                                    </Button>
                                    <Button variant="primary" onClick={() => setMorse("")}>
                                        Clear
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                    </div>
                                </Form>
                            </Container>
                        </> : null
                    }
                </>
            }
        </>
    )
}

export default GamePage