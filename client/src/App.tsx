import React, { useState, useEffect } from 'react';
import Lobby from './Lobby';
import Storyteller from './Storyteller';
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
                if (state.storytellerId !== "") {
                setStoryteller(state.players[state.storytellerId]);
                }
                console.log(`${room.sessionId} has a new state:`, state);
            });

            setRoom(room);
        }

        asyncRoom();
    }, []);

    const [room, setRoom] = useState<Room<State>>(new Room<State>(""));
    
    const [players, setPlayers] = useState<Player[]>([]);
    const [phase, setPhase] = useState<string>("Lobby");
    const [storyteller, setStoryteller] = useState<Player>();

    console.log("joined successfully", room?.sessionId);
    let content;
    switch (phase)
    {
        case "Lobby" :
        content = <Lobby players={players} room={room}/>
        break;
        
        case "storytellerPick" :
        content = <Storyteller players={players} room={room}/>
        break;

        case "playing" :
        console.log(phase);
        console.log(storyteller);
        break;
    }

    return <div className="App">{content}</div>
};

export default App;
