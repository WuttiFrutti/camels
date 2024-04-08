const Game = require("./Game");
const { HttpError } = require("../errors");
const { GameStates } = require("../enums");

class Games {
    constructor() {
        if (!Games.instance) {
            Games.instance = this;
        }
        this._games = [];
    }
    getInstance() {
        return Games.instance;
    }

    new(owner, words, token, players = []) {
        this._games.push(new Game(owner, token, players, words));
        return this._games[this._games.length - 1];
    }

    get(gameToken) {
        const game = this._games.find(game => game.token === gameToken);
        if (!game) throw new HttpError("Game not found", 404);
        return game;
    }

    getGameByOwnerToken(playerToken) {
        return this._games.find(game => game.owner.token === playerToken);
    }

    getByPlayer(playerToken) {
        return this._games.find(game => game.players.find(player => player.token === playerToken));
    }

    getPlayer(token) {
        for (const game of this._games) {
            const res = game.getPlayer(token);
            if (res) return res;
        }
        return null;
    }

    getId(gameToken) {
        return this._games.findIndex(game => game.token === gameToken);
    }

    remove(gameToken) {
        this._games = this._games.filter(g => g.token !== gameToken);
    }

    end(gameToken) {
        const game = this.get(gameToken);
        game.state = GameStates.ENDED;
    }
}





module.exports = new Games();
