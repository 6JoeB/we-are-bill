import { Role } from "../Enums";

class Player {
    userName: string;
    role: Role;

    constructor(userName: string, role?: Role) {
        this.userName = userName;
        this.role = role || Role.Standard;
    }
}

export default Player;
