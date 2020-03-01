import React, { useState, useEffect } from 'react';
import Lobby from './Lobby';
import Player from '../models/PlayerModel';
import Colyseus from "colyseus.js";
import './App.css';
import State from "../../server/models/StateModel"
let client = new Colyseus.Client("ws://localhost:2657");

let room: Colyseus.Room<State>;
const App = () => {
    useEffect(() => {
        async function asyncRoom() {
            room = await client.joinOrCreate<State>("game");
        }
        asyncRoom(); 
    })

    const [players, setPlayers] = useState <Player[]>([]);

    // const room = await client.joinOrCreate<State>("game");
    console.log("joined successfully", room.sessionId);

    room.state.players.onAdd = function (player: Player, i) {
        console.log("player joined!", player);
    }

    room.state.players.onRemove = function (player: Player, i) {
        console.log("player left!", player);
    }

    room.onStateChange((state: State) => {
        setPlayers(Object.values(state.players));
        console.log(`${room.sessionId} has a new state:`, state);
    })

    return <div className="App">
        <Lobby players={players} />
    </div>
};

export default App;
