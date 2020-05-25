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
    const startNextRound = () => room.send ({action:"START_NEW_ROUND"});
    const billHasWon = () => room.send ({ action:"BILL_HAS_WON"});

    return <>
        
        <h2>Playing</h2>
        {room.state.playingPhase === PlayingPhase.ChooseAction && 
            <>
                <div className="player-list-font-size playing-phase-info">
                    {room.state.roundNumber === 1 &&
                        <p className="starting-location">The starting location is {room.state.startingLocation}</p>
                    }
                    
                    {currentPlayer.role !== Role.Bill &&
                        <p>Bill is chosing his action.</p>
                    }
                </div>

                {currentPlayer.role === Role.Bill &&
                <>
                    <div className="col-12 player-list-font-size">
                        <input className="buttons button-spacing full-width" placeholder="Enter your action here" value={action} onChange={handleActionChange}/>
                    </div>
                
                    <div className="col-12 player-list-font-size">
                        <button className="buttons button-spacing full-width" onClick={handleActionSubmit}>Submit</button>
                    </div>
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
                {currentPlayer.role !== Role.Bill &&
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
                    <p>The difficulty is: {room.state.actionDifficulty}</p>
                    <p>Roll the dice</p>
                    <button onClick={diceRoll}>Roll</button>
                   
                </> 
            }
        </>
        }

        {room.state.playingPhase === PlayingPhase.DisplayingSuccessfulDiceRoll &&
            <>
                <p>Dice roll result:</p>
                <p>{room.state.diceRollResult}</p>
                <p>Roll passed!</p>
                {currentPlayer.role === Role.Storyteller &&
                <>
                    <button onClick={startNextRound}>Click to the next round</button>
                </> 
                }
                {currentPlayer.role === Role.Storyteller &&
                    <>
                        <button onClick={billHasWon}>Bill has won</button>
                    </>
                }
            </>
        }

        {room.state.playingPhase === PlayingPhase.DisplayingFailedDiceRoll &&
            <>
                <p>Dice roll result:</p>
                <p>{room.state.diceRollResult}</p>
                <p>Roll failed!</p>
                {currentPlayer.role === Role.Storyteller &&
                <>
                    <button onClick={startNextRound}>Click to the next round</button>
                </> 
                }
            </>
        }
    </>
};

export default Playing;