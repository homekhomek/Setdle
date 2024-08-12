import { useEffect, useMemo, useState } from "react";
import FlipMove from 'react-flip-move';
import Card from './Card';

const Game = ({ deck }) => {
    const gameDeck = deck;
    const [gameBoard, setGameBoard] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);

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
        return;
    }, [selectedCards, gameBoard,])

    useEffect(() => {
        if (gameBoard.length < 12) {
            for (var i = 0; i < 12 - gameBoard.length; i++)
                gameBoard.push(gameDeck.pop());


            setGameBoard([...gameBoard]);
        }
        else if ((!sol || sol.length == 0) && gameBoard.length <= 12) {
            for (var i = 0; i < 3; i++)
                gameBoard.push(gameDeck.pop());
            setGameBoard([...gameBoard]);
        }

    }, [gameBoard, sol])



    return (
        <div className="w-[270px]">
            <FlipMove
                duration={500}
                easing="ease-out"
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
        </div>
    );
};

export default Game;