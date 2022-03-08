import { Store } from "pullstate";
import axios from './config/axios';
import { addToast } from './toasts';
import { setCookie } from 'react-use-cookie';
import { addModal } from "./modals";

export const GameStore = new Store({ players: [], you: {}, word: "", words: [], token: null, websocketState: null, sendMessage: null, gameState: "JOINING" });


export const websocketReducer = async ({ data }) => {
    const message = JSON.parse(data);
    switch (message.action) {
        case "PLAYER_DISCONNECTED":
        case "PLAYER_CONNECTED":
        case "PLAYER_JOINED":
        case "PLAYER_LEFT": {
            const { data } = await axios.get("game");
            GameStore.update(s => { s.players = data.players; });
        }
            break;
        case "GAME_ENDED":
            setCookie("token", "");
            addToast({ title: "Game Ended", message: "The game has ended. You cannot interact with it now" });
            break;
        case "STATE_CHANGE": {
            const { data } = await axios.get("game");
            GameStore.update(s => { s.gameState = data.state; s.word = data.word; s.players = data.players; s.words = data.words; s.you = data.you });
        }
            break;
        default:

            break;
    }
}

export const refreshGameState = async () => {
    try {
        const { data } = await axios.get("game");
        GameStore.update(s => {
            s.players = data.players;
            s.you = data.you;
            s.token = data.token;
            s.words = data.words
            s.gameState = data.state;
            s.word = data.word;
        });
    } catch (err) { }
}