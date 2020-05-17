import React from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';

const Lobby = ({players, room}: {players: Player[], room: Room<State>}) => {
    const readyUp = () => room.send({ action: "PLAYER_READY"});
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        room.send({ action: "PLAYER_SET_USERNAME", data: {name: event.target.value}});
        console.log("trying to send message");
    }

    return <div className="container-fluid">
        <h2>Lobby</h2>
        <div className="col-8 offset-2 player-list">
            <table className="full-width" id="players">
                {players.map(player => 
                    <tr> 
                        <td 
                            style={{color: player.ready ? 'green' : 'red'}} 
                            key={player.userName} 
                            className="player-user-name"
                        >
                            {player.userName}
                        </td>
                    </tr>
                )}
            </table>
        </div>
        
        <div className="col-12">
            <input className="full-width buttons button-spacing" placeholder="Enter username" onChange={handleUsernameChange}/> 
        </div>
        
        <div className="col-12">
            <button className="full-width buttons button-spacing" onClick={readyUp}>Submit</button>
        </div>

        </div>
};

export default Lobby;

//as React.CSSProperties;