import React, { useState } from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';
import { Role, PlayingPhase } from './Enums';

class Dice {
    static number = 0;

    static nextNumber(setter: (integar: number) => any){
        Dice.number++;
        if (Dice.number > 6){
            Dice.number = 1;
        }
        console.log(Dice.number);
        setter(Dice.number);
    }
}

const Playing = ({players, room, currentPlayer}: {players: Player[], room: Room<State>, currentPlayer: Player}) => {
    const [action, setAction] = useState <string>();
    const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => setAction(event.target.value);
    const handleActionSubmit = () => room.send ({ action: "ACTION_SET", data: {action}});
    const difficultyVote = (difficulty: number) => room.send ({ action: "DIFFICULTY_SET", data: {difficulty}});
    const diceRoll = () => {
        const animation = setInterval(Dice.nextNumber, 200, setDiceNumber);
        setTimeout(() => {clearInterval(animation); room.send ({ action:"DICE_ROLL"});}, 3000);        
    };
    const [diceNumber, setDiceNumber] = useState <number>(5);
    const startNextRound = () => room.send ({action:"START_NEW_ROUND"});
    const billHasWon = () => room.send ({ action:"BILL_HAS_WON"});

    return <>
        
        <h2>Playing</h2>
        {room.state.playingPhase === PlayingPhase.ChooseAction && 
            <div className="player-list-font-size">
                <div className="playing-text-spacing">
                    {room.state.roundNumber === 1 &&
                        <p className="margin-top-16">The starting location is {room.state.startingLocation}</p>
                    }
                    
                    {currentPlayer.role !== Role.Bill &&
                        <p>Bill is chosing his action.</p>
                    }
                </div>

                {currentPlayer.role === Role.Bill &&
                <>
                    <div className="col-12">
                        <input className="buttons button-spacing full-width" placeholder="Enter your action here" value={action} onChange={handleActionChange}/>
                    </div>
                
                    <div className="col-12">
                        <button className="buttons button-spacing full-width" onClick={handleActionSubmit}>Submit</button>
                    </div>
                </>
                }
            </div>
        }

        {room.state.playingPhase === PlayingPhase.VoteOnAction && 
            <div className="player-list-font-size">
                {currentPlayer.role === Role.Bill &&
                    <>
                        <p className="playing-text-spacing">Other players are now voting on the difficulty of your action.</p>
                    </> 
                }
                {currentPlayer.role !== Role.Bill &&
                    <>
                        <p className="playing-text-spacing margin-bottom-0">Vote on the difficulty of "{room.state.lastAction}" </p>
                        <button className={`single-number-button playing-text-spacing ${currentPlayer.lastActionDifficultyVote === 2 ? "selected-button" : ""}`} onClick={() => difficultyVote(2)}>2+</button>
                        <button className={`single-number-button ${currentPlayer.lastActionDifficultyVote === 3 ? "selected-button" : ""}`} onClick={() => difficultyVote(3)}>3+</button>
                        <button className={`single-number-button ${currentPlayer.lastActionDifficultyVote === 4 ? "selected-button" : ""}`} onClick={() => difficultyVote(4)}>4+</button>
                        <button className={`single-number-button ${currentPlayer.lastActionDifficultyVote === 5 ? "selected-button" : ""}`} onClick={() => difficultyVote(5)}>5+</button>
                        <button className={`single-number-button ${currentPlayer.lastActionDifficultyVote === 6 ? "selected-button" : ""}`} onClick={() => difficultyVote(6)}>6+</button>
                    </>
                }
            </div>
        }

        {room.state.playingPhase === PlayingPhase.RollOnAction &&
        <div className="player-list-font-size">
            {currentPlayer.role === Role.Bill &&
                <>  
                    <p className="padding-top-15">The difficulty is {room.state.actionDifficulty}</p>
                    <img src={`/dice${diceNumber}.png`} className="roll-button" onClick={diceRoll}/>
                   
                </> 
            }

            {currentPlayer.role !== Role.Bill &&
                <>  
                    <p className="padding-top-15">Bill is currently rolling the dice</p>
                    <p>The difficulty is {room.state.actionDifficulty}</p>
                </> 
            }
        </div>
        }

        {room.state.playingPhase === PlayingPhase.DisplayingSuccessfulDiceRoll &&
            <div className="player-list-font-size">
                <p className="margin-top-16">Dice roll passed!</p>
                <p>Result was {room.state.diceRollResult}</p>
                {currentPlayer.role === Role.Storyteller &&
                    <div className="col-12 player-list-font-size">
                        <button className="full-width buttons button-spacing" onClick={startNextRound}>Click to the next round</button>
                        <button className="full-width buttons button-spacing" onClick={billHasWon}>Bill has won</button>
                    </div>
                }
            </div>
        }

        {room.state.playingPhase === PlayingPhase.DisplayingFailedDiceRoll &&
            <div className="player-list-font-size">
                <p className="margin-top-16">Dice roll failed!</p>
                <p>Result was {room.state.diceRollResult}</p>
                {currentPlayer.role === Role.Storyteller &&
                <>
                    <button onClick={startNextRound}>Click to the next round</button>
                </> 
                }
            </div>
        }
    </>
};

export default Playing;