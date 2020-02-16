import React from 'react';
import Lobby from './Lobby';
import PlayerModel from './models/PlayerModel';
import './App.css';

const App = () => {
    const players: PlayerModel[] = [new PlayerModel('Joe'), new PlayerModel('Joe'), new PlayerModel('Joe'), new PlayerModel('Joe')];

    return <div className="App">
        <Lobby players={players} />
    </div>
};

export default App;
