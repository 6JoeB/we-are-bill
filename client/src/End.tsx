import React from 'react';
import { Room } from "colyseus.js";
import Player from '../../server/models/PlayerModel';
import State from '../../server/models/StateModel';
import { Role } from './Enums';

const End = ({room, players}: {room: Room<State>, players: Player[]}) => {

    return <>
        <p>After {room.state.roundNumber} rounds {players.find(player => player.id === room.state.winningPlayer)!.userName} has won!</p>

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

export default End;