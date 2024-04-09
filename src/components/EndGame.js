import { GameStore } from "../gameState";
import { addModal } from "../modals";
import { useMemoizedState } from '../hooks/useMemoizedState';
import ConfettiExplosion from 'react-confetti-explosion';

const EndGame = () => {
    const gameState = useMemoizedState(s => s.gameState);

    if (gameState === "ENDED") {

        addModal({
            title: "Game Ended",
            body: <GameEndedModal />,
        });
        return <div style={{ overflow: 'hidden' }} className='vh-100 vw-100 d-flex justify-content-center align-items-center'>
            <ConfettiExplosion />
        </div>;
    }

    return null;
};

const GameEndedModal = () => {
    const { players, words, you } = GameStore.useState();

    const finalPlayer = [you, ...players].find(player => player?.index === words?.length);


    return <>
        {finalPlayer?.username} won!
    </>;
};

export default EndGame;
