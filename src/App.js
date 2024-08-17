
import './App.css';
import Game from './Game';
import { useState, useEffect } from "react";
var shuffleSeed = require('shuffle-seed');

var gameModes = [
  {
    codeName: "daily",
    buttonName: "Play Daily 6 Sets",
    desc: "Complete 6 sets as fast as possible, refreshes every day!",
    btnColor: "bg-[#3b5dc9] text-white",
    btnPlayed: "text-[#3b5dc9] border-[#3b5dc9] border-2",
    categoryName: "Daily 6 Set"
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

function App() {
  const [dailyDeck, setDailyDeck] = useState([]);
  const [gameGoing, setGameGoing] = useState(false);
  const [selectedGamemode, setSelectedGamemode] = useState("daily");
  const [datesPlayed, setDatesPlayed] = useState(JSON.parse(localStorage.getItem("datesPlayed")) ?? {});
  const [leaderBoard, setLeaderboard] = useState(JSON.parse(localStorage.getItem("leaderBoard")) ?? {});
  const [showModal, setShowModal] = useState(false);
  const [lastTimeCompleted, setLastTimeCompleted] = useState(0);
  const [modalType, setModalType] = useState("play");

  console.log(datesPlayed)

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
      <div className={`text-white text-6xl my-4 transition-all tracking-widest ${gameGoing ? "" : "mt-[25vh]"}`}>Set<span className='text-[#73eff7] '>dle</span></div>
      {!gameGoing && (
        <div className='text-center'>
          <div className={`absolute w-full h-screen top-0 transition-all duration-300 bg-[rgba(0,0,0,.5)] ${showModal ? "opacity-100" : "opacity-0 invisible"}`}
            onClick={() => { setShowModal(false) }}>

            <div className={`absolute w-9/12 left-[12.5%] box-border p-4 top-[15vh] transition-all duration-300 text-center bg-[#f4f4f4] rounded-lg  ${showModal ? "opacity-100" : "opacity-0 invisible"} `}>

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

                    if (curLeaderboard) {
                      curLeaderboard.sort((a, b) => Number(a.time) - Number(b.time));
                    }

                    return (
                      <>
                        <div>{curGamemode.categoryName} Leaderboard:</div>
                        {curLeaderboard && (
                          <div>

                          </div>
                        )}
                        {!curLeaderboard && (
                          <div>
                            ~ No times in this category ~
                          </div>
                        )}
                      </>
                    )
                  })}
                  <div>
                    Nice job! You completed the {gameModes.find(curGamemode => curGamemode.codeName == selectedGamemode)?.categoryName} in {lastTimeCompleted} seconds!
                  </div>
                  <hr className='my-2' />
                </>
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

          <div className='btn text-white w-[240px] mx-auto mt-2 text-center bg-[#5d275d]'>My Scores</div>
          <div className='btn text-white w-[240px] mx-auto mt-2 text-center bg-[#5d275d]'>How to Play</div>
        </div>
      )}
      {gameGoing && dailyDeck.length > 80 && (
        <Game
          deck={dailyDeck}
          gameMode={selectedGamemode}
          gameOverCallback={gameOver}
        ></Game>
      )}
    </div>
  );
}

export default App;
