const express = require("express");
const gameRouter = require('./routes/game');
const Games = require('./classes/Games');

const cookieParser = require('cookie-parser');
const { v4: uuid } = require('uuid');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const { GameStates } = require('./enums');
const { getGame } = require("./middleware");


const app = express();


app.use(cors({
	origin: 'http://192.168.178.108:3000',
	credentials: true,
}));
app.use(json());
app.use(urlencoded({
	extended: true
}));
app.use(cookieParser(uuid()));

app.use(`/api/game`, getGame);
app.use(`/api/game`, gameRouter);


app.get("/rooms", (req, res) => {
	res.send({
		games: Games._games.filter(game => game.state === GameStates.JOINING).map(game => ({
			token: game.token,
			players: game.players.map(player => player.username),
			rules: game.settings
		}))
	});
});

const ws = require('express-ws')(app);

app.ws('/ws', (ws, req) => {
	try {
		const game = Games.getByPlayer(req.cookies.token);
		const player = game.getPlayer(req.cookies.token);
		player.setWebsocket(ws);
		game.send({ action: "PLAYER_CONNECTED" }, req.cookies.token);
		ws.on('close', () => {
			game.send({ action: "PLAYER_DISCONNECTED" }, req.cookies.token);
		});
	} catch (err) {
		ws.close(4000, "NOT_LOGGED_IN");
	}
});

app.ws('/ws/owner', (ws, req) => {
	try {
		const game = Games.getGameByOwnerToken(req.cookies.token);
		game.owner.setWebsocket(ws);
		game.send({ action: "PLAYER_CONNECTED" }, req.cookies.token);
		ws.on('close', () => {
			game.send({ action: "PLAYER_DISCONNECTED" }, req.cookies.token);
		});
	} catch (err) {
		ws.close(4000, "NOT_LOGGED_IN");
	}
});


app.use((err, req, res, next) => {
	console.log(err);
	res.status(err.code ? err.code : 500).send(err.code ? err.toJson() : { message: err.message });
});

const path = require('path');
app.use("/static", express.static(path.join(__dirname, '../build/static')));
app.use(express.static(path.join(__dirname, '../build')));
app.use("/*", express.static(path.join(__dirname, '../build')));


const server = app.listen(process.env.PORT || 8080, () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log(`Server started on: ${host}:${port}`);
});
