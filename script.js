let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let currentPlayer = 'X'; // Start with player X
let count = 0; 
let gameOver = false;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const modeSelect = document.getElementById("mode-select");

modeSelect.addEventListener("change", () => {
  resetGame();
});

const resetGame = () => {
  currentPlayer = 'X'; // Reset to player X
  count = 0;
  gameOver = false;
  enableBoxes();
  msgContainer.classList.add("hide");
  msg.innerText = "";
  boxes.forEach(box => {
    box.innerText = "";
    box.disabled = false;
    box.removeEventListener("click", handleClick);
    box.addEventListener("click", handleClick);
  });
};

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
  }
};

const showWinner = (winner) => {
    setTimeout(() => {
      msg.innerText = `Congratulations, Winner is ${winner}`;
      msgContainer.classList.remove("hide");
      disableBoxes();
    }, 1000); 
  };
  

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        return pos1Val;
      }
    }
  }
  return null;
};

const aiPlayer = 'O'; // AI is player O

const bestMove = () => {
  setTimeout(() => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (boxes[i].innerText === '') {
        boxes[i].innerText = aiPlayer;
        const score = minimax(boxes.map(box => box.innerText), 0, false);
        boxes[i].innerText = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    boxes[move].innerText = aiPlayer;
    boxes[move].disabled = true;
    count++;
    if (checkWinner() === null && count === 9) {
      gameDraw();
    } else {
      currentPlayer = 'X'; // After AI's move, it's player X's turn
    }
  }, 1000);
};


const handleClick = (event) => {
    if (!gameOver && event.target.innerText === "") {
      event.target.innerText = currentPlayer;
      event.target.disabled = true;
      count++;
      let winner = checkWinner();
      if (winner) {
        gameOver = true;
        showWinner(winner);
      } else if (count === 9) {
        gameOver = true;
        gameDraw();
      } else {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X'; // Switch players for two-player mode
        if (modeSelect.value === "vs-computer" ) {
            currentPlayer = 'X';
            bestMove();
        }
      }
    }
  };
  

boxes.forEach((box) => {
  box.addEventListener("click", handleClick);
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);