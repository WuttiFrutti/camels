import { ReadyState } from 'react-use-websocket';
import { GameStore } from './../gameState';


const StatusCircle = ({state, size:s}) => {
    const connectionStatus = GameStore.useState(s => s.websocketState);

    const size = s ? s + "px" : "20px"

    const color = connectionStatus === ReadyState.OPEN ? {
        [ReadyState.CONNECTING]: "yellow",
        [ReadyState.OPEN]: "green",
        [ReadyState.CLOSING]: "yellow",
        [ReadyState.CLOSED]: "red",
        [ReadyState.UNINSTANTIATED]: "grey",
    }[state] : "red";

    return <span style={{backgroundColor:color, width:size, height:size, borderRadius:size, display:"inline-block", verticalAlign:"middle"}}></span>

} 

export default StatusCircle;