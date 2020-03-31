import { Room, Client } from "colyseus";
import State from "./models/StateModel"
import Player from "./models/PlayerModel"

export class MyRoom extends Room {

    onCreate(options: any) {
        this.setState(new State());
    }

    onJoin(client: Client, options: any) {
        this.state.players[client.sessionId] = new Player();
    }

    onMessage (client: Client, message: any) {
        console.log(message);

        switch (message.action) {
            case "PLAYER_SET_NAME":
                const player: Player = this.state.players[client.sessionId];
                player.userName = message.data.name;
        }
    }

    onLeave(client: Client, consented: boolean) {
        delete this.state.players[client.sessionId];
    }

    onDispose() {
    }
}
