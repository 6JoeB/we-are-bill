export enum Role {
    Standard,
    Storyteller,
    Bill
}

export enum Phase {
    Lobby,
    StorytellerPick,
    GoalPick,
    Playing,
    End
}

export enum PlayingPhase {
    ChooseAction,
    VoteOnAction,
    RollOnAction,
    DisplayingSuccessfulDiceRoll,
    DisplayingFailedDiceRoll
}