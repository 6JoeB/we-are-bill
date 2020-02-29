import { Schema, MapSchema, type } from "@colyseus/schema";
import Player from "./PlayerModel";

class State extends Schema {
    @type("string") currentTurn: string | undefined;
    @type({ map: Player }) players = new MapSchema();
}

export default State;