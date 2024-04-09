import { useEffect } from 'react';
import useCookie from 'react-use-cookie';
import useWebSocket from 'react-use-websocket';
import { GameStore, refreshGameState, websocketReducer } from "../gameState";
import { wsURL } from '../config/defaults';
import _axios from './../config/axios';

export const useWs = (isOwner = false) => {
    const [userToken, setUserToken] = useCookie("token", false);

    useEffect(() => {
        if (userToken) {
            refreshGameState();
        }
    }, [userToken]);

    const {
        sendJsonMessage: sendMessage,
        readyState,
    } = useWebSocket(isOwner ? wsURL + '/owner' : wsURL, {
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

    return !!userToken;
};
