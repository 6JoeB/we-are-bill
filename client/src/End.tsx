import React from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';

const End = ({room}: {room: Room<State>}) => {

    return <>
        <p>Player {room.state.winningPlayer} has won!</p>
    </>

}

export default End;