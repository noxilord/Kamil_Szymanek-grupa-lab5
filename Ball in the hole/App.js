let board = document.querySelector('#board');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let ball = document.createElement('div');
ball.className = 'ball';
board.appendChild(ball);
let ballX = ball.getBoundingClientRect().left + 25;
let ballY = ball.getBoundingClientRect().top - 25;

let ballObject = {
    x: ballX,
    y: ballY,
    speedX: 0,
    speedY: 0
};

function changeBallPosition(e) {
    ballObject.speedX = e.gamma / 30;
    ballObject.speedY = e.beta / 30;
}

let holes = [];

let score = 0;
let highScores = [];
let hasWon;
let gameRun = false;

window.addEventListener('deviceorientation', changeBallPosition);

function moveBall() {
    if(ballObject.x + ballObject.speedX < windowWidth && ballObject.x + ballObject.speedX > 0) {
        ballObject.x += ballObject.speedX;
        ball.style.left = `${ballObject.x}px`;
    }

    if(ballObject.y + ballObject.speedY < windowHeight && ballObject.y + ballObject.speedY > 0) {
        ballObject.y += ballObject.speedY;
        ball.style.top = `${ballObject.y}px`;
    }

    checkCollision();

    if(gameRun) {
        window.requestAnimationFrame(moveBall);
    }
}

window.onload = function() {
    loadScreen();
};

let loadScreenView = document.querySelector('.start-screen');
let leaderBoardsView = document.querySelector('.leaderboard');
let overlay = document.querySelector('.overlay');

function startGame() {
    score = 0;
    generateHoles();
    generateGoal();
    document.querySelector('.screen').style.zIndex = -1;
    overlay.style.zIndex = -1;
    gameRun = true;
    moveBall();
    score = Date.now();
}

function loadScreen() {
    loadScreenView.style.visibility = 'visible';
    leaderBoardsView.style.visibility = 'hidden';
}

function showLeaderBoards() {
    loadScreenView.style.visibility = 'hidden';
    leaderBoardsView.style.visibility = 'visible';
}

function closeLeaderBoards() {
    loadScreenView.style.visibility = 'visible';
    leaderBoardsView.style.visibility = 'hidden';
}

function generateHoles() {
    for (let i = 2; i < windowWidth / 100; i++) {
        let hole = document.createElement('div');
        hole.classList.add('ball__obstacle');
        hole.classList.add('ball');
        hole.style.left = 100 * i + Math.random() * 75 - 95 + 'px';
        hole.style.top = Math.random() * windowHeight / 2 + windowHeight / 2 - 100 + 'px';
        holes.push(hole);
        board.appendChild(hole);
    }
}

function generateGoal() {
    let goal = Math.floor(Math.random() * holes.length);
    holes[goal].classList.add('ball__goal');
    holes[goal].classList.remove('ball__obstacle');
}

function checkCollision() {
    for (let i = 0; i < holes.length; i++) {
        if(ballObject.y + 13 <= (Math.floor(holes[i].style.top.slice(0, -2)) + 25) && ballObject.y + 13 >= Math.floor(holes[i].style.top.slice(0, -2))
            && ballObject.x + 13 <= (Math.floor(holes[i].style.left.slice(0, -2)) + 25) && ballObject.x + 13 >= Math.floor(holes[i].style.left.slice(0, -2))
        ) {
            if(holes[i].classList.contains('ball__goal')){
                gameRun = false;
                let finalScore = Date.now();
                score = finalScore - score;
                hasWon = true;
                endGame(score, hasWon);
            } else {
                gameRun = false;
                hasWon = false;
                score = 0;
                endGame(score, hasWon);
            }
        }
    }
}

function endGame(score, hasWon) {
    if(hasWon) {
        alert('You won with final score of ' + score);
    } else {
        alert('Well, you lose');
    }
    clearBoard();
    holes = [];
    ballObject = {
        x: ballX,
        y: ballY,
        speedX: 0,
        speedY: 0
    };

    document.querySelector('.screen').style.zIndex = 1000;
    overlay.style.zIndex = 999;
}

function clearBoard() {
    window.location.reload();
    for(let i = 0; i < document.getElementsByClassName('ball').length; i++) {
        board.removeChild(document.getElementsByClassName('ball')[i]);
    }
}