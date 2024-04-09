import { useEffect, useState } from 'react';
import { GameStore } from "../gameState";

export const useMemoizedState = (func) => {
  const gameStoreState = GameStore.useState(func);
  const [state, setState] = useState(gameStoreState);

  useEffect(() => {
    if (gameStoreState !== state) {
      setState(gameStoreState);
    }
  }, [gameStoreState]);


  return state;
};

export default useMemoizedState;
