import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import Lobby from './Lobby';
import PlayerModel from './models/PlayerModel';

describe('Lobby', () => {
    describe('When rendered with players', () => {
        const players = [new PlayerModel('Joseph')];
        let lobby: RenderResult;

        beforeEach(() => {
            lobby = render(<Lobby players={players} />);
        });

        it('Then displays the players names', () => {
            expect(lobby.queryByText('Joseph')).not.toBeNull();
        });
    });
});
