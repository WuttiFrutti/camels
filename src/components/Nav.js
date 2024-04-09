import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useHistory } from "react-router-dom";
import { MyStatusCircle } from "./StatusCircle";
import { GameStore } from './../gameState';


const StatusBar = () => {
    const history = useHistory();
    const { token } = GameStore.useState(s => s);

    return (
        <Navbar bg="dark" variant="dark" expand="sm">
            <Navbar.Toggle aria-controls="status-navbar-nav" />
            <Navbar.Collapse id="status-navbar-nav" className="justify-content-between">
                <Nav>
                    <Nav.Item>
                        <Nav.Link onClick={() => history.push("/")}>Menu</Nav.Link>
                    </Nav.Item>

                </Nav>
                <Nav>
                    <Nav.Item>
                        <p className="nav-link mb-0">Room Code: {token}</p>
                    </Nav.Item>
                </Nav>
                <Nav>
                    <Nav.Item>
                        <p className="nav-link mb-0">Connection Status: <MyStatusCircle /></p>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>);
};

export default StatusBar;
