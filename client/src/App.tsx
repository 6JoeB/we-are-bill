import React, { useState, useEffect } from 'react';
import Lobby from './Lobby';
import Player from '../../server/models/PlayerModel';
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
                setPhase(state.currentPhase);
                console.log(`${room.sessionId} has a new state:`, state);
            });

            setRoom(room);
        }

        asyncRoom();
    }, []);

    const [room, setRoom] = useState<Room<State>>(new Room<State>(""));
    const [players, setPlayers] = useState<Player[]>([]);
    const [phase, setPhase] = useState<string>("Lobby");

    console.log("joined successfully", room?.sessionId);
    let content;
    switch (phase)
    {
        case "Lobby" :
        content = <Lobby players={players} room={room}/>
        break;
        
        case "storytellerPick" :
        /* <StorytellerPick players={players} room={room}/> */
        content = <h1>wagwan storyteller picking time</h1>
        break;
    }

    return <div className="App">{content}</div>
};

export default App;
