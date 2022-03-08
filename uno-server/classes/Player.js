const { v4: uuid } = require('uuid');

class Player{
    #ws;

    constructor(username, ws, token = uuid()){
        this.username = username;
        this.token = token;
        this.#ws = ws;
        this.index = 0;
    }

    send(message){
        if(!this.isReady) {
            console.log(`Websocket for ${this.username} not ready or not set`);
        }else{
            this.#ws.send(JSON.stringify(message));
        }
    }

    setWebsocket(ws){
        this.#ws = ws;
    }

    get isReady(){
        return !!this.#ws && this.#ws.readyState === 1;
    }

    get info(){
        return { username: this.username, connected: this.isReady, id:this.id }
    }
}

module.exports = Player;