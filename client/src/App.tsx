import React, { useState, useEffect } from 'react';
import Lobby from './Lobby';
import Player from '../models/PlayerModel';
import { Client, Room } from "colyseus.js";
import './App.css';
import State from "../../server/models/StateModel"

const App = () => {
    useEffect(() => {
        async function asyncRoom() {
            const client = new Client("ws://localhost:2567");
            const room = await client.joinOrCreate<State>("my_room");

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

    const [room, setRoom] = useState<Room>();
    const [players, setPlayers] = useState<Player[]>([]);

    console.log("joined successfully", room?.sessionId);

    const setName = () => room?.send({ action: "PLAYER_SET_NAME", data: { name: "lol" } });

    return <div className="App">
        <Lobby players={players} />
        <button onClick={() => setName()}>Set name to lol</button>
    </div>
};

export default App;
