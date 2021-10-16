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

  let getEmptyIndexes = () => {
    let emptyIndexs = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        emptyIndexs.push(i);
      }
    }
    return emptyIndexs;
  };

  return { addToBoard, resetBoard, getBoard, getField, getEmptyIndexes };
})();

const Game = (() => {
  let gameRunning = true;
  let aiMode = false;
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
    if (aiMode) {
      playRoundAI();
      if (!gameRunning) {
        return;
      }
    }

    displayController.displayUpdate("turn");
  };

  let playRoundAI = () => {
    console.log(round);
    let empty = GameBoard.getEmptyIndexes();
    let randomIndex = empty[Math.floor(Math.random() * empty.length)];
    GameBoard.addToBoard(randomIndex, getCurrentPlayerSign());
    displayController.displayAIMove(randomIndex);
    if (checkWinner(randomIndex)) {
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
    displayController.emptyFields();
  };

  let isGameOver = () => {
    return !gameRunning;
  };

  let changeMode = (mode) => {
    if (mode === "pvp" && aiMode) {
      aiMode = false;
      reset();
    } else if (mode === "ai" && !aiMode) {
      aiMode = true;
      reset();
    }
  };

  return {
    playRound,
    isGameOver,
    getCurrentPlayerSign,
    reset,
    changeMode,
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

  let displayAIMove = (index) => {
    fields.forEach((field) => {
      if (parseInt(field.dataset.location) === index) {
        field.textContent = Game.getCurrentPlayerSign();
      }
    });
  };

  let emptyFields = () => {
    updateField.textContent = "Player X's Turn";
    fields.forEach((field) => {
      field.textContent = "";
      field.style.backgroundColor = `rgba(50, 53, 58, 1)`;
      field.style.transform = `scale(1)`;
    });
  };

  clearBtn.addEventListener("click", () => {
    Game.reset();
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

  let controlBtns = document.querySelectorAll(".control_btn");
  controlBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (!btn.classList.contains("active_btn")) {
        btn.classList.add("active_btn");
      }

      if (btn.classList.contains("pvpBtn")) {
        Game.changeMode("pvp");
      } else if (btn.classList.contains("pvcBtn")) {
        Game.changeMode("ai");
      }
      controlBtns.forEach((btn) => {
        if (btn != e.target) {
          btn.classList.remove("active_btn");
        }
      });
    });
  });

  return {
    colorWinningCOmbination,
    displayUpdate,
    emptyFields,
    displayAIMove,
  };
})();
