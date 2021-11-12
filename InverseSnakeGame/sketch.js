/*
TODO:
	- Wrapping Walls?
*/

// Snake Game AI Algorithm Game

const MODES = ['menu', 'game'];
let MODE = 'menu';
let DIFFICULTY = 'easy';
let PAUSE = false;

let algorithm = 'hamilton';

let DEBUG = false;

const scl = 30;  // Sizing
const cols = 30; // Width
const rows = 20; // Height
const out = 6;   // Outline

let moves = 0;
let highScore = 0;

let menu;

let grid;
let snake;
let cycle;
let food;

let speed = 1;
let initialSpeed = 17;
let frameSpeed = 17;
let frameSpeedIncrease = 0;

let shrinkFrame = 100;

let frame = 0;

let font;

function preload() {
	font = loadFont('CnstrctRegular-m83v.ttf');
}

function keyPressed() {
	
	if (keyCode == 84) {
		DEBUG = !DEBUG;
	} else if (keyCode == 32) {
		PAUSE = !PAUSE
	}

	if (DEBUG) {
		if (key === 's') speed = 10;
	}

}

function keyReleased() {
	if (DEBUG) {
		if (key === 's') speed = 1;
	}
}

const getAvgPos = function(one, two) {
	const avgX = (one.x + two.x) / 2;
	const avgY = (one.y + two.y) / 2;
	return createVector(avgX, avgY);
}

const vectorIsInArray = function(array, vector) {
	for (let i = 0; i < array.length; i++) {
		if (array[i].equals(vector)) return true;
	} return false;
}

const shuffle = function(array) {
	array.sort(() => random(1) * 2 - 1);
	return array;
}

function setup() {
	createCanvas(cols * scl, rows * scl);

	textFont(font);
	textAlign(LEFT, TOP);

	menu = new Menu();

	grid = new Grid(cols, rows, scl);
	grid.createGrid();

	cycle = new HamiltonianCycle(grid);
	cycle.generateHamiltonianCycle();
	grid.cycle = cycle;

	food = new Food(grid);
	snake = new Snake(grid, food);

}

function showInfo() {
	// Display information to screen over snake
	fill(255);
	textSize(16);
	text(`Score: ${moves}`, width - 106, 10);
	text(`High Score: ${highScore}`, width - 153, 30);
	text(`Snake Length: ${snake.body.length}`, width - 175, height - 30);
	textSize(30);

	if (PAUSE) {
		background('rgba(10, 10, 10, 0.5)');
		fill(100)
		rect(width / 2 - 100, height / 3, 50, height / 3);
		rect(width / 2 + 50, height / 3, 50, height / 3);
	}
}


function showGame() {
	/* Run game update */

	// Game will speed up
	if (DIFFICULTY == 'hard') {
		frameSpeedIncrease = 1;
	}

	frameRate(frameSpeed);

	if (PAUSE) {
		snake.show();
		showInfo();
		return;
	}

	if (DEBUG) {
		grid.show();
		cycle.show(showPrim = false, showCycle = true);
	}

	for (let s = 0; s < speed; s++) {

		let movement = createVector(0, 0)
		
		if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
			movement.add(createVector(-scl, 0));
		} if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
			movement.add(createVector(scl, 0))
		} if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
			movement.add(createVector(0, -scl))
		} if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
			movement.add(createVector(0, scl))
		}

		food.move(movement, snake.body.concat([snake.pos]));

		if (algorithm == 'alphasnake') {
			snake.AlphaSnake();
		} else if (algorithm == 'hamilton') {
			snake.ShortcutHamilton();
		}
		// snake.FollowCycle();

		snake.run();

		// Scoring
		moves++;
		highScore = max(moves, highScore);
		if (snake.growthLength == snake.gainFromFood - 1) {
			moves = 1;
		}

		if (moves % shrinkFrame == 0) {
			snake.shrink();
		}

		if (snake.dead) {
			snake = new Snake(grid, food);
			moves += 100;
			frameSpeed = 17;
		} else if (snake.won) {
			return;
		}
	}

	showInfo();
	
}

function draw() {
	/* Run frame update */

	background(10);

	if (MODE == 'menu') {
		menu.show();
	} else if (MODE == 'game') {
		showGame();
	}

	frame++;
}
