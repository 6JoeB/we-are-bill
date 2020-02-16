import Enums from "../Enums";

class Player {
    userName: string;
    role: Enums.Role;

    constructor(userName: string, role?: Enums.Role) {
        this.userName = userName;
        this.role = role || Enums.Role.Standard;
    }
}

export default Player;
