import React, {useState} from 'react';
import { Room } from "colyseus.js";
import Player from '../../server/models/PlayerModel';
import State from '../../server/models/StateModel';

const StartingLocationPick = ({players, room}: {players: Player[], room: Room<State>}) => {
    const [location, setLocation] = useState <string>();
    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => setLocation(event.target.value);
    const handleLocationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        room.send ({ action: "STARTING_LOCATION_SET", data: {location} });
    }

    return <>
        <h3>Enter your starting location choice: </h3>

        <div className="col-12 player-list">
            <table className="full-width player-list-font-size" id="players">
                {players.map(player => 
                    <tr> 
                        <td>
                            {player.userName}  
                            {!player.startingLocation ? " ✍️" : ` wants to start at ${player.startingLocation}`}
                        </td>
                    </tr>
                )}
            </table>
        </div>

        <form onSubmit={handleLocationSubmit}>
            <div className="col-12 player-list-font-size">
                <input className="full-width buttons button-spacing" value={location} onChange={handleLocationChange} required/>
            </div>

            <div className="col-12 player-list-font-size">
                <button type="submit" className="full-width buttons button-spacing">Submit</button>
            </div>
        </form>                
    </>
}

export default StartingLocationPick;