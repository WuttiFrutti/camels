import { Store } from "pullstate";
import { useState, useEffect } from 'react';
import BToast from "react-bootstrap/Toast";

export const ToastStore = new Store({ toasts: [], maxToast: 0 });

export const Toast = ({ title, message, id }) => {
    const [show, setShow] = useState(false)

    useEffect(() => setShow(true), [])

    useEffect(() => {
        setTimeout(() => {
            removeToast(id);
        }, 3000)
    }, [])

    return (
        <>
            <BToast show={show} onClose={() => removeToast(id)}>
                <BToast.Header>
                    <strong className="mr-auto">{title}</strong>
                </BToast.Header>
                <BToast.Body>{message}</BToast.Body>
            </BToast>
        </>)
}


export const ToastsElement = () => {
    const toasts = ToastStore.useState(s => s.toasts);

    return (toasts.length ? <div className="position-fixed" style={{ top: "1rem", left: "1rem", zIndex: 1000 }}>{toasts.map((t) => <Toast key={t.id} title={t.title} message={t.message} id={t.id} />)}</div> : null)
}

export const addToast = (toast) => {
    ToastStore.update(s => { s.toasts.push({ id: s.maxToast, ...toast }); s.maxToast++; });

}

const removeToast = (id) => {
    ToastStore.update(s => {
        const index = s.toasts.findIndex(t => t.id === id);
        if (index !== -1) {
            s.toasts.splice(index, 1)
        }
    })
}