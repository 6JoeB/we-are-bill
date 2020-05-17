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
            <h3>Players are currently entering their goals</h3>

            <div className="col-12 player-list">
                <table id="players" className="full-width" >
                    {players.filter(player => player.role !== Role.Storyteller).map(player =>
                        <tr>
                            <td>{player.userName} wants to {player.goal ?? ".."}</td>
                        </tr>
                    )}
                </table>
            </div>
        </>
    }
    
    {currentPlayer.role !== Role.Storyteller &&
        <>
            <h3>Players enter your goal:</h3>

            <div className="col-8 offset-2 player-list">
                <table className="full-width" id="players">
                    {players.filter(player => player.role !== Role.Storyteller).map(player => 
                        <tr> 
                            <td 
                                style={{color: player.goal ? 'green' : 'red'}} 
                                key={player.userName} 
                                className="player-user-name"
                            >
                                {player.userName}
                            </td>
                        </tr>
                    )}
                </table>
            </div>
            
        </>
    }   

    {currentPlayer.role === Role.Standard && 
        <>
            <div className="col-12">
                <input className="full-width buttons button-spacing" placeholder="Enter goal" value={goal} onChange={handleGoalChange}/>
            </div>

            <div className="col-12">
                <button className="full-width buttons button-spacing" onClick={handleGoalSubmit} disabled={!!currentPlayer.goal}>Submit</button>
            </div>
        </>
    }
    </>
}

export default GoalPick;