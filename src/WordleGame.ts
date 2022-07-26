import { RIGHT_SCORE } from "./const";
import { crossover, mutate } from "./ga";
import { WordleGameOptions } from "./types";
import WordleGuesser from "./WordleGuesser";

export default class WordleGame {
  wordleGuesserLength: number;

  answer: string;

  guesserArray: WordleGuesser[] = [];

  generation = 0;

  constructor({ wordleGuesserLength = 50, answer }: WordleGameOptions) {
    this.wordleGuesserLength = wordleGuesserLength;
    this.answer = answer;
    this.guesserArray = new Array(this.wordleGuesserLength).fill(0).map(() => {
      return new WordleGuesser({ answer });
    });
  }

  /**
   * 第一步，淘汰
   */
  kill() {
    const scoreArray = Array.from(
      new Set(this.guesserArray.map((x) => x.score))
    ).sort((a, b) => a - b);

    if (scoreArray.length === 1) {
      return;
    }

    /**
     * 淘汰一半
     */
    const killScoreArray = scoreArray.slice(
      0,
      Math.floor(0.5 * scoreArray.length)
    );

    this.guesserArray.forEach((x) => {
      if (killScoreArray.includes(x.score)) {
        x.kill();
      }
    });
  }

  /**
   * 第二步，选种
   */
  choose() {
    const maxScore = Math.max(...this.guesserArray.map((x) => x.score));
    const maxArray = this.guesserArray.filter((x) => x.score === maxScore);
    maxArray.forEach((x) => x.choose());
    if (maxArray.length < 2) {
      const secondMaxScore = Math.max(
        ...this.guesserArray
          .filter((x) => x.score !== maxScore)
          .map((x) => x.score)
      );
      const maxArray = this.guesserArray.filter(
        (x) => x.score === secondMaxScore
      );
      maxArray.forEach((x) => x.choose());
    }
  }

  /**
   * 第三步，杂交
   */
  crossover() {
    const parents = this.guesserArray.filter((x) => x.chosen);
    if (!parents.length) {
      return;
    }
    for (let index = 0; index < this.guesserArray.length; index++) {
      if (this.guesserArray[index].killed) {
        this.guesserArray[index].setValue(crossover(parents));
      }
    }
  }

  /**
   * 第四步，变异
   */
  mutate() {
    this.guesserArray.forEach((x) => {
      mutate(x);
    });

    this.generation++;
  }
}
