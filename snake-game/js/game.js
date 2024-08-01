// Отримуємо необхідні елементи з DOM
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const startButton = document.querySelector(".game-start");
const resetButton = document.querySelector(".game-reset");
const scoreDisplay = document.querySelector(".game-score");
const gameOverMessage = document.createElement("div");
gameOverMessage.className = "game-over";
gameOverMessage.textContent = "Гра закінчена";

// Зображення змійки та їжі
const snakeImage = new Image();
snakeImage.src = "./img/snake.png";
const foodImage = new Image();
foodImage.src = "./img/cherry.png";

// Розмір клітинки та кількість клітин у грі
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// Змінні для гри
let snake = [{ x: 5, y: 5 }];
let food = { x: 10, y: 10 };
let direction = "right";
let isRunning = false;
let isGameOver = false;
let score = 0;
let lastTime = 0;
let gameSpeed = 150;

// Функція для малювання змійки та їжі
function draw() {
  if (isGameOver) {
    gameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Малюємо змійку
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(
      snakeImage,
      snake[i].x * gridSize,
      snake[i].y * gridSize,
      gridSize,
      gridSize
    );
  }

  // Малюємо їжу
  ctx.drawImage(
    foodImage,
    food.x * gridSize,
    food.y * gridSize,
    gridSize,
    gridSize
  );

  // Рухаємо змійку
  let newHead = { x: snake[0].x, y: snake[0].y };
  if (direction === "right") newHead.x++;
  if (direction === "left") newHead.x--;
  if (direction === "up") newHead.y--;
  if (direction === "down") newHead.y++;

  // Перевіряємо зіткнення змійки з їжею
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreDisplay.textContent = `Очки: ${score}`;
    generateFood();
  } else {
    snake.pop();
  }

  // Перевіряємо зіткнення зі стінами або самою собою
  if (
    newHead.x < 0 ||
    newHead.x >= gridWidth ||
    newHead.y < 0 ||
    newHead.y >= gridHeight ||
    isCollision(newHead)
  ) {
    isGameOver = true;
  }

  snake.unshift(newHead);

  // Встановлюємо таймер для наступного кадру
  if (isRunning) {
    setTimeout(draw, 150);
  }
}

// Генеруємо нову їжу
function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };
}

// Перевіряємо зіткнення зі змійкою
function isCollision(head) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

// Початок гри
startButton.addEventListener("click", () => {
  isRunning = true;
  isGameOver = false;
  snake = [{ x: 5, y: 5 }];
  direction = "right";
  score = 0;
  scoreDisplay.textContent = `Очки: ${score}`;

  // Видаляємо повідомлення "Гра закінчена", якщо воно існує
  if (gameOverMessage.parentNode) {
    gameOverMessage.parentNode.removeChild(gameOverMessage);
  }

  draw();
});

// Перезапуск гри
resetButton.addEventListener("click", () => {
  isRunning = false;
  isGameOver = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake = [{ x: 5, y: 5 }];
  direction = "right";
  score = 0;
  scoreDisplay.textContent = `Очки: ${score}`;
  draw();
});

// Керування змійкою за допомогою клавіш
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" && direction !== "left") direction = "right";
  if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (event.key === "ArrowUp" && direction !== "down") direction = "up";
  if (event.key === "ArrowDown" && direction !== "up") direction = "down";

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
  }
});

// Виведення повідомлення про завершення гри
function gameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.querySelector(".game-area").appendChild(gameOverMessage);
}

// Додаємо обробники подій для торкань
canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
  event.preventDefault();
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  event.preventDefault();
}

function handleTouchEnd(event) {
  event.preventDefault();
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== "left") {
      direction = "right"; // Вправо
    } else if (diffX < 0 && direction !== "right") {
      direction = "left"; // Вліво
    }
  } else {
    if (diffY > 0 && direction !== "up") {
      direction = "down"; // Вниз
    } else if (diffY < 0 && direction !== "down") {
      direction = "up"; // Вгору
    }
  }

  touchStartX = null;
  touchStartY = null;
}

// Запускаємо гру
draw();
