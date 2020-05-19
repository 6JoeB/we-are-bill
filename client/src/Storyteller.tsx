import React from 'react';
import Player from '../../server/models/PlayerModel';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';

const Storyteller  = ({players, room}: {players: Player[], room: Room<State>}) => {

    const optIn = () => room.send({ action: "PLAYER_OPT_IN"});
    const optOut = () => room.send({ action: "PLAYER_OPT_OUT"});


    return <div className="container-fluid">

    <h3>Opt in to become the Storyteller</h3>
        <div className="col-8 offset-2 player-list">
            <table className="full-width player-list-font-size" id="players">
                {players.map(player => 
                    <tr> 
                        <td>
                            {player.userName}
                        </td>

                        <td>
                            {player.storytellerOptedIn &&
                                <>
                                    👍
                                </>
                            }
                            {player.storytellerOptedIn === false &&
                                <>
                                    👎
                                </>
                            }
                            {player.storytellerOptedIn === undefined &&
                                <>
                                    🤔
                                </>
                            }

                        </td>
                    </tr>
                )}
            </table>
        </div>
        
        <div className="col-12 player-list-font-size">
            <button className="full-width buttons button-spacing" onClick={optIn}>Yes</button>
        </div>

        <div className="col-12 player-list-font-size">
            <button className="full-width buttons button-spacing" onClick={optOut}>No</button>
        </div>

    </div>
}

export default Storyteller;