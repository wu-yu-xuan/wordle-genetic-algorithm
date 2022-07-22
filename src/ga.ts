/**
 * @fileoverview 和遗传算法有关的函数
 */
import produce from "immer";
import { WordleGuessType } from "./types";
import { getRandomAlpha } from "./utils";
import WordleGuesser from "./WordleGuesser";

/**
 * 杂交
 */
export function crossover(parents: WordleGuesser[]) {
  if (!parents.length) {
    throw new Error("parents is empty");
  }

  /**
   * 选出他们的优秀基因
   */
  return parents[0].value.map((_, index) => {
    const rightParent = parents.find(
      (x) => x.type[index] === WordleGuessType.RIGHT
    );
    if (rightParent) {
      return rightParent.value[index];
    }
    const wrongPositionParentArray = parents.filter(
      (x) => x.type[index] === WordleGuessType.WRONG_POSITION
    );
    if (wrongPositionParentArray.length) {
      return wrongPositionParentArray[
        Math.floor(Math.random() * wrongPositionParentArray.length)
      ].value[index];
    }
    return parents.map((x) => x.value[index])[
      Math.floor(Math.random() * parents.length)
    ];
  });
}

/**
 * 变异
 */
export function mutate(guesser: WordleGuesser) {
  if (guesser.killed) {
    /**
     * 一般不会走到这里。
     * 走到这里意味着没有一个数据是正确的，所以干脆全随机吧
     */
    guesser.setValue(guesser.value.map(() => getRandomAlpha()));
    return;
  }

  const shouldChangeIndexArray = guesser.type
    .map((type, index) => {
      if (type !== WordleGuessType.RIGHT) {
        return index;
      }
      return null;
    })
    .filter((x): x is number => x !== null);

  if (!shouldChangeIndexArray.length) {
    /**
     * 无须更改，就是答案
     */
    return;
  }

  /**
   * 先把所有错误的给随机了
   */
  const fixWrongArray = produce(guesser.value, (draft) => {
    for (const index of shouldChangeIndexArray) {
      if (guesser.type[index] === WordleGuessType.WRONG) {
        draft[index] = getRandomAlpha();
      }
    }
  });

  /**
   * 接下来把位置错误的随机换位置
   */

  const shouldChangeIndex =
    shouldChangeIndexArray[
      Math.floor(Math.random() * shouldChangeIndexArray.length)
    ];

  const nextIndexArray = shouldChangeIndexArray.filter(
    (x) => x !== shouldChangeIndex
  );

  if (!nextIndexArray.length) {
    /**
     * 原理上不会走到这里
     */
    const newValue = produce(fixWrongArray, (draft) => {
      draft[shouldChangeIndex] = getRandomAlpha();
    });
    guesser.setValue(newValue);
    return;
  }

  const nextIndex =
    nextIndexArray[Math.floor(Math.random() * nextIndexArray.length)];
  const newValue = produce(fixWrongArray, (draft) => {
    draft[shouldChangeIndex] = fixWrongArray[nextIndex];
    draft[nextIndex] = fixWrongArray[shouldChangeIndex];
  });
  guesser.setValue(newValue);
}
