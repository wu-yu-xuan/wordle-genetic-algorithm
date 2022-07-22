import { RIGHT_SCORE } from "./const";
import { WordleGuesserOptions, WordleGuessType } from "./types";
import { getRandomAlpha } from "./utils";

export default class WordleGuesser {
  answer: string;

  value: string[] = [];

  type: WordleGuessType[] = [];

  score: number = 0;

  killed: boolean = false;

  chosen: boolean = false;

  constructor({ answer }: WordleGuesserOptions) {
    this.answer = answer;

    this.value = new Array(answer.length).fill("").map(() => getRandomAlpha());

    this.updateScore();
  }

  updateScore() {
    let score: number = 0;
    const type: WordleGuessType[] = [];
    const answerArray = this.answer.split("");
    const touchedArray: boolean[] = [];

    /**
     * 答对的
     */
    this.value.forEach((char, index) => {
      if (char === answerArray[index]) {
        type[index] = WordleGuessType.RIGHT;
        touchedArray[index] = true;
        score += RIGHT_SCORE;
      }
    });

    /**
     * 位置错误
     */
    this.value.forEach((char, index) => {
      if (type[index]) {
        /**
         * 上面遍历过了
         */
        return;
      }

      const answerIndex = answerArray.findIndex((answer, index) => {
        if (touchedArray[index]) {
          return false;
        }
        return answer === char;
      });

      if (answerIndex !== -1) {
        touchedArray[answerIndex] = true;
        type[index] = WordleGuessType.WRONG_POSITION;
        score += 1;
      }
    });

    /**
     * 彻底错误
     */
    this.value.forEach((_, index) => {
      if (!type[index]) {
        type[index] = WordleGuessType.WRONG;
      }
    });

    this.score = score;
    this.type = type;
  }

  kill() {
    this.killed = true;
  }

  choose() {
    if (!this.killed) {
      this.chosen = true;
    }
  }

  setValue(value: string[]) {
    this.value = value;
    this.killed = false;
    this.chosen = false;
    this.updateScore();
  }
}
