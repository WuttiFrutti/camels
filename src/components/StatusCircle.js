import { ReadyState } from 'react-use-websocket';
import { GameStore } from './../gameState';


export const MyStatusCircle = () => {
    const connectionStatus = GameStore.useState(s => s.websocketState);

    return <StatusCircle state={connectionStatus} />;
};

const StatusCircle = ({ state, size }) => {
    const pxSize = `${size || 20}px`

    const color = {
        [ReadyState.CONNECTING]: "yellow",
        [ReadyState.OPEN]: "green",
        [ReadyState.CLOSING]: "yellow",
        [ReadyState.CLOSED]: "red",
        [ReadyState.UNINSTANTIATED]: "grey",
    }[state || -1];

    return <span style={{ backgroundColor: color, width: pxSize, height: pxSize, borderRadius: pxSize, display: "inline-block", verticalAlign: "middle" }}></span>;

};

export default StatusCircle;
