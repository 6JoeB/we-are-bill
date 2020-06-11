import { Schema, MapSchema, type } from "@colyseus/schema";
import Player from "./PlayerModel";
import { Phase, PlayingPhase } from "../src/Enums";

class State extends Schema {
    @type({ map: Player }) 
    players = new MapSchema();
    @type("number") 
    currentPhase: Phase = Phase.Lobby; // Lobby, storytellerPick, goalPick, playing
    @type("string")
    startingLocation: string | undefined;
    @type("string")
    lastAction: string = "";
    @type("int8")
    diceRollResult: number = 0;
    @type("number")
    playingPhase: PlayingPhase = PlayingPhase.ChooseAction;
    @type("int8")
    actionDifficulty: number = 0;
    @type("string")
    winningPlayer: string = "";
    @type("number")
    roundNumber: number = 1;
    @type("boolean")
    resetGame: boolean = false;


    resetPlayingState() {
        this.lastAction = "";
        this.diceRollResult = 0;
        this.playingPhase = PlayingPhase.ChooseAction;
    }
}

export default State;