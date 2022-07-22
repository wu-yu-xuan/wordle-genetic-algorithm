import WordleGuesser from "./WordleGuesser";
import styles from "./styles.module.less";
import classNames from "classnames";
import { WordleGuessType } from "./types";

const stylesMap = {
  [WordleGuessType.RIGHT]: styles.right,
  [WordleGuessType.WRONG]: styles.wrong,
  [WordleGuessType.WRONG_POSITION]: styles.wrongPosition,
};

interface WordleGuesserCompProps {
  guesser: WordleGuesser;
}

export default function WordleGuesserComp({ guesser }: WordleGuesserCompProps) {
  return (
    <div
      className={classNames(
        styles.flexContainer,
        guesser.killed && styles.kill,
        guesser.chosen && styles.chosen
      )}
    >
      {guesser.value.map((letter, index) => {
        return (
          <span key={index} className={stylesMap[guesser.type[index]]}>
            {letter}
          </span>
        );
      })}
    </div>
  );
}
