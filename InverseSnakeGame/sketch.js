/*
TODO:
	- Wrapping Walls?
	- Pause/flash when eaten
	- Fix about wording
*/

// Snake Game AI Algorithm Game

let MODE = 'menu';
let DIFFICULTY = 'Easy';
let PAUSE = false;

let algorithm = 'alphasnake';

let DEBUG = false;

const scl = 35;  // Sizing
const cols = 30; // Width
const rows = 20; // Height
const out = scl / 5;   // Outline

// Hardcoded menu parameters
console.assert(cols == 30);
console.assert(rows == 20);

// Adaptive scaling factor for all sizes (built hardcoded to scl = 30)
const cnst = scl / 30;

let moves = 0;
let highScore = 0;
let snakeTraps = 0;
let eaten = 0;

let menu;

let grid;
let snake;
let cycle;
let food;

let frameSpeed;

const difficultyFrameSpeeds = {
	'Easy': {
		frameSpeed: 12,
		increase: 0
	},

	'Hard': {
		frameSpeed: 15,
		increase: 0.2,
	},

	'Impossible': {
		frameSpeed: 24,
		increase: 0.5
	}
}

let shrinkFrame = null;
let deadFrame = 0;
let deadPause = 40;

let speed = 1;
let frame = 0;

let font;
function preload() {
	font = loadFont('assets/CnstrctRegular-m83v.ttf');
}

function keyPressed() {
	
	if (keyCode == 32) PAUSE = !PAUSE

	if (DEBUG) {
		if (key == 'm') speed = 10;
	}

}

function keyReleased() {
	if (DEBUG) {
		if (key === 'm') speed = 1;
	}
}

function getAvgPos(one, two) {
	const avgX = (one.x + two.x) / 2;
	const avgY = (one.y + two.y) / 2;
	return createVector(avgX, avgY);
}

function vectorIsInArray(array, vector) {
	for (let i = 0; i < array.length; i++) {
		if (array[i].equals(vector)) return true;
	} return false;
}

function shuffle(array) {
	array.sort(() => random(1));
	return array;
}

function setup() {
	
	let canvas = createCanvas(cols * scl, rows * scl);
	canvas.parent('inversnake-canvas');

	textFont(font);
	textAlign(LEFT, TOP);

	grid = new Grid(cols, rows, scl);
	grid.createGrid();

	cycle = new HamiltonianCycle(grid);
	cycle.generateHamiltonianCycle();
	grid.cycle = cycle;

	food = new Food(grid);
	snake = new Snake(grid, food);
	
	menu = new Menu();

	snakeTraps = 0;
	eaten = 0;
	moves = 0;
	highScore = 0;

}

function showInfo() {
	// Display information to screen over snake
	fill(255);
	textSize(16 * cnst);
	textAlign(RIGHT);

	// text(`Moves: ${moves}`, width - 120 * cnst, height - 55 * cnst);
	// text(`Max Moves: ${highScore}`, width - 167 * cnst, height - 30 * cnst);
	text(`Snake Traps: ${snakeTraps}`, width - 20 * cnst, 10 * cnst);
	text(`Times Eaten: ${eaten}`, width - 20 * cnst, 30 * cnst);
	// text(`Snake Length: ${snake.drawnLength}`, width - 189 * cnst, height - 30 * cnst);

	textAlign(LEFT);

	if (snake.dead) {
		textSize(30 * cnst);
		fill(255);
		textAlign(CENTER);
		text('Snake Trapped!', width / 2, 30 * cnst);
		textAlign(LEFT);
	}

	if (PAUSE) {
		background('rgba(10, 10, 10, 0.5)');
		fill(100)
		rect(width / 2 - 70, height / 3, 50 * cnst, height / 3);
		rect(width / 2 + 35, height / 3, 50 * cnst, height / 3);
	}

	let backZone = [20 * cnst, 20 * cnst, 80 * cnst, 25 * cnst];
	textSize(20 * cnst);
	if (inZone([createVector(mouseX, mouseY)].concat(backZone))) {
		fill(255);
		if (mouseIsPressed) {
			MODE = 'menu';
			setup();
		}
	} else fill(150);
	text('< Menu', backZone[0], backZone[1]);

}

function gameInitialize() {
	// Make sure initializations are set properly
	PAUSE = false;
	frameSpeed = difficultyFrameSpeeds[DIFFICULTY].frameSpeed
	algorithm = DIFFICULTY == 'Impossible' ? 'hamilton' : 'alphasnake'
}

function updateFood() {
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

}

function showGame() {
	/* Run game update */

	if (moves == 0) {
		gameInitialize();
	}

	frameRate(frameSpeed);

	if (PAUSE) {
		snake.show();
		showInfo();
		return;
	}

	// Hold down my initials for verbose debug mode
	DEBUG = keyIsDown(84) && keyIsDown(74) && keyIsDown(75);
	if (DEBUG) {
		grid.show();
		cycle.show(showPrim = false, showCycle = true);
	}

	for (let s = 0; s < speed; s++) {

		
		if (!snake.dead) {

			if (algorithm == 'alphasnake') {
				snake.AlphaSnake();
			} else if (algorithm == 'hamilton') {
				snake.ShortcutHamilton();
			}
			// snake.FollowCycle();

			snake.run();

			updateFood();
			
			// Scoring
			moves++;
			highScore = max(moves, highScore);
			if (snake.justAte) {
				eaten++;
				moves = 1;
				frameSpeed += difficultyFrameSpeeds[DIFFICULTY].increase;
			}

			if (moves % shrinkFrame == 0) {
				snake.shrink();
			}
		}

		if (snake.dead) {
			if (deadFrame == 0) {
				// moves = 1;
				snakeTraps++;
			}
			
			if (deadFrame < deadPause) {
				deadFrame++;
				updateFood();
				snake.show();
			} else {
				deadFrame = 0;
				snake = new Snake(grid, food);
				frameSpeed = difficultyFrameSpeeds[DIFFICULTY].frameSpeed;
			}
			
		} else if (snake.won) {
			snake = new Snake(grid, food);
			frameSpeed = difficultyFrameSpeeds[DIFFICULTY].frameSpeed;
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
