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
                if (state.resetGame) {
                    window.location.reload();
                }
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
            content = <StartingLocationPick players={players} room={room}/>
            break;

        case Phase.Playing:
            content = <>
            <Playing players={players} room={room} currentPlayer={currentPlayer!}/>
            {currentPlayer!.role === Role.Storyteller &&
                    <>
                        <div className="col-10 offset-1 player-list bottom-anchored-and-centered">
                            <table className="full-width player-list-font-size goals-table">
                                <p className="goals-list-title">Goals: </p>
                                {players.filter(player => player.role !== Role.Storyteller).map(player => 
                                    <tr>
                                        <td>{player.userName} wants to {player.goal}</td>
                                    </tr>
                                )}
                            </table>
                        </div>
                        
                    </>
                }
            </>
            
            break;

        case Phase.End:
            content = <End players={players} room={room}/>
            break;
    }

    return <div className="App font-colour">
        <nav className="navbar nav-background-colour">
            <span className="nav-title">We Are Bill </span>
            <span className="username">{currentPlayer?.userName} </span>
        </nav>


        <div className="body body-background">
            {room.state.currentPhase === Phase.Playing &&
                <>
                    <span className="role-tracker">Role: {currentPlayer?.role} </span>
                    <span className="round-tracker">Round {room.state.roundNumber}</span>

                    {currentPlayer?.role !== Role.Storyteller &&
                        <footer className="footer-background">
                            {room.state.currentPhase === Phase.Playing  &&
                                <>
                                    <span className="footer-text">Endgame goal is {currentPlayer?.goal} </span>
                                </>
                            }
                        </footer>
                    }
                </>
            }
            {content}
        </div>
    </div>
};

export default App;
