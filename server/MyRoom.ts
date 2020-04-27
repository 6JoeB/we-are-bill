import { Room, Client } from "colyseus";
import State from "./models/StateModel"
import Player from "./models/PlayerModel"
import { Role, Phase, PlayingPhase } from "./Enums";

export class MyRoom extends Room<State> {

    onCreate(options: any) {
        this.setState(new State());
        this.state.listen("currentPhase", async (value: Phase, previousValue: Phase) => {
            if (value === Phase.Playing) {
                const locations: Array<string> = ["Mcdonalds", "The mean streets of Peterborough", "Makers Treehouse", "The Moon"];
                this.state.startingLocation = locations[Math.floor(Math.random() * locations.length)];
                console.log("current location is now " + this.state.startingLocation);
                const players: ()=>Array<Player> = () => Object.values(this.state.players);

                const playingLoop = async() => {
                    while(!players().some(player => player.hasWon))
                    {
                        let i = 0;
                        while(i < players().length) {
                            const player = this.state.players[players()[i].id] //gets player whose turn it is to be Bill
                            player.role = Role.Bill; //sets player role to bill

                            while (this.state.lastAction === "") {

                            } //waits for Bill to enter action
                            this.state.playingPhase = PlayingPhase.VoteOnAction;

                            while (!players().every(player => player.lastActionDifficultyVote || player.role === Role.Bill)) {

                            } //waits for all players to vote on difficulty of action
                            this.state.playingPhase = PlayingPhase.RollOnAction;

                            while (this.state.diceRollResult === 0){

                            }
                            
                            const actionDifficultyTotal: number = players().filter(player => player.role !== Role.Bill)
                                                                    .map(player => player.lastActionDifficultyVote)
                                                                    .reduce((total, difficulty) => total! + difficulty!)!;
                            const actionDifficulty: number = Math.round((actionDifficultyTotal/(players.length - 1)));

                            if (this.state.diceRollResult < actionDifficulty) {
                                i++;
                            }
                            else {
                                while(this.state.billAchievedGoal === undefined) {

                                }
                                player.hasWon = this.state.billAchievedGoal;
                                if (player.hasWon) {
                                    break;
                                }
                            }
                            
                            this.state.resetPlayingState();
                            player.role = Role.Standard;
                            
                            for (let j = 0; j < players().length; j++) {
                                this.state.players[players()[j].id].lastActionDifficultyVote = undefined;
                            } //set all players last action difficulty vote back to undefined so the wait loop still works
                            
                        }
                    }
                    playingLoop();
                }
        
            }
        });
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
                }
                break;
            }

            case "DIFFICULTY_SET": {
                player.lastActionDifficultyVote = message.data.difficulty;
            }

            case "DICE_ROLL": {
                this.state.diceRollResult = Math.floor(Math.random() * 6);
                console.log(this.state.diceRollResult);
                break;
            }

            default : {
                console.log("ye nah ye nah broken");
            }
        }

        this.state.triggerAll();
    }

    onLeave(client: Client, consented: boolean) {
        delete this.state.players[client.sessionId];
    }

    onDispose() {
    }
}
