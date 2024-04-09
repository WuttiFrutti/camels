import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBar from '../components/Nav';
import { GameStore, refreshGameState } from "../gameState";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import _axios from './../config/axios';
import { Container } from 'react-bootstrap';
import { useWs } from '../hooks/useWs';
import EndGame from '../components/EndGame';
import { addToast } from '../toasts'

const GamePage = () => {

    return <>
        <StatusBar />
        <Game />
        <EndGame />
    </>;
};


const Game = () => {
    const hasToken = useWs();

    const { gameState, word } = GameStore.useState(s => s);
    const [morse, setMorse] = useState("");
    const [timer, setTimer] = useState();

    const submit = async (e) => {
        try {
            e.preventDefault();
            await _axios.post("game/advance", { word: morse.replaceAll("/", " ") });
        } catch {
            addToast({ title: "Wrong", message: "Oh no! Your submission was incorrect..." });
        } finally {
            refreshGameState();
            setMorse("");
        }

    };

    const down = () => {
        setTimer(Date.now());
    };

    const up = () => {
        if (Date.now() - timer >= 200) {
            setMorse(morse + "-");
        } else {
            setMorse(morse + ".");
        }
    };

    if (!hasToken) {
        return <p className="p-3">
            You have to login first! go <Link to="/">here</Link>
        </p>;
    }

    if (gameState === "RUNNING") {
        return <>
            <Container className="mt-3">
                <Form onSubmit={submit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Woord: {word}</Form.Label>
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
        </>;
    }

    if (gameState === "JOINING") {
        return <Container className="mt-3">
            Waiting to begin...
        </Container>;
    }

    if (gameState == "ENDED") {
        return <p className="p-3">
            The game has ended! go <Link to="/">here</Link>
        </p>;
    }

    return <p className="p-3">
        You have to login first! go <Link to="/">here</Link>
    </p>;
};

export default GamePage;
