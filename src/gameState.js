import { Store } from "pullstate";
import axios from './config/axios';
import { setCookie } from 'react-use-cookie';

const initState = { players: [], you: {}, word: "", words: [], token: null, websocketState: null, sendMessage: null, gameState: '' };

export const GameStore = new Store(initState);


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
            GameStore.update(initState);
            break;
        case "STATE_CHANGE": {
            const { data } = await axios.get("game");
            GameStore.update(s => { s.gameState = data.state; s.word = data.word; s.players = data.players; s.words = data.words; s.you = data.you; });
        }
            break;
        default:

            break;
    }
};

export const refreshGameState = async () => {
    try {
        const { data } = await axios.get("game");
        GameStore.update(s => {
            s.players = data.players;
            s.you = data.you;
            s.token = data.token;
            s.words = data.words;
            s.gameState = data.state;
            s.word = data.word;
        });
    } catch (err) { }
};
