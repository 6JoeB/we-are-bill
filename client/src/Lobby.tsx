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

    return <>
        <h2>Lobby</h2>
        <ul id="players">
        {players.map(player => 
            <> 
                <p 
                    style={{color: player.ready ? 'green' : 'red'}} 
                    key={player.userName} 
                    className="player-user-name"
                >
                    {player.userName}
                </p>
            </>
        )}
        </ul>
        <button onClick={readyUp}>Ready?</button>
        <input placeholder="Enter username" onChange={handleUsernameChange}/> 
    </>
};

export default Lobby;

//as React.CSSProperties;