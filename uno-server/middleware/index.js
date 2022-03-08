const Games = require("../classes/Games");
const { HttpError } = require("../errors")

module.exports.getGame = (req, res, next) => {
    if(req.cookies.token){
        let game = Games.getByPlayer(req.cookies.token);
        if(!game) game = Games.getGameByOwnerToken(req.cookies.token);
        if(!game) {
            res.clearCookie("token");
            throw new HttpError(`Game with player:${req.cookies.token} does not exist`, 404);
        }
        req.game = game;
        req.owner = game.owner.token === req.cookies.token;
    }
    next();
}

module.exports.isOwner = (req, res, next) => {
    if (!!req.game && req.owner) {
        next();
    }else{
        throw new HttpError("Unauthorized", 401)
    }
}