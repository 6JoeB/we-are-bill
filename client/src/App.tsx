import React, { useState, useEffect } from 'react';
import Lobby from './Lobby';
import Storyteller from './Storyteller';
import GoalPick from './GoalPick';
import Playing from './Playing';
import End from './End';
import Player from '../../server/models/PlayerModel';
import { Client, Room } from "colyseus.js";
import './App.css';
import State from "../../server/models/StateModel"
import { Phase, Role } from "./Enums";
import StartingLocationPick from './StartingLocationPick';

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
                setCurrentPlayer(state.players[room.sessionId]);
                console.log(`${room.sessionId} has a new state:`, state);
            });

            setRoom(room);
        }

        asyncRoom();
    }, []);

    const [room, setRoom] = useState<Room<State>>(new Room<State>(""));
    
    const [players, setPlayers] = useState<Player[]>([]);
    const [phase, setPhase] = useState<Phase>(Phase.Lobby);
    const [currentPlayer, setCurrentPlayer] = useState<Player>();

    console.log("joined successfully", room?.sessionId);
    let content;
    switch (phase)
    {
        case Phase.Lobby:
            content = <Lobby players={players} room={room}/>
            break;
        
        case Phase.StorytellerPick:
            content = <Storyteller players={players} room={room}/>
            break;

        case Phase.GoalPick:
            content = <GoalPick players={players} room={room} currentPlayer={currentPlayer!}/>
            break;

        case Phase.StartingLocationPick:
            content = <StartingLocationPick room={room}/>
            break;

        case Phase.Playing:
            content = <>
            <Playing players={players} room={room} currentPlayer={currentPlayer!}/>
            {currentPlayer!.role === Role.Storyteller &&
                    <>
                        <p>Players goals: </p>
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
            </>
            
            break;

        case Phase.End:
            content = <End players={players} room={room}/>
            break;
    }

    return <div className="App">
        <nav>
            <span>We Are Bill </span>
            <span>Username: {currentPlayer?.userName} </span>
            {room.state.currentPhase === Phase.Playing &&
                <>
                    <span>Current role: {currentPlayer?.role} </span>
                    <span>End of game goal: {currentPlayer?.goal} </span>
                    <span>Current round number: {room.state.roundNumber}</span>
                </>
            }
            

        </nav>
        {content}
    </div>
};

export default App;
