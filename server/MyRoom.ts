import { Room, Client } from "colyseus";
import State from "./models/StateModel"
import Player from "./models/PlayerModel"

export class MyRoom extends Room<State> {

    onCreate(options: any) {
        this.setState(new State());
    }

    onJoin(client: Client, options: any) {
        this.state.players[client.sessionId] = new Player(client.sessionId);
    }

    onMessage (client: Client, message: any) {
        console.log(message);
        const player: Player = this.state.players[client.sessionId];
        const players: Array<Player> = Object.values(this.state.players);

        switch (message.action) {
            case "PLAYER_SET_NAME": {
                player.userName = message.data.name;
                break;
            }
            case "PLAYER_READY": {
                player.ready = true;
                console.log(this.state.players[client.sessionId] + player.ready);

                if (players.every(player => player.ready))
                {
                    this.state.currentPhase = "storytellerPick";
                    console.log(this.state.currentPhase);
                }
                break;
            }
            case "PLAYER_OPT_IN": {
                player.storytellerOptedIn = true;

                if (players.every(player => player.storytellerOptedIn !== undefined)) 
                {
                    const optedInPlayers: Array<string> = players.filter(player => player.storytellerOptedIn).map(player => player.id);
                    this.state.storytellerId = optedInPlayers[Math.floor(Math.random() * optedInPlayers.length)];
                    this.state.currentPhase = "playing";
                }
                break;
            }

            case "PLAYER_OPT_OUT": {
                player.storytellerOptedIn = false;

                if (players.every(player => player.storytellerOptedIn !== undefined)) 
                {
                    const optedInPlayers: Array<string> = players.filter(player => player.storytellerOptedIn).map(player => player.id);
                    this.state.storytellerId = optedInPlayers[Math.floor(Math.random() * optedInPlayers.length)];
                    this.state.currentPhase = "playing";
                }
                break;
            }
        }
    }

    onLeave(client: Client, consented: boolean) {
        delete this.state.players[client.sessionId];
    }

    onDispose() {
    }
}
