import React, {useState} from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';
import { Role } from './Enums';

const GoalPick  = ({players, room, currentPlayer}: {players: Player[], room: Room<State>, currentPlayer: Player}) => {
    const [goal, setGoal] = useState <string>();
    const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => setGoal(event.target.value);
    const handleGoalSubmit = () => room.send ({ action: "GOAL_SET", data: {goal} })
    
    return <>
    
    {currentPlayer.role === Role.Storyteller &&
        <>
            <h1>Players are currently entering their goals</h1>
            <table>
                {players.filter(player => player.role !== Role.Storyteller).map(player =>
                    <tr>
                        <td>{player.userName}</td>
                        <td>{player.goal}</td>
                    </tr>
                )}
            </table>
        </>
    }
    
    {currentPlayer.role !== Role.Storyteller &&
        <>
            <h1>Players enter your goal:</h1>
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
        </>
    }   

    {currentPlayer.role === Role.Standard && 
        <>
            <input placeholder="Enter goal" value={goal} onChange={handleGoalChange}/>
            <button onClick={handleGoalSubmit} disabled={!!currentPlayer.goal}>Submit</button>
        </>
    }
    </>
}

export default GoalPick;