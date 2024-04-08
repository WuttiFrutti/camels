import { Store } from "pullstate";
import Modal from "react-bootstrap/Modal";


export const ModalStore = new Store({ modal: null });

export const ModalElement = () => {
    const modal = ModalStore.useState(s => s.modal);

    return (modal ? <Modal show={modal.show !== false} onHide={hideModal}>
        <Modal.Header closeButton>
            <Modal.Title>{modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.body}</Modal.Body>
    </Modal> : null);
};

export const hideModal = () => {
    ModalStore.update(s => { s.modal.show = false; });
};
export const addModal = (modal) => {
    ModalStore.update(s => { s.modal = modal; });
};
