import React from 'react';
import PlayerModel from './models/PlayerModel';

const Lobby = ({players}: {players: PlayerModel[]}) => {
    return <>
        <h2>Lobby</h2>
        <ul id="players">
        {
            players.map(player => <p key={player.userName} className="player-user-name">{player.userName}</p>)
        }
        </ul>
    </>
};

export default Lobby;
