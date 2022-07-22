export interface WordleGameOptions {
  wordleGuesserLength?: number;
  answer: string;
}

export interface WordleGuesserOptions {
  answer: string;
}

export enum WordleGuessType {
  RIGHT = 1,
  WRONG_POSITION,
  WRONG,
}
