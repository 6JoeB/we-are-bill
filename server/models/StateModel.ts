import { Schema, MapSchema, type } from "@colyseus/schema";
import Player from "./PlayerModel";
import { Phase } from "../Enums";

class State extends Schema {
    @type("string") 
    currentTurn: string | undefined;
    @type({ map: Player }) 
    players = new MapSchema();
    @type("number") 
    currentPhase: Phase = Phase.Lobby; // Lobby, storytellerPick, goalPick, playing
    @type("string")
    startingLocation: string | undefined;
}

export default State;