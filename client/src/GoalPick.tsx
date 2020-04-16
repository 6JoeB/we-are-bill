import React, {useState} from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';
import { Role } from './Enums';

const GoalPick  = ({players, room, currentPlayer}: {players: Player[], room: Room<State>, currentPlayer: Player}) => {
    const [goal, setGoal] = useState <string>();
    const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => setGoal(event.target.value);
    const handleGoalSubmit = () => room.send ({ action: "GOAL_SET", data: {goal} })
    console.log(currentPlayer);
    
    return <>
    <h1>Enter your goal:</h1>
    <ul id="players">
    {players.map(player => 
        <> 
            <p 
                style={{color: player.goal ? 'green' : 'black'}} 
                key={player.userName} 
                className="player-user-name"
            >
                {player.userName}
            </p>
        </>
    )}
    </ul>

    {currentPlayer.role === Role.Standard && 
    <>
        <input placeholder="Enter goal" value={goal} onChange={handleGoalChange}/>
        <button onClick={handleGoalSubmit} disabled={!!currentPlayer.goal} >submit</button>
    </>
    }
    </>
}

export default GoalPick;