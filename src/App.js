
import './App.css';
import Game from './Game';
import { useState, useEffect } from "react";
var shuffleSeed = require('shuffle-seed');

function App() {
  const [dailyDeck, setDailyDeck] = useState([]);



  useEffect(() => {
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

    setDailyDeck(shuffleSeed.shuffle(tempDeck, "blah"));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {dailyDeck.length > 80 && (
          <Game
            deck={dailyDeck}
          ></Game>
        )}
      </header>
    </div>
  );
}

export default App;
