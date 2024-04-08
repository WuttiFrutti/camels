import axios, { defaultCatch } from './../config/axios';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { hideModal } from './../modals';


const CreateGameModal = () => {
    const history = useHistory();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [fields, setFields] = useState({
        roomId: "",
        words: ""
    });

    const start = (e) => {
        e.preventDefault();
        axios.post("game", { settings: { roomId: fields.roomId === "" ? null : fields.roomId, words: fields.words } })
            .then(res => {
                history.push("/view");
            }).catch(defaultCatch);
        hideModal();
    };

    const setField = (change) => {
        setFields({ ...fields, ...change });
    };



    return (<>
        <Form onSubmit={start} className="m-auto" style={{ maxWidth: "550px" }}>
            <Form.Group>
                <Form.Control value={fields["roomId"]} onChange={e => setField({ roomId: e.target.value })} type="text" placeholder="Room Name" />
                <Form.Text className="text-muted">
                    Name that others use to enter the game. Leave blank for auto-generated
                </Form.Text>
            </Form.Group>
            <Form.Group className="mt-3">
                <Form.Control required value={fields["words"]} onChange={e => setField({ words: e.target.value.split(",") })} as="textarea" type="textarea" placeholder="Words" />
                <Form.Label className="text-muted">
                    Words used in the game. Split with ",".
                </Form.Label>
            </Form.Group>
            <div className="d-flex justify-content-between">
                <Button variant="primary" type="submit">
                    Start!
                </Button>
            </div>

        </Form>
    </>);

};

export default CreateGameModal;
