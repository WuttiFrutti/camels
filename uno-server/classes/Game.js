const { v4: uuid } = require('uuid');
const { GameStates } = require('../enums');

class Game {
    constructor(owner, token = uuid(), players = [], words) {
        this.token = token;
        this.players = [];
        this.owner = owner;
        this.state = GameStates.JOINING;
        this.words = words;

        players.forEach(player => this.addPlayer(player));
    }


    send(message, exclude) {
        [this.owner,...this.players].filter(p => p.token !== exclude).forEach(player => {
            player.send(message, exclude);
        });
    }

    getInfoForPlayer(playerToken) {
        const player = this.players.find(player => player.token === playerToken);
        return playerToken ? ({
            state: this.state,
            token: this.token,
            players: this.players.filter(player => player.token !== playerToken).map(player => player.info),
            you: {
                owner: this.owner.token === playerToken,
                ...player,
            },
            word: this.words[player.index]
        }) : ({
            state: this.state,
            token: this.token,
            players: this.players.map(player => ({
                owner: this.owner.token === playerToken,
                ...player.info,
            }))
        });
    }

    getPlayer(token) {
        return this.players.find(player => player.token === token)
    }

    getPlayerIndex(token) {
        return this.players.findIndex(player => player.token === token)
    }

    addPlayer(player) {
        player.id = this.players.length + 1;
        this.players.push(player);
        return player;
    }

    removePlayer(player) {
        this.players.splice(this.getPlayerIndex(player), 1);
    }

    getPlayerById(playerId = this.currentPlayer) {
        return this.players.find(p => p.id === playerId);
    }


}

module.exports = Game;