import React from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';

const Lobby = ({players, room}: {players: Player[], room: Room<State>}) => {
    const readyUp = () => {room?.send({ action: "PLAYER_READY"});}
    return <>
        <h2>Lobby</h2>
        <ul id="players">
        {
            players.map(player => <> <p key={player.userName} className="player-user-name">{player.userName}</p> 
            <button onClick={readyUp} disabled={player.ready}>Ready?</button>  </>)
        }
        </ul>
    </>
};

export default Lobby;