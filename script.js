const Player = (mark) => {
  mark: mark;
  let getPlayerMark = () => {
    return mark;
  };

  return { getPlayerMark };
};

const GameBoard = (() => {
  board = ["", "", "", "", "", "", "", "", ""];

  let addToBoard = (index, mark) => {
    if (board[index] == "") {
      board[index] = mark;
    }
  };

  let getField = (index) => {
    return board[index];
  };

  let resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  let getBoard = () => {
    return board;
  };

  return { addToBoard, resetBoard, getBoard, getField };
})();

const Game = (() => {
  let gameRunning = true;
  let playerX = Player("X");
  let playerO = Player("O");
  let round = 1;
  let winningCombination = [];

  let playRound = (index) => {
    GameBoard.addToBoard(index, getCurrentPlayerSign());
    if (checkWinner(index)) {
      displayController.colorWinningCOmbination(winningCombination);
      displayController.displayUpdate("win");
      gameRunning = false;
      return;
    }
    if (round === 9) {
      displayController.displayUpdate("tie");
      gameRunning = false;
      return;
    }
    round++;
    displayController.displayUpdate("turn");
  };

  let getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getPlayerMark() : playerO.getPlayerMark();
  };

  let checkWinner = (index) => {
    let winningCases = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCases
      .filter((winningCase) => winningCase.includes(index))
      .some((possibleCase) => {
        let win = possibleCase.every(
          (field) => GameBoard.getField(field) === getCurrentPlayerSign()
        );
        if (win) {
          winningCombination = possibleCase;

          return win;
        }
      });
  };

  let reset = () => {
    GameBoard.resetBoard();
    round = 1;
    gameRunning = true;
  };

  let isGameOver = () => {
    return !gameRunning;
  };

  return {
    playRound,
    isGameOver,
    getCurrentPlayerSign,
    reset,
  };
})();

const displayController = (() => {
  let fields = document.querySelectorAll(".field");
  let clearBtn = document.querySelector(".clear");
  let updateField = document.querySelector(".update");

  fields.forEach((field) => {
    field.addEventListener("click", (e) => {
      if (Game.isGameOver() || e.target.textContent !== "") return;
      e.target.textContent = Game.getCurrentPlayerSign();
      e.target.style.backgroundColor = `rgba(50, 53, 58, 1)`;
      e.target.style.transform = `scale(1)`;
      Game.playRound(parseInt(e.target.dataset.location));
    });
  });

  fields.forEach((field) => {
    if (field.textContent === "") {
      field.addEventListener("mouseover", (e) => {
        if (e.target.textContent === "" && !Game.isGameOver()) {
          e.target.style.backgroundColor = `rgba(89, 91, 95, 0.931)`;
          e.target.style.transform = `scale(1.05)`;
        }
      });
      field.addEventListener("mouseout", (e) => {
        if (e.target.textContent === "" && !Game.isGameOver()) {
          e.target.style.backgroundColor = `rgba(50, 53, 58, 1)`;
          e.target.style.transform = `scale(1)`;
        }
      });
    }
  });

  let emptyFields = () => {
    fields.forEach((field) => {
      field.textContent = "";
      field.style.backgroundColor = `rgba(50, 53, 58, 1)`;
      field.style.transform = `scale(1)`;
    });
  };

  clearBtn.addEventListener("click", () => {
    Game.reset();
    emptyFields();
  });

  let colorWinningCOmbination = (combination) => {
    fields.forEach((field) => {
      {
        if (combination.includes(parseInt(field.dataset.location))) {
          field.style.backgroundColor = `rgb(74, 212, 74)`;
          field.style.transform = `scale(1.05)`;
        }
      }
    });
  };

  let displayUpdate = (update) => {
    switch (update) {
      case "turn":
        updateField.textContent = `Player ${Game.getCurrentPlayerSign()}'s Turn`;
        break;
      case "win":
        updateField.textContent = `Player ${Game.getCurrentPlayerSign()} Won`;
        break;
      case "tie":
        updateField.textContent = `It's A Tie`;
        break;
    }
  };

  return {
    colorWinningCOmbination,
    displayUpdate,
  };
})();
