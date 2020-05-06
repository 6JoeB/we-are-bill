export enum Role {
    Standard = "Waiting for turn",
    Storyteller = "Storyteller",
    Bill = "Bill"
}

export enum Phase {
    Lobby,
    StorytellerPick,
    GoalPick,
    StartingLocationPick,
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