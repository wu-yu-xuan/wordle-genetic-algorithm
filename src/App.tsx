import { useState } from "react";
import { TIMEOUT } from "./const";
import styles from "./styles.module.less";
import WordleGame from "./WordleGame";
import WordleGuesserComp from "./WordleGuesserComp";

function App() {
  const [answer, setAnswer] = useState("");

  const [game, setGame] = useState<WordleGame>();

  const [buttonDisable, setButtonDisable] = useState(true);

  const [_, setNumber] = useState(0);

  const forceUpdate = () => setNumber((x) => x + 1);

  const iterate = () => {
    if (!game || buttonDisable) {
      return;
    }
    game.kill();
    setButtonDisable(true);
    setTimeout(() => {
      game.choose();
      forceUpdate();
      setTimeout(() => {
        game.crossover();
        forceUpdate();
        setTimeout(() => {
          game.mutate();
          setButtonDisable(false);
        }, TIMEOUT);
      }, TIMEOUT);
    }, TIMEOUT);
  };

  return (
    <>
      <div>
        <input
          className={styles.input}
          pattern="[A-Z]*"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button
          onClick={() => {
            setGame(new WordleGame({ answer: answer.toUpperCase() }));
            setButtonDisable(false);
          }}
        >
          Start
        </button>
        <button disabled={buttonDisable} onClick={iterate}>
          Iterate
        </button>
        <span>generation: {game?.generation ?? 0}</span>
      </div>
      <div className={styles.container}>
        {game?.guesserArray.map((guesser, index) => {
          return <WordleGuesserComp guesser={guesser} key={index} />;
        })}
      </div>
    </>
  );
}

export default App;
