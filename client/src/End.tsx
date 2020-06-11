import React from 'react';
import { Room } from "colyseus.js";
import Player from '../models/PlayerModel';
import State from '../models/StateModel';
import { Role } from './Enums';

const End = ({room, players}: {room: Room<State>, players: Player[]}) => {
const resetGameVote = () => {room.send ({action: "RESET_GAME_VOTE"})};

    return <>
        <p className="player-list-font-size">After {room.state.roundNumber} rounds {players.find(player => player.id === room.state.winningPlayer)!.userName} has won!</p>
        <div className="col-10 offset-1 player-list margin-auto">
            <table className="full-width player-list-font-size goals-table">
                {players.filter(player => player.role !== Role.Storyteller).map(player =>
                    <tr>
                        <td>{player.userName} wanted to {player.goal}</td>
                    </tr>
                )}
            </table>
        </div>

        <div className="col-10 offset-1 player-list-font-size">
            <button className="buttons reset-button full-width" onClick={resetGameVote}>Reset Game</button>
        </div>
        
        
    </>
}

export default End;