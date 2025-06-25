const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; // size of each grid block


// Resize canvas based on screen width
const screenWidth = window.innerWidth;
const size = screenWidth < 500 ? 300 : 400;
canvas.width = size;
canvas.height = size;


let score = 0;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};

document.addEventListener("keydown", setDirection);
document.getElementById("startBtn").addEventListener("click", startGame);

function setDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}


function changeDirection(dir) {
  switch (dir) {
    case 'up':
      if (dy === 0) {
        dx = 0;
        dy = -10;
      }
      break;
    case 'down':
      if (dy === 0) {
        dx = 0;
        dy = 10;
      }
      break;
    case 'left':
      if (dx === 0) {
        dx = -10;
        dy = 0;
      }
      break;
    case 'right':
      if (dx === 0) {
        dx = 10;
        dy = 0;
      }
      break;
  }
}






function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw the food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move the snake
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Game over conditions
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(game);
    alert("Game Over!");
    return;
  }

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop(); // remove the tail
  }

  snake.unshift(head);
}

function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

let game;
function startGame() {
  score = 0;
  direction = null;
  snake = [{ x: 9 * box, y: 10 * box }];
  document.getElementById("score").textContent = score;
  clearInterval(game);
  game = setInterval(drawGame, 150);
}
