import React, { useState, useEffect } from 'react';
import Lobby from './Lobby';
import Player from '../models/PlayerModel';
import Colyseus from "colyseus.js";
import './App.css';
import State from "../../server/models/StateModel"

const App = () => {
    useEffect(() => {
        async function asyncRoom() {
            const client = new Colyseus.Client("ws://localhost:2657");
            const room = await client.joinOrCreate<State>("game");

            room.state.players.onAdd = (player: Player, i) => {
                console.log("player joined!", player);
            };

            room.state.players.onRemove = (player: Player, i) => {
                console.log("player left!", player);
            };

            room.onStateChange((state: State) => {
                setPlayers(Object.values(state.players));
                console.log(`${room.sessionId} has a new state:`, state);
            });

            setRoom(room);
        }

        asyncRoom();
    }, []);

    const [room, setRoom] = useState<Colyseus.Room>();
    const [players, setPlayers] = useState<Player[]>([]);

    console.log("joined successfully", room?.sessionId);

    return <div className="App">
        <Lobby players={players} />
    </div>
};

export default App;
