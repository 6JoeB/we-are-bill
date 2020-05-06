import { Room, Client } from "colyseus";
import State from "./models/StateModel"
import Player from "./models/PlayerModel"
import { Role, Phase, PlayingPhase } from "./Enums";

export class MyRoom extends Room<State> {
    currentBillNumber = 0;
    playerOrder: string[] = [];

    onCreate(options: any) {
        this.setState(new State());
        this.state.listen("currentPhase", async (value: Phase, previousValue: Phase) => {
            if (value === Phase.Playing) {

                this.playerOrder = Object.values(this.state.players)
                .filter(player => player.role != Role.Storyteller)
                .map(player => player.id);

                console.log(this.playerOrder);
                console.log(this.currentBillNumber);
                console.log(Object.values(this.state.players)
                .filter(player => player.role != Role.Storyteller));
                this.state.players[this.playerOrder[this.currentBillNumber]].role = Role.Bill;
            }
        });
        console.log("state set");
    }

    onJoin(client: Client, options: any) {
        this.state.players[client.sessionId] = new Player(client.sessionId);
    }

    changeCurrentBillNumber() {
        this.state.players[this.playerOrder[this.currentBillNumber]].role = Role.Standard;

        if(this.currentBillNumber === (this.playerOrder.length - 1)) {
            this.currentBillNumber = 0;
        }
        else {
            this.currentBillNumber++;
        }

        this.state.players[this.playerOrder[this.currentBillNumber]].role = Role.Bill;
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
                    this.state.currentPhase = Phase.StartingLocationPick;

                }
                break;
            }

            case "STARTING_LOCATION_SET": {
                player.startingLocation = message.data.location;

                if (players.every(player => player.startingLocation !== ""))
                {
                    const locations: Array<string> = players.map(player => player.startingLocation);
                    this.state.startingLocation = locations[Math.floor(Math.random() * locations.length)];
                    console.log("current location is now " + this.state.startingLocation);

                    this.state.currentPhase = Phase.Playing;
                    this.state.playingPhase = PlayingPhase.ChooseAction; 
                }
                break;
            }

            case "ACTION_SET": {
                this.state.lastAction = message.data.action;
                this.state.playingPhase = PlayingPhase.VoteOnAction
                console.log("i am setting the action");
                break;
            }

            case "DIFFICULTY_SET": {
                player.lastActionDifficultyVote = message.data.difficulty;
                if (Object.values(this.state.players).every(player => player.lastActionDifficultyVote || player.role === Role.Bill)) {
                    const actionDifficultyTotal: number = players.filter(player => player.role !== Role.Bill)
                        .map(player => player.lastActionDifficultyVote)
                        .reduce((total, difficulty) => total! + difficulty!)!;

                    const actionDifficulty: number = Math.round((actionDifficultyTotal/(players.length - 1)));
                    this.state.actionDifficulty = actionDifficulty;

                    this.state.playingPhase = PlayingPhase.RollOnAction;
                }
                break;
            }

            case "DICE_ROLL": {
                this.state.diceRollResult = Math.floor(Math.random() * 6);
                console.log(this.state.diceRollResult);

                if (this.state.diceRollResult < this.state.actionDifficulty) {
                    this.state.playingPhase = PlayingPhase.DisplayingFailedDiceRoll;
                }
                else {
                    this.state.playingPhase = PlayingPhase.DisplayingSuccessfulDiceRoll;
                }
                break;
            }

            case "START_NEW_ROUND": {
                if (this.state.playingPhase === PlayingPhase.DisplayingFailedDiceRoll) {
                    this.changeCurrentBillNumber();
                }
                
                this.state.roundNumber ++;
                this.state.resetPlayingState();
                for (let j = 0; j < players.length; j++) {
                    this.state.players[players[j].id].lastActionDifficultyVote = undefined;
                } //set all players last action difficulty vote back to undefined so the wait loop still works
                this.state.playingPhase = PlayingPhase.ChooseAction;
                break;
            }
            
            case "BILL_HAS_WON": {
                this.state.winningPlayer = this.playerOrder[this.currentBillNumber];
                this.state.currentPhase = Phase.End;
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
