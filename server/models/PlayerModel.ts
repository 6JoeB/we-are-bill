import { Role } from "../Enums";
import { Schema, type } from "@colyseus/schema";

class Player extends Schema {
    @type("string")
    id: string;
    @type("string")
    userName: string = "Jeremy";
    @type("number")
    role: Role = Role.Standard;
    @type("boolean")
    ready: boolean = false;
    @type("boolean")
    storytellerOptedIn: boolean | undefined;
    @type("string")
    goal: string | undefined;
    @type("int8")
    lastActionDifficultyVote: number | undefined;

    constructor(id: string) {
        super();
        this.id = id;
    }
}

export default Player;
