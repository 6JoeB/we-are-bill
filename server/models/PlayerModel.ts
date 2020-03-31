import { Role } from "../Enums";
import { Schema, type } from "@colyseus/schema";

class Player extends Schema {
    @type("string")
    userName: string = "Jeremy";
    @type("number")
    role: Role = Role.Standard;
}

export default Player;
