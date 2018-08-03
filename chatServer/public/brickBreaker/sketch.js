var board;
var ball;
var bricks = [];
var gameOver = true;
var youWin = false;
var winText;
var instructionText;
var drops = [];
var score = 0;

function setup() {
  var panelWidth = windowWidth - (0.5 * windowWidth);
  var panelHeight = windowHeight - (0.2 * windowHeight);
  var canvas = createCanvas(panelWidth, panelHeight);
    canvas.parent('wbPanel');

  ellipseMode(CENTER);
  textAlign(CENTER);
  noFill();
  stroke(0);

  board = new Board();
  ball = new Ball();

  for (var i = 0; i < 100; i++) {
    drops[i] = new Drop(Math.floor(random(5)));
  }

  createBricks(20);
  createText();
}

function draw() {
  background(255);

  // bricks
  for (var i = bricks.length - 1; i >= 0; i--) {
    if (ball.hits(bricks[i])) {
      if (bricks[i].r >= 40) {
        var newBricks = bricks[i].shrink();
        bricks = bricks.concat(newBricks);
      }
      bricks.splice(i, 1);
      ball.direction.y *= -1;
      break;
    }
    bricks[i].display();
  }

  // board
  board.display();
  if (!gameOver) board.checkEdges();
  if (!gameOver) board.update();

  // ball
  if (ball.meets(board)) {
    if (ball.direction.y > 0) ball.direction.y *= -1;
  }
  ball.display();
  if (!gameOver) ball.checkEdges();
  if (!gameOver) ball.update();

  if (ball.pos.y > height) {
    ball.pos = createVector(board.pos.x + board.r, height - 500);
    gameOver = true;
    ball.shadows = [];
  }

  if (bricks.length === 0) {
    youWin = true;
    gameOver = true;
  }

  if (youWin) {
    winText.style('display', 'block');
    for (var i = 0; i < drops.length; i++) {
      drops[i].fall();
      drops[i].show();
    }
  } else {
    winText.style('display', 'none');
  }

  if (gameOver) {
    instructionText.style('display', 'block');
  } else {
    instructionText.style('display', 'none');
  }
}

function keyReleased() {
  board.isMovingRight = false;
  board.isMovingLeft = false;
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    board.isMovingLeft = true;
  } else if (keyCode === RIGHT_ARROW) {
    board.isMovingRight = true;
  } else if (keyCode === SHIFT) {
    if (bricks.length === 0) createBricks(20);
    gameOver = false;
    youWin = false;
  }
}



function createBricks(n) {
  for (var i = 0; i < n; i++) {
    bricks.push(new Brick());
  }
}

function createText() {
  winText = createP('🎉🎉🎉 YOU WIN! 🎉🎉🎉');
  winText.parent('wbPanel');
  winText.style('display', 'none');
  winText.position(width / 2 - 130, 80);

  instructionText = createP("Press 'S' to Shift, 'right arrow'/'left arrow' to move Right/Left");
  instructionText.parent('wbPanel');
  instructionText.style('display', 'none');
  instructionText.position(width / 2 - 240, 100);
}
