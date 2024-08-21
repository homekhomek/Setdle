
import './App.css';
import Game from './Game';
import Card from './Card';
import { useState, useEffect } from "react";
var shuffleSeed = require('shuffle-seed');

var gameModes = [
  {
    codeName: "daily",
    buttonName: "Play Daily 6 Sets",
    desc: "Complete 6 sets as fast as possible, refreshes every day!",
    btnColor: "bg-[#2656ed] text-white",
    btnPlayed: "text-[#3b5dc9] border-[#3b5dc9] border-2",
    categoryName: "Daily 6 Sets"
  },
  {
    codeName: "fullDeck",
    buttonName: "Play Daily Full Deck",
    desc: "Complete the deck as fast as possible, refreshes every day!",
    btnColor: "bg-[#b13e53] text-white",
    btnPlayed: "text-[#b13e53] border-[#b13e53] border-2",
    categoryName: "Daily Full Deck"
  },
  {
    codeName: "randFullDeck",
    buttonName: "Play Random Full Deck",
    desc: "Complete a random deck as fast as possible. New deck every time you play!",
    btnColor: "bg-[#38b764] text-white",
    categoryName: "Random Full Deck"
  },
]
const listOfAttributes = [
  { codeName: "shape", desc: "shapes" },
  { codeName: "numberOfSymbols", desc: "number of symbols" },
  { codeName: "color", desc: "colors" },
  { codeName: "fillPattern", desc: "patterns" },
]

