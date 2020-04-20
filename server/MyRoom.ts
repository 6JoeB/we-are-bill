import { Room, Client } from "colyseus";
import State from "./models/StateModel"
import Player from "./models/PlayerModel"
import { Role, Phase } from "./Enums";

export class MyRoom extends Room<State> {

    onCreate(options: any) {
        this.setState(new State());
        console.log("state set");
    }

    onJoin(client: Client, options: any) {
        this.state.players[client.sessionId] = new Player(client.sessionId);
    }

    onMessage (client: Client, message: any) {
        console.log(message);
        const player: Player = this.state.players[client.sessionId];
        const players: Array<Player> = Object.values(this.state.players);

        switch (message.action) {
            case "PLAYER_SET_USERNAME": {
                player.userName = message.data.name;
                console.log("player set name recieved")
                break;
            }
            case "PLAYER_READY": {
                player.ready = true;
                console.log(this.state.players[client.sessionId] + player.ready);

                if (players.every(player => player.ready))
                {
                    this.state.currentPhase = Phase.StorytellerPick;
                    console.log(this.state.currentPhase);
                }
                break;
            }
            case "PLAYER_OPT_IN": {
                player.storytellerOptedIn = true;

                if (players.every(player => player.storytellerOptedIn !== undefined)) 
                {
                    const optedInPlayers: Array<string> = players.filter(player => player.storytellerOptedIn).map(player => player.id);
                    const storytellerId = optedInPlayers[Math.floor(Math.random() * optedInPlayers.length)];
                    this.state.players[storytellerId].role = Role.Storyteller;
                    this.state.currentPhase = Phase.GoalPick;
                }
                break;
            }

            case "PLAYER_OPT_OUT": {
                player.storytellerOptedIn = false;

                if (players.every(player => player.storytellerOptedIn !== undefined)) 
                {
                    const optedInPlayers: Array<string> = players.filter(player => player.storytellerOptedIn).map(player => player.id);
                    const storytellerId = optedInPlayers[Math.floor(Math.random() * optedInPlayers.length)];
                    this.state.players[storytellerId].role = Role.Storyteller;
                    this.state.currentPhase = Phase.GoalPick;
                }
                break;
            }

            case "GOAL_SET": {
                player.goal = message.data.goal;

                if (players.every(player => player.goal || player.role === Role.Storyteller))
                {
                    this.state.currentPhase = Phase.Playing;

                    const locations: Array<string> = ["Mcdonalds", "The mean streets of Peterborough", "Makers Treehouse", "The Moon"];
                    this.state.startingLocation = locations[Math.floor(Math.random() * locations.length)];
                    console.log("current location is now " + this.state.startingLocation);

                    while(players.every(player => !player.hasWon))
                    {
                        for(let i = 0; i < players.length; i++){
                            players[i].role = Role.Bill;

                            
                            players[i].role = Role.Standard;
                        }
                    }
                }
                break;
            }

            

            default : {
                console.log("ye nah ye nah broken");
            }
        }
    }

    onLeave(client: Client, consented: boolean) {
        delete this.state.players[client.sessionId];
    }

    onDispose() {
    }
}
