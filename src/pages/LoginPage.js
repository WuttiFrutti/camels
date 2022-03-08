import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';
import axios, { defaultCatch, silent } from '../config/axios';
import { useHistory } from "react-router-dom";
import useCookie from 'react-use-cookie';
import { addModal } from '../modals';
import CreateGameModal from './../components/CreateGameModal';
import RoomFinder from '../components/RoomFinder';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const [hasGame, setHasGame] = useState(false)
    const [userToken, setUserToken] = useCookie("token", false);
    const history = useHistory();

    const submit = (e) => {
        e.preventDefault();
        if (username && roomId) {
            axios.post("game/login", { username: username, token: roomId })
            .then(res => {
                history.push("/game")
            }).catch(defaultCatch);
        }
    }

    const leave = () => {
        axios.delete("game")
            .then(res => {
                setUserToken("");
                setHasGame(false);
            }).catch(defaultCatch);
    };

    const createNew = () => {
        // if (!username) return setValid(false);
        addModal({
            title: "Create Game",
            body: <CreateGameModal />,
        });
    }

    useEffect(() => {
        if (userToken) {
            axios.get("game")
                .then(res => {
                    setHasGame(true);
                }).catch(silent);
        }
    }, [userToken])

    return (
        <Container className="pt-5">
            <h1 className="text-center">Kamelen Race!</h1>
            <Form onSubmit={submit} className="m-auto" style={{ maxWidth: "550px" }}>
                <Form.Group controlId="form-username">
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={username} required onChange={e => setUsername(e.target.value)} type="text" placeholder="Enter username" />
                    <Form.Text className="text-muted">
                        This is the username that will be used during the game
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="form-room-id">
                    <Form.Label>Room Id</Form.Label>
                    <Form.Control required value={roomId} onChange={e => setRoomId(e.target.value)} type="text" placeholder="Enter room id" />
                </Form.Group>
                <Button variant="primary" disabled={hasGame} type="submit">
                    Submit
                </Button>
                <hr />
                <div className="d-flex">
                    <div>
                        Or<br />
                        <Button onClick={createNew} disabled={hasGame} className="mt-2 mr-3" variant="success">
                            Create a new game
                        </Button>
                    </div>
                    {hasGame ?
                        <div className="ml-auto">
                            It seems you are already in a game <br />
                            <p className="mt-2 text-center" style={{verticalAlign:"middle"}}>
                                <Button onClick={() => history.push("/game")} variant="success">
                                    Join
                                </Button>
                                <span>&nbsp;Or&nbsp;</span>
                                <Button onClick={leave} variant="danger">
                                    Leave
                                </Button>
                            </p>
                        </div> : null}
                </div>
            </Form>
            <RoomFinder/>
        </Container>
    )
}

export default LoginPage;