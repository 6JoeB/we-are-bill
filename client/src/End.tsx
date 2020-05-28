import React from 'react';
import { Room } from "colyseus.js";
import Player from '../../server/models/PlayerModel';
import State from '../../server/models/StateModel';
import { Role } from './Enums';

const End = ({room, players}: {room: Room<State>, players: Player[]}) => {

    return <>
        <p className="player-list-font-size">After {room.state.roundNumber} rounds {players.find(player => player.id === room.state.winningPlayer)!.userName} has won!</p>

        <table className="full-width player-list-font-size goals-table">
            {players.filter(player => player.role !== Role.Storyteller).map(player =>
                <tr>
                    <td>{player.userName} wanted to {player.goal}</td>
                </tr>
            )}
        </table>
    </>
}

export default End;