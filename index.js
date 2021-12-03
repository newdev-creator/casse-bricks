
// =======================
// ====== VARIABLES ======
// =======================
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;

// angle déplacement
let dx = 2;
let dy = -2;

// angle de rebon
let ballRadius = 10;

// raquette
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// key control
let rightPressed = false;
let leftPressed = false;


// les briques
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { 
          x: 0,
          y: 0,
          status: 1
        };
    }
}

// le score
let score = 0;

// vies de départ
let lives = 3;



// =======================
// ====== FONCTIONS ======
// =======================
// controle avec le clavier gauche et droite
function keyDownHandler(event) {
  if (event.key == "Right" || event.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (event.key == "Left" || event.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key == "Right" || event.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (event.key == "Left" || event.key == "ArrowLeft") {
    leftPressed = false;
  }
}



// controle à la sourie
function mouseMoveHandler(event) {
  let relativeX = event.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}



// Gérer la collision
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("C'est gagné, Bravo !");
            document.location.reload();
            // clearInterval(interval);
          }
        }
      }
    }
  }
}


// pour dessiner le score
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}



// Pour dessiner le compteur de vies
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 95, 20)
}



// pour dessiner la balle
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Pour dessiner la raquette
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
    );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Pour dessiner les bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath;
      }
    }
  }
}



// Pour le déplacement de la balle et la raquette
function draw() {
  // on efface l'ancienne balle
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // on dessine les elements sur le canva
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // gére la collision à gauche et à droite
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius)  {
    dx = -dx;
  }

  // gére la collision inférieur et sur la raquette
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
        // clearInterval(interval);
      }
      else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.with - paddleWidth / 2);
      }
    }
  }
  
  // direction de la raquette
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
  else if (leftPressed) {
    paddleX += -7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


// Pour la vitesse de déplacement de la balle
// let interval = setInterval(draw, 10);
draw();