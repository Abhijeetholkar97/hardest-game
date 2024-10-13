// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 600;
canvas.height = 400;

let count = 0;
let isGameWon = false; // Track if the game is won

// Ding (Player) object
const ding = {
  x: 50,  // Start in the small rectangle on the left
  y: 170,
  width: 13,
  height: 13,
  color: "green",
  speed: 2,
  
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },

  move() {
    if (keyState['ArrowRight']) this.x += this.speed;
    if (keyState['ArrowLeft']) this.x -= this.speed;
    if (keyState['ArrowUp']) this.y -= this.speed;
    if (keyState['ArrowDown']) this.y += this.speed;
  }
};

// Dong (enemy) object
class Dong {
  constructor(x, y, velocityY) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.color = "red";
    this.velocityY = velocityY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.velocityY;

    // Bounce off walls
    if (this.y <= 120 || this.y >= 260 - this.height) {
      this.velocityY *= -1;
    }
    this.draw();
  }
}

// Wall object
class Wall {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Create walls (rectangular boundary walls with smaller width and closed sides)
const walls = [];

// Large rectangle walls (reduced width for left and right vertical walls)
walls.push(new Wall(100, 100, 400, 20));  // Top horizontal wall
walls.push(new Wall(100, 280, 400, 20));  // Bottom horizontal wall

// Vertical walls for large rectangle
walls.push(new Wall(100, 100, 20, 60));   // Left vertical wall (top)
walls.push(new Wall(100, 220, 20, 60));   // Left vertical wall (bottom)
walls.push(new Wall(480, 100, 20, 60));   // Right vertical wall (top)
walls.push(new Wall(480, 220, 20, 60));   // Right vertical wall (bottom)

// Small rectangles around ding (closed sides)
walls.push(new Wall(20, 150, 80, 10));   // Left small rectangle (top)
walls.push(new Wall(20, 210, 100, 10));   // Left small rectangle (bottom)

// Close left side of the small rectangle
walls.push(new Wall(20, 150, 10, 70));   // Left side closing wall

walls.push(new Wall(500, 150, 80, 10));  // Right small rectangle (top)
walls.push(new Wall(480, 210, 110, 10));  // Right small rectangle (bottom)
walls.push(new Wall(580, 150, 10, 70));  // Close right side of the small rectangle

// Dong (enemies) setup
const dongs = [
  new Dong(170, 130, 2), 
  new Dong(290, 130, 2), 
  new Dong(230, 250, -2), 
  new Dong(350, 250, -2)
];

// Handle key presses
const keyState = {};
window.addEventListener('keydown', (e) => {
  keyState[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keyState[e.key] = false;
});

// Check for collisions
function detectCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Check if the player collides with any wall
function checkWallCollision(player, walls) {
  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    if (detectCollision(player, wall)) {
      return true;
    }
  }
  return false;
}

// Check if the player reaches the winning small rectangle on the right
function checkWinCondition(player) {
  const winRectangle = {
    x: 500,
    y: 150,
    width: 80,
    height: 70
  };

  if (detectCollision(player, winRectangle)) {
    isGameWon = true;
  }
}

// Main game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw walls
  walls.forEach(wall => wall.draw());

  // Update and draw dongs (enemies)
  dongs.forEach(dong => {
    dong.update();

    // Check for collision with ding (player)
    if (detectCollision(ding, dong)) {
      ding.x = 50;  // Reset position to small rectangle on the left
      ding.y = 170;
      count++;
    }
  });

  // Update and draw the player
  ding.move();

  // Check wall collisions
  if (checkWallCollision(ding, walls)) {
    ding.x = 50;  // Reset position to small rectangle on the left
    ding.y = 170;
    count++;
  }

  // Check winning condition
  checkWinCondition(ding);
  
  ding.draw();

  // Display death count
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Deaths: ' + count, 20, 30);

  // Display win message if the game is won
  if (isGameWon) {
    ctx.fillStyle = 'green';
    ctx.font = '30px Arial';
    ctx.fillText('You Win!', canvas.width / 2 - 50, canvas.height / 2);
    return; // Stop the game loop
  }

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
