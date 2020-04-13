import React from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';

const Storyteller  = ({players, room}: {players: Player[], room: Room<State>}) => {

    const optIn = () => room.send({ action: "PLAYER_OPT_IN"});
    const optOut = () => room.send({ action: "PLAYER_OPT_OUT"});


    return <>
    <h1>Opt in to become the Storyteller</h1>
    <ul id="players">
        {
            players.map(player => <> <p style={{color: player.storytellerOptedIn ? 'green' : 'black'}} key={player.userName} className="player-user-name">{player.userName}</p></>)
        }
        </ul>
        <button onClick={optIn}>yes</button>
        <button onClick={optOut}>no</button>
    </>
}

export default Storyteller;