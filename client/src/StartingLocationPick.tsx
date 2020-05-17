import React, {useState} from 'react';
import { Room } from "colyseus.js";
import Player from '../../server/models/PlayerModel';
import State from '../../server/models/StateModel';

const StartingLocationPick = ({players, room}: {players: Player[], room: Room<State>}) => {
    const [location, setLocation] = useState <string>();
    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => setLocation(event.target.value);
    const handleLocationSubmit = () => room.send ({ action: "STARTING_LOCATION_SET", data: {location} });

    return <>
        <h3>Enter your starting location choice: </h3>

        <div className="col-12 player-list">
            <table className="full-width" id="players">
                {players.map(player => 
                    <tr> 
                        <td 
                            style={{color: player.startingLocation ? 'green' : 'red'}} 
                            key={player.userName} 
                            className="player-user-name"
                        >
                            {player.userName} wants to start at {player.startingLocation ?? ".."}
                        </td>
                    </tr>
                )}
            </table>
        </div>

        <div className="col-12">
            <input className="full-width buttons button-spacing" value={location} onChange={handleLocationChange}/>
        </div>

        <div className="col-12">
            <button className="full-width buttons button-spacing" onClick={handleLocationSubmit}>Submit</button>
        </div>
    </>
}

export default StartingLocationPick;