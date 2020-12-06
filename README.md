![GitHub repo size](https://img.shields.io/github/repo-size/6JoeB/we-are-bill?style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/6JoeB/we-are-bill?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues-raw/6JoeB/we-are-bill?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/6JoeB/we-are-bill?style=for-the-badge)
![Maintenance](https://img.shields.io/maintenance/yes/2019?style=for-the-badge)

# We Are Bill 
Is a multiplayer web game based on story telling.

## Techstack
- Node.js
- React.js
- [Colyseus](https://colyseus.io/)
- Typescript
- HTML
- CSS/Bootstrap

## Game Rules

One player becomes the storyteller/dungeon master and must narrate the game (as the other players attempt actions), all other players will become Bill when it is their turn.

Initially a starting location is chosen/voted for. 

Every player except the storyteller sends an objective to the storyteller, this is their game goal, it can be anything from buying an avocado to stealing a car. The storyteller may reject an objective and request a new one if it is deemed too easy.

All players except for the storyteller roll a dice and whoever scores highest will start as Bill.

Now the game begins, Bill wakes up in the chosen location and must choose an action to try and bring them closer to their goal. The storyteller and other players then vote on how hard that task is deemed (based on a D6 roll, 2+ easiest, 6+ hardest).

If the player successfully rolls the dice, their task is completed and they can continue attempting tasks.

If the player fails the roll, Bill blacks out and the next player becomes Bill and can attempt to achieve their goal through action attempts.

This process repeats until a player has achieved their goal and therefore wins the game.

## How to run the application

- Change directory to the backend folder and run `npm start`.
- Then change directory to the frontend folder and run `npm start`.
- Now redirect to [http://localhost:3000/](http://localhost:3000/). Multiple players are required to play the game, for testing this can be simulated by loading multiple tabs.
