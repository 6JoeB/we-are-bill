import React from 'react';
import Lobby from './Lobby';
import Player from '../models/PlayerModel';
import './App.css';

const App = () => {
    const players: Player[] = [new Player('Joe'), new Player('Joe'), new Player('Joe'), new Player('Joe')];

    return <div className="App">
        <Lobby players={players} />
    </div>
};

export default App;
