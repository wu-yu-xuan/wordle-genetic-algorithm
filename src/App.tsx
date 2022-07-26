import { useState } from "react";
import { TIMEOUT } from "./const";
import styles from "./styles.module.less";
import WordleGame from "./WordleGame";
import WordleGuesserComp from "./WordleGuesserComp";

function App() {
  const [answer, setAnswer] = useState("");

  const [game, setGame] = useState<WordleGame>();

  const [buttonDisable, setButtonDisable] = useState(true);

  const [status, setStatus] = useState(`请输入一个英文单词后点击开始按钮`);

  const iterate = () => {
    if (!game || buttonDisable) {
      return;
    }
    game.kill();
    setStatus(`第一步：淘汰`);
    setButtonDisable(true);
    setTimeout(() => {
      game.choose();
      setStatus(`第二步：选种`);
      setTimeout(() => {
        game.crossover();
        setStatus(`第三步：杂交`);
        setTimeout(() => {
          game.mutate();
          const answer = game.guesserArray.find((x) => x.chosen)?.value;
          const status = answer
            ? `已找到答案：${answer.join("")}，请重新初始化`
            : `请继续点击迭代按钮，或者重新初始化`;
          setStatus(`第四步：变异。${status}`);
          setButtonDisable(false);
        }, TIMEOUT);
      }, TIMEOUT);
    }, TIMEOUT);
  };

  return (
    <>
      <div className={styles.titleContainer}>
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
            setStatus(`请点击迭代按钮`);
          }}
          disabled={!answer}
        >
          Start
        </button>
        <button disabled={buttonDisable} onClick={iterate}>
          Iterate
        </button>
        <span>generation: {game?.generation ?? 0}</span>
        <span>{status}</span>
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