function App() {
  const [dailyDeck, setDailyDeck] = useState([]);
  const [gameGoing, setGameGoing] = useState(false);
  const [selectedGamemode, setSelectedGamemode] = useState("daily");
  const [datesPlayed, setDatesPlayed] = useState(JSON.parse(localStorage.getItem("datesPlayed")) ?? {});
  const [leaderBoard, setLeaderboard] = useState(JSON.parse(localStorage.getItem("leaderBoard")) ?? {});
  const [showModal, setShowModal] = useState(false);
  const [lastTimeCompleted, setLastTimeCompleted] = useState(0);
  const [modalType, setModalType] = useState("play");
  const [cardExamples, setCardExamples] = useState([]);
  const [isExampleASet, setIsExampleASet] = useState(false);
  const [exampleSentence, setExampleSentence] = useState("");

  useEffect(() => {
    if (!cardExamples || cardExamples.length == 0) {
      var newExamples = [
        { color: 0, numberOfSymbols: 0, shape: 0, fillPattern: 0 },
        { color: 0, numberOfSymbols: 0, shape: 0, fillPattern: 0 },
        { color: 0, numberOfSymbols: 0, shape: 0, fillPattern: 0 }
      ];

      if (isExampleASet) {
        var newExampleSentence = "The above three cards <span class='underline'>are not</span> set because: "
        for (var i = 0; i < 4; i++) {
          if (Math.random() < .5) { // Unique
            var offset = Math.floor(Math.random() * 3);
            newExamples[0][listOfAttributes[i].codeName] = (offset + 1) % 3;
            newExamples[1][listOfAttributes[i].codeName] = (offset + 2) % 3;
            newExamples[2][listOfAttributes[i].codeName] = (offset + 3) % 3;
          }
          else {
            var offset = Math.floor(Math.random() * 3);
            newExamples[0][listOfAttributes[i].codeName] = offset;
            newExamples[1][listOfAttributes[i].codeName] = offset;
            newExamples[2][listOfAttributes[i].codeName] = offset;
          }
        }

        for (var i = 0; i < 1 + Math.floor(Math.random() * 3); i++) {
          var curProp = Math.floor(Math.random() * 4);
          var val = Math.floor(Math.random() * 3);
          var badBoy = Math.floor(Math.random() * 3);

          if ((newExamples[0][listOfAttributes[curProp].codeName] == newExamples[1][listOfAttributes[curProp].codeName] &&
            newExamples[1][listOfAttributes[curProp].codeName] != newExamples[2][listOfAttributes[curProp].codeName]) ||

            (newExamples[0][listOfAttributes[curProp].codeName] == newExamples[2][listOfAttributes[curProp].codeName] &&
              newExamples[1][listOfAttributes[curProp].codeName] != newExamples[2][listOfAttributes[curProp].codeName]) ||

            (newExamples[2][listOfAttributes[curProp].codeName] == newExamples[1][listOfAttributes[curProp].codeName] &&
              newExamples[0][listOfAttributes[curProp].codeName] != newExamples[2][listOfAttributes[curProp].codeName])) {
            continue;
          }

          newExamples[badBoy][listOfAttributes[curProp].codeName] = val;
          newExamples[(badBoy + 1) % 3][listOfAttributes[curProp].codeName] = val;
          newExamples[(badBoy + 2) % 3][listOfAttributes[curProp].codeName] = (val + ((Math.floor(Math.random() * 2) * 2) + 2)) % 3;

          if (i != 3) newExampleSentence += `two of the cards have the same ${listOfAttributes[curProp].desc} and `
        }

        newExampleSentence = newExampleSentence.slice(0, -4);

        setExampleSentence(newExampleSentence);
      }
      else {
        var newExampleSentence = "The above three cards <span class='underline'>are</span> a set because: "
        for (var i = 0; i < 4; i++) {
          if (Math.random() < .5) { // Unique
            var offset = Math.floor(Math.random() * 3);
            newExamples[0][listOfAttributes[i].codeName] = (offset + 1) % 3;
            newExamples[1][listOfAttributes[i].codeName] = (offset + 2) % 3;
            newExamples[2][listOfAttributes[i].codeName] = (offset + 3) % 3;
            newExampleSentence += `the ${listOfAttributes[i].desc} are all unique`;
          }
          else {
            var offset = Math.floor(Math.random() * 3);
            newExamples[0][listOfAttributes[i].codeName] = offset;
            newExamples[1][listOfAttributes[i].codeName] = offset;
            newExamples[2][listOfAttributes[i].codeName] = offset;
            newExampleSentence += `the ${listOfAttributes[i].desc} are all the same`;
          }
          if (i == 2) newExampleSentence += ", and "
          if (i != 3 && i != 2) newExampleSentence += ", "
        }
        setExampleSentence(newExampleSentence);
      }

      console.log(newExamples);

      setIsExampleASet(!isExampleASet);
      setCardExamples(newExamples);
    }
  }, [cardExamples]);

  const gameOver = (gameMode, timelapsed) => {
    setGameGoing(false);
    setDailyDeck([]);

    const today = new Date().toISOString().split('T')[0];

    if (gameMode != "randFullDeck") {

      if (!datesPlayed[today + gameMode]) {
        datesPlayed[today + gameMode] = true;
        localStorage.setItem("datesPlayed", JSON.stringify(datesPlayed));
        setDatesPlayed(datesPlayed);

        if (!leaderBoard[gameMode])
          leaderBoard[gameMode] = [];

        leaderBoard[gameMode].push({ d: today, s: timelapsed });
        localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
        setLeaderboard(leaderBoard);
      }

    }
    else {
      if (!leaderBoard[gameMode])
        leaderBoard[gameMode] = [];

      leaderBoard[gameMode].push({ d: today, s: timelapsed });
      localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
      setLeaderboard(leaderBoard);
    }

    setLastTimeCompleted(timelapsed);
    setModalType("gameOver");
    setShowModal(true);
  }

  const play = () => {
    setShowModal(false);
    setGameGoing(true);
  }

  const showStartModal = (gameMode) => {
    if (gameMode == "fullDeck" || gameMode == "daily") {

      const today = new Date().toISOString().split('T')[0];
      generateDeck(today + gameMode);
    }
    else if (gameMode == "randFullDeck") {
      generateDeck(Date.now());
    }

    setSelectedGamemode(gameMode);
    setModalType("play");
    setShowModal(true);
  }

  const showLeaderboard = () => {
    setModalType("leaderBoard");
    setShowModal(true);
  }

  const showHow2Play = () => {
    setModalType("how2play");
    setShowModal(true);
  }

  const generateDeck = (seed) => {
    var tempDeck = [];
    for (var shapeAttribute = 0; shapeAttribute < 3; shapeAttribute++) {
      for (var numberOfSymbolsAttribute = 0; numberOfSymbolsAttribute < 3; numberOfSymbolsAttribute++) {
        for (var colorAttribute = 0; colorAttribute < 3; colorAttribute++) {
          for (var fillPatternAttribute = 0; fillPatternAttribute < 3; fillPatternAttribute++) {
            tempDeck.push({
              shape: shapeAttribute,
              numberOfSymbols: numberOfSymbolsAttribute,
              color: colorAttribute,
              fillPattern: fillPatternAttribute,
              uid: `${shapeAttribute}${numberOfSymbolsAttribute}${colorAttribute}${fillPatternAttribute}`
            })
          }
        }
      }
    }

    setDailyDeck(shuffleSeed.shuffle(tempDeck, seed));
  }

  return (
    <div className='font-ammy text-center text-xl'>
      <div className={`text-[#2656ed] text-6xl my-4 transition-all tracking-widest ${gameGoing ? "" : "mt-[25vh]"}`}>Set<span className='text-[#566c86]'>dle</span></div>
      {!gameGoing && (
        <div className='text-center'>
          <div className={`absolute w-full bg-[#f4f4f4] text-[#1a1c2c] h-screen top-0 transition-all duration-300 bg-[rgba(0,0,0,.5)] ${showModal ? "opacity-100" : "opacity-0 invisible"}`}
            onClick={() => { setShowModal(false) }}>

            <div className={`absolute w-11/12 left-[4.166%] box-border p-4 ${modalType == "how2play" ? "top-[5vh]" : "top-[15vh]"} transition-all duration-300 text-center bg-[#f4f4f4] rounded-lg  ${showModal ? "opacity-100" : "opacity-0 invisible"} `}
              onClick={(e) => { e.stopPropagation(); }}>

              <hr className='my-2' />
              {modalType == "play" && (
                <>
                  <div>
                    {gameModes.find(curGamemode => curGamemode.codeName == selectedGamemode)?.desc}
                  </div>
                  <hr className='my-2' />
                  <div className='mx-auto btn text-white w-[240px] mt-2 text-center bg-[#38b764]'
                    onClick={() => { play() }}>
                    Play!
                  </div>
                </>
              )}
              {modalType == "gameOver" && (
                <>
                  <h2 className='text-3xl mb-2 text-[#38b764]'>{lastTimeCompleted} Seconds</h2>
                  <div>
                    Nice job! You completed the {gameModes.find(curGamemode => curGamemode.codeName == selectedGamemode)?.categoryName} in {lastTimeCompleted} seconds!
                  </div>
                  <hr className='my-2' />
                </>
              )}
              {modalType == "leaderBoard" && (
                <>
                  {gameModes.map(curGamemode => {
                    var curLeaderboard = leaderBoard[curGamemode.codeName];
                    const today = new Date().toISOString().split('T')[0];
                    var todayScore = null;

                    if (curLeaderboard) {
                      curLeaderboard.sort((a, b) => Number(a.s) - Number(b.s));
                      todayScore = curLeaderboard.find((entry) => entry.d == today);
                    }

                    return (
                      <>
                        <div className='underline' >{curGamemode.categoryName} Leaderboard:</div>
                        {curLeaderboard && (
                          <div>
                            {['🥇', '🥈', '🥉'].map((place, index) => {
                              if (curLeaderboard[index]) {
                                return (
                                  <div key={index}>
                                    {place} | {curLeaderboard[index].d} | {curLeaderboard[index].s}s
                                  </div>
                                );
                              }
                              else {
                                return (
                                  <div key={index}>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        )}
                        {!curLeaderboard && (
                          <div>
                            ~ No times in this category ~
                          </div>
                        )}
                        {todayScore && (
                          <div className='text-lg my-2 text-[#566c86]'>Today's time: {todayScore.s}s</div>
                        )}
                        <hr className='my-4' />
                      </>
                    )
                  })}
                </>
              )}
              {modalType == "how2play" && (
                <div className='text-lg'>
                  <div className='text-2xl'>
                    HOW TO PLAY
                  </div>
                  <div className='my-3'>
                    The goal of the game Set (and by extension SETDLE) is to find sets of three cards.
                  </div>
                  <div className='my-3'>
                    Each card has four attributes:
                    <ul className="text-left">
                      <li>- Number of Symbols (1, 2, or 3)</li>
                      <li>- Color (Red, green, or blue)</li>
                      <li>- Shape (Diamond, pill, or squiggle)</li>
                      <li>- pattern/texture (Solid, empty, or striped)</li>
                    </ul>
                  </div>
                  <div className='my-3'>
                    three cards are <span className='underline'>NOT</span> a set if only two cards match in any of the attributes. All attributes must be unique across all three cards or the same across all three cards.
                  </div>

                  <div className='text-2xl my-5'>
                    Examples <span className='btn bg-[#38b764] text-white !text-base' onClick={() => setCardExamples([])}>Generate New</span>
                  </div>
                  {cardExamples && cardExamples.length >= 1 && (
                    <>
                      {cardExamples.map((cardData) => (
                        <Card
                          cardData={cardData}
                          clickHandler={(id) => { }}
                          selected={false}
                        ></Card>
                      ))}


                      <div className='my-3 text-sm' dangerouslySetInnerHTML={{ __html: exampleSentence }}>
                      </div>
                    </>
                  )}
                  <hr className='my-4' />
                </div>
              )}
              <div className='mx-auto btn  w-[240px] mt-2 text-center border-2 text-[#333c57] border-[#333c57]'
                onClick={() => { setShowModal(false) }}>
                Back
              </div>
            </div>
          </div>
          {gameModes.map(curGamemode => {
            return <div className={`btn  w-[240px] mx-auto mt-2 text-center  ${datesPlayed[new Date().toISOString().split('T')[0] + curGamemode.codeName] ? curGamemode.btnPlayed : curGamemode.btnColor}`} onClick={() => { showStartModal(curGamemode.codeName) }} >{curGamemode.buttonName}</div>
          })}

          <div onClick={() => { showLeaderboard() }} className='btn text-white w-[240px] mx-auto mt-2 text-center bg-[#5d275d]'>My Scores</div>
          <div onClick={() => { showHow2Play() }} className='btn text-white w-[240px] mx-auto mt-2 text-center bg-[#566c86]'>How to Play</div>
          <div className='text-sm mt-8'>
            <div>based on the board game <a className='underline text-[#3b5dc9]' href="https://www.setgame.com/set/puzzle">set</a> </div>
            <div>made by <a className='underline text-[#3b5dc9]' href="http://homek.org/">homek</a></div>
          </div>
        </div>
      )
      }
      {
        gameGoing && dailyDeck.length > 80 && (
          <Game
            deck={dailyDeck}
            gameMode={selectedGamemode}
            gameOverCallback={gameOver}
          ></Game>
        )
      }
    </div >
  );
}

export default App;
