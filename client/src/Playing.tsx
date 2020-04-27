import React, { useState } from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';
import { Role, PlayingPhase } from './Enums';

const Playing = ({players, room, currentPlayer}: {players: Player[], room: Room<State>, currentPlayer: Player}) => {
    const [action, setAction] = useState <string>();
    const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => setAction(event.target.value);
    const handleActionSubmit = () => room.send ({ action: "ACTION_SET", data: {action}});
    const difficultyVote = (difficulty: number) => room.send ({ action: "DIFFICULTY_SET", data: {difficulty}});
    const diceRoll = () => room.send ({ action:"DICE_ROLL"});

    return <>
        <h2>Playing</h2>
        {room.state.playingPhase === PlayingPhase.ChooseAction && 
            <>
                {currentPlayer.role === Role.Bill &&
                    <>
                        <input placeholder="Enter your action here" value={action} onChange={handleActionChange}></input>
                        <button onClick={handleActionSubmit}>Submit</button>
                    </> 
                }
                {(currentPlayer.role === Role.Standard || Role.Storyteller) &&
                    <>
                        <p>Bill is chosing his action.</p>
                    </>
                }
            </>
        }

        {room.state.playingPhase === PlayingPhase.VoteOnAction && 
            <>
                {currentPlayer.role === Role.Bill &&
                    <>
                        <p>Other players are now voting on the difficult of your action.</p>
                    </> 
                }
                {(currentPlayer.role === Role.Standard || Role.Storyteller) &&
                    <>
                        <p>Vote on the difficult of this action: </p>
                        <p>{room.state.lastAction}</p>
                        <button onClick={() => difficultyVote(2)}>2+</button>
                        <button onClick={() => difficultyVote(3)}>3+</button>
                        <button onClick={() => difficultyVote(4)}>4+</button>
                        <button onClick={() => difficultyVote(5)}>5+</button>
                        <button onClick={() => difficultyVote(6)}>6+</button>
                    </>
                }
            </>
        }

        {room.state.playingPhase === PlayingPhase.RollOnAction &&
        <>
            {currentPlayer.role === Role.Bill &&
                <>
                    <p>Roll the dice</p>
                    <button onClick={diceRoll}>Roll</button>
                   
                </> 
            }

            <p>Dice roll result:</p>
            {room.state.diceRollResult &&
                <p>{room.state.diceRollResult}</p>
            }
        </>
        } 
        </>
    };

export default Playing;