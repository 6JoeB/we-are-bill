import React, {useState} from 'react';
import { Room } from "colyseus.js";
import State from '../../server/models/StateModel';

const StartingLocationPick = ({room}: {room: Room<State>}) => {
    const [location, setLocation] = useState <string>();
    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => setLocation(event.target.value);
    const handleLocationSubmit = () => room.send ({ action: "STARTING_LOCATION_SET", data: {location} });

    return <>
        <h2>Enter your starting location choice: </h2>
        <input value={location} onChange={handleLocationChange}/>
        <button onClick={handleLocationSubmit}>Submit</button>
    </>
}

export default StartingLocationPick;