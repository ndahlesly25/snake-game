/* ----------  Canvas & basic settings  ---------- */
const canvas  = document.getElementById("gameCanvas");
const ctx     = canvas.getContext("2d");
const BOX     = 20;                              // size of each grid square
canvas.width  = window.innerWidth < 500 ? 300 : 400;
canvas.height = canvas.width;                   // keep square board
const GRID    = canvas.width / BOX;

/* ----------  Sounds  ---------- */
const eatSound      = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");
const clickSound    = document.getElementById("clickSound");

/* ----------  Game-state variables  ---------- */
let snake     = [];
let food      = {};
let direction = null;
let timerID   = null;
let isPaused  = false;
let gameOver  = false;
let score     = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
document.getElementById("highScore").textContent = highScore;

/* ----------  Event listeners  ---------- */
document.addEventListener("keydown", e => setDirection(e.key));
document.getElementById("startBtn").addEventListener("click", () => { clickSound.play(); startGame(); });
document.getElementById("pauseBtn")?.addEventListener("click", togglePause);

/* ----------  Game controls (keyboard + on-screen buttons)  ---------- */
function setDirection(key) {
  if ((key === "ArrowLeft" || key === "LEFT")  && direction !== "RIGHT")  direction = "LEFT";
  if ((key === "ArrowUp"   || key === "UP")    && direction !== "DOWN")   direction = "UP";
  if ((key === "ArrowRight"|| key === "RIGHT") && direction !== "LEFT")   direction = "RIGHT";
  if ((key === "ArrowDown" || key === "DOWN")  && direction !== "UP")     direction = "DOWN";
}

/* ----------  Start / Restart ---------- */
function startGame() {
  score      = 0;
  direction  = "RIGHT";
  gameOver   = false;
  isPaused   = false;
  snake      = [{ x: 9 * BOX, y: 10 * BOX }];
  food       = randomFoodPos();
  document.getElementById("score").textContent = score;
  clearInterval(timerID);
  timerID = setInterval(gameLoop, 150);
}

/* ----------  Main game loop ---------- */
function gameLoop() {
  if (isPaused || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* --- draw snake --- */
  snake.forEach((seg, i) => {
    ctx.fillStyle = i ? "lightgreen" : "green";
    ctx.fillRect(seg.x, seg.y, BOX, BOX);
  });

  /* --- draw food --- */
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, BOX, BOX);

  /* --- move snake head (wrap around) --- */
  let head = { ...snake[0] };
  if (direction === "LEFT")  head.x -= BOX;
  if (direction === "RIGHT") head.x += BOX;
  if (direction === "UP")    head.y -= BOX;
  if (direction === "DOWN")  head.y += BOX;

  // wrap
  if (head.x < 0)               head.x = canvas.width - BOX;
  else if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0)               head.y = canvas.height - BOX;
  else if (head.y >= canvas.height) head.y = 0;

  /* --- self-collision? -> game over --- */
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    endGame();
    return;
  }

  /* --- food eaten? --- */
  if (head.x === food.x && head.y === food.y) {
    score++;
    eatSound.play();
    document.getElementById("score").textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("highScore").textContent = highScore;
    }
    food = randomFoodPos();
  } else {
    snake.pop(); // move tail
  }

  snake.unshift(head);
}

/* ----------  Helper: random food pos not on snake ---------- */
function randomFoodPos() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID) * BOX,
            y: Math.floor(Math.random() * GRID) * BOX };
  } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
  return pos;
}

/* ----------  Pause / Resume ---------- */
function togglePause() {
  if (gameOver || !timerID) return;
  isPaused = !isPaused;
  document.getElementById("pauseBtn").textContent = isPaused ? "Resume" : "Pause";
  clickSound.play();
}

/* ----------  End game & show overlay ---------- */
function endGame() {
  clearInterval(timerID);
  gameOver = true;
  gameOverSound.play();

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "20px Arial";
  ctx.fillText("Click to Play Again", canvas.width / 2, canvas.height / 2 + 30);

  canvas.addEventListener("click", startGameOnce);
}

function startGameOnce() {
  canvas.removeEventListener("click", startGameOnce);
  clickSound.play();
  startGame();
}
