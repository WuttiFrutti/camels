const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');

const Games = require('../classes/Games');
const Player = require('../classes/Player');
const { GameStates } = require('../enums');
const { HttpError } = require("../errors");
const { isOwner } = require('../middleware');
const morse = require('morse-decoder');



router.post('/login', (req, res) => {
    const game = Games.get(req.body.token);
    if (game.state === GameStates.JOINING) {
        const { token } = game.addPlayer(new Player(req.body.username));
        res.cookie("token", token);
        res.send({ token: token });
    } else {
        throw new HttpError("Game has already started", 403);
    }
});

router.get('/:token', (req, res) => {
    const game = Games.get(req.params.token);
    res.send(game.getInfoForPlayer(req.cookies.token));
});

router.get('', (req, res) => {
    const game = Games.getByPlayer(req.cookies.token);
    if (game) {
        res.send(game.getInfoForPlayer(req.cookies.token));
    } else {
        const game = Games.getGameByOwnerToken(req.cookies.token);
        if (game) {
            res.send(game);
        } else {
            throw new HttpError("First log in to a game", 400);
        }
    }
});

router.post("/advance", (req, res) => {
    const player = req.game.getPlayer(req.cookies.token);
    const word = morse.decode(req.body.word).toLowerCase().replaceAll(/\s/g, "");
    if (req.game.words[player.index] === word) {
        player.index++;
        req.game.owner.send({ action: "STATE_CHANGE" });
        res.status(200).send();
        return;
    }
    res.status(401).send();
});

router.post('', (req, res) => {
    if (!req.game) {
        if (req.body.settings?.roomId) {
            let game = null;
            try {
                game = Games.get(req.body.settings.roomId);
            } catch (err) { }
            if (game && game.state === GameStates.ENDED) {
                Games.remove(game.token);
            } else if (game) {
                throw new HttpError("Game already exists", 401);
            }
        }
        const { owner: user, token } = Games.new(new Player("OWNER"), req.body.settings?.words, req.body.settings?.roomId || uuid().slice(-6));
        res.cookie("token", user.token);
        res.send({ token: token, userToken: user.token });
    } else {
        throw new HttpError("You are already in a game. First end or leave that one", 401);
    }
});

router.put("/state", isOwner, (req, res) => {
    req.game.state = GameStates[req.body.state];
    req.game.send({ action: "STATE_CHANGE" });
    res.send({ message: "Game state set to: " + req.game.state });
});

router.delete("", (req, res) => {
    if (!!req.game && req.owner) {
        req.game.send({ action: "GAME_ENDED" });
        Games.end(req.game.token);
        res.clearCookie("token");
        res.send({ message: `${req.game.token} deleted` });
    } else if (!!req.game && req.game.state) {
        req.game.removePlayer(req.cookies.token);
        req.game.send({ action: "PLAYER_LEFT" });
        res.send({ message: `left ${req.game.token}` });
    } else {
        throw new HttpError("Unauthorized", 401);
    }
});








module.exports = router;
