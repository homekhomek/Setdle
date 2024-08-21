import { useEffect, useMemo, useState } from "react";
import FlipMove from 'react-flip-move';
import Card from './Card';

/*
    Gamemodes
    - daily - first to six
    - fullDeck - lol
    - randFullDeck

*/

const Game = ({ deck, gameMode, gameOverCallback }) => {
    const gameDeck = deck;
    const [gameBoard, setGameBoard] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [secondsUntilCanAddRow, setSecondsUntilCanAddRow] = useState(15);
    const [setsComplete, setSetsComplete] = useState(0);

    useEffect(() => {
        const milleIntervalID = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
            if (secondsUntilCanAddRow >= 0) {
                setSecondsUntilCanAddRow(secondsUntilCanAddRow - .05);
            }
        }, 50);

        return () => { clearInterval(milleIntervalID); }
    });

    const canAddRow = useMemo(() => {
        return secondsUntilCanAddRow <= 0 && gameDeck.length > 3
    }, [secondsUntilCanAddRow, gameDeck])

    const sol = useMemo(() => {
        var posSolution = [];
        var pairCheckedDict = {};
        var onBoard = {};

        gameBoard.forEach(cardPass => {
            onBoard[cardPass.uid] = true;
        });

        gameBoard.forEach(card1 => {
            if (posSolution.length > 0)
                return;
            gameBoard.forEach(card2 => {
                if (posSolution.length > 0)
                    return;

                if (card1.uid == card2.uid) // Don't check card with itself
                    return;

                if (pairCheckedDict[card1.uid < card2.uid ? `${card1.uid}${card2.uid}` : `${card2.uid}${card1.uid}`]) // Don't check a pair we've already checked
                    return;

                var thirdSearch = "";

                for (var i = 0; i < 4; i++) {
                    var a1 = card1.uid.charAt(i);
                    var a2 = card2.uid.charAt(i);

                    if (a1 == a2)
                        thirdSearch = thirdSearch + a1;
                    else
                        thirdSearch = thirdSearch + ["1", "2", "0"].find((val) => val != a1 && val != a2);
                }

                if (onBoard[thirdSearch]) {
                    posSolution = [card1.uid, card2.uid, thirdSearch];
                    return;
                }

                pairCheckedDict[card1.uid < card2.uid ? `${card1.uid}${card2.uid}` : `${card2.uid}${card1.uid}`] = true;
            })
        })

        console.log(posSolution);
        return posSolution;
    }, [gameBoard])



    const clickCard = (uid) => {
        if (selectedCards.includes(uid)) {
            selectedCards.splice(selectedCards.indexOf(uid), 1);
        }
        else {
            selectedCards.push(uid)
        }

        setSelectedCards([...selectedCards]);
    }


    useEffect(() => {
        if (selectedCards.length < 3)
            return;

        for (var i = 0; i < 4; i++) {
            var firstCardAttribute = selectedCards[0].charAt(i);
            var secondCardAttribute = selectedCards[1].charAt(i);
            var thirdCardAttribute = selectedCards[2].charAt(i);

            if ((firstCardAttribute != secondCardAttribute && secondCardAttribute != thirdCardAttribute && firstCardAttribute != thirdCardAttribute)
                || (firstCardAttribute == secondCardAttribute && secondCardAttribute == thirdCardAttribute)) {
                continue;
            }
            else {
                setSelectedCards([]);
                return;
            }
        }

        setSelectedCards([]);
        var newGameBoard = gameBoard.filter((curCard) => {
            return !selectedCards.includes(curCard.uid)
        });

        setGameBoard(newGameBoard);
        setSetsComplete(setsComplete + 1);

        return;
    }, [selectedCards, gameBoard,])



    useEffect(() => {

        if (
            ((gameMode == "fullDeck" || gameMode == "randFullDeck") && gameDeck.length <= 0 && (!sol || sol.length == 0)) ||
            (gameMode == "daily" && setsComplete >= 6)) {
            gameOverCallback(gameMode, (elapsedTime / 1000).toFixed(2));
            return;
        }

        if (gameBoard.length < 12) {
            for (var i = 0; i < 12 - gameBoard.length; i++) {
                if (gameDeck.length >= 1)
                    gameBoard.push(gameDeck.pop());
            }


            setGameBoard([...gameBoard]);
        }
        else if ((!sol || sol.length == 0) && gameBoard.length <= 12) {
            for (var i = 0; i < 3; i++) {
                if (gameDeck.length >= 1)
                    gameBoard.push(gameDeck.pop());
            }

            setGameBoard([...gameBoard]);
        }

    }, [gameBoard, sol, setsComplete, gameMode])



    return (
        <div className="w-[270px] mx-auto">
            <div className="w-full flex justify-between p-3">
                <div className="text-left">
                    {gameMode == "daily" ? `${setsComplete}/6 Sets` : "Full Deck"}
                </div>
                <div className="text-right">
                    {(elapsedTime / 1000).toFixed(2)}s
                </div>
            </div>
            <FlipMove
                duration={500}
                easing="linear(
    0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765,
    1, 0.891 40.9%, 0.848, 0.813, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785,
    0.813, 0.848, 0.891 68.2%, 1 72.7%, 0.973, 0.953, 0.941, 0.938, 0.941, 0.953,
    0.973, 1, 0.988, 0.984, 0.988, 1
  )"
                enterAnimation={{
                    from: {
                        transform: 'translateY(120px)',
                        opacity: 0,
                    },
                    to: {
                        transform: '',
                    },
                }}
                leaveAnimation={{
                    from: {
                        transform: '',
                    },
                    to: {
                        transform: 'scale(.1)',
                        opacity: 0.1,
                    },
                }}
            >
                {gameBoard.map(card => (
                    <Card
                        key={card.uid}
                        cardData={card}
                        clickHandler={clickCard}
                        selected={selectedCards.includes(card.uid)}
                    ></Card>
                ))}
            </FlipMove>
            <div className="w-[260px] inline-block rounded-lg ml-[10px] mb-[10px] align-middle box-border text-center p-3 bg-[#f4f4f4]">
                {gameDeck.length} / 81 CARDS
                <div onClick={() => {
                    if (!canAddRow)
                        return;

                    for (var i = 0; i < 3; i++) {
                        if (gameDeck.length >= 1)
                            gameBoard.push(gameDeck.pop());
                    }

                    setSecondsUntilCanAddRow(15);
                    setGameBoard([...gameBoard]);

                }} className={`btn w-3/4 mx-auto mt-3 ${canAddRow ? "bg-[#38b764] text-white" : "text-[#38b764] border-[#38b764] border-2"}`}>ADD ROW {secondsUntilCanAddRow > 0 && gameDeck.length >= 3 ? `(${Math.ceil(secondsUntilCanAddRow)})` : ""}</div>
                {/*<div onClick={() => {
                    setSelectedCards([]);
                    gameBoard.splice(0, 3);

                    setGameBoard([...gameBoard]);
                    setSetsComplete(setsComplete + 1);

                }} className="btn bg-green-300 w-3/4 mx-auto mt-3">Remove ROW</div>*/}
            </div>
        </div>
    );
};

export default Game;