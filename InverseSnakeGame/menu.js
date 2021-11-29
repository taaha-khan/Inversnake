/**
	I hate this so much akljfdksljfklasdjflkds
*/

function inZone(data) {
	const [pos, startX, startY, width, height] = data;
	return (pos.x >= startX && pos.y >= startY && pos.x <= startX + width && pos.y <= startY + height)
}

class Menu {

	constructor() {
		this.difficulty = 'Easy';
		this.switchFrame = 0;
		this.screen = 'menu';

		frameRate(18);

		// yuck
		// this.cycleCoords = [[18, 9], [19, 9], [20, 9], [21, 9], [22, 9], [23, 9], [24, 9], [25, 9], [26, 9], [26, 10], [26, 11], [26, 12], [26, 13], [26, 14], [26, 15], [26, 16], [26, 17], [25, 17], [24, 17], [23, 17], [22, 17], [21, 17], [20, 17], [19, 17], [18, 17], [18, 16], [18, 15], [18, 14], [18, 13], [18, 12], [18, 11], [18, 10]];
		this.cycleCoords = [[19, 9], [20, 9], [21, 9], [22, 9], [23, 9], [24, 9], [25, 9], [26, 9], [27, 9], [27, 10], [27, 11], [27, 12], [27, 13], [27, 14], [27, 15], [27, 16], [27, 17], [26, 17], [25, 17], [24, 17], [23, 17], [22, 17], [21, 17], [20, 17], [19, 17], [19, 16], [19, 15], [19, 14], [19, 13], [19, 12], [19, 11], [19, 10]]
		
		this.demoCycle = []
		for (let coord of this.cycleCoords) {
			this.demoCycle.push(createVector(coord[0] * scl + out / 2, coord[1] * scl + out / 2));
		}

		this.demoFood = new Food(grid);
		this.demo = new Snake(grid, this.demoFood);
		this.demo.pos = this.demoCycle[0].copy();
		this.demo.growthLength = Math.round(this.demoCycle.length * 0.4);
		this.demoFood.pos = createVector(23 * scl + out / 2, 13 * scl + out / 2);
	
	}


	drawRect(data) {
		const [startX, startY, width, height] = data;
		// rect(startX - 10 * cnst, startY - 5 * cnst, width + 20 * cnst, height + 10 * cnst);
		rect(startX, startY, width, height);
	}

	show() {
		this.mousePos = createVector(mouseX, mouseY);
		if (this.screen == 'menu') {
			this.showMenu();
		} else if (this.screen == 'about') {
			this.showAbout();
		}
	}

	showMenu() {

		this.demo.FollowCycleGiven(this.demoCycle);
		this.demo.run();

		this.switchFrame++;

		fill(255);
		noStroke();
		textSize(75 * cnst);
		textAlign(LEFT);
		text("InverSnake", width / 10, height / 6);

		stroke(0, 150, 0);
		strokeWeight(10 * cnst);
		line(90 * cnst, 200 * cnst, 580 * cnst, 200 * cnst);

		noStroke();
		textSize(32 * cnst);

		noStroke();

		let zones = [['Play Game', 0], ['Difficulty ' + this.difficulty, 70 * cnst], ['About', 140 * cnst]]

		for (let zone of zones) {
			// let box = [width / 10, height / 2 + zone[1], 390 * cnst, 50 * cnst];
			let box = [width / 10 - 10 * cnst, height / 2 + zone[1] - 5 * cnst, 400 * cnst + 20 * cnst, 50 * cnst + 10 * cnst];
			if (inZone([this.mousePos].concat(box))) {
				fill(50);
				this.drawRect(box);
				if (mouseIsPressed) {
					if (zone[0][0] == 'P') {
						MODE = 'game';
						DIFFICULTY = this.difficulty;
						this.demo = null;
					} else if (zone[0][0] == 'D' && this.switchFrame > 4) {

						if (this.difficulty == 'Easy') this.difficulty = 'Hard'
						else if (this.difficulty == 'Hard') this.difficulty = 'Impossible'
						else if (this.difficulty == 'Impossible') this.difficulty = 'Easy';

						this.switchFrame = 0;
					} else if (zone[0][0] == 'A') {
						this.screen = 'about';
					}
				}
			}
			fill(255);
			text(zone[0], box[0] + 19 * cnst, box[1] + 5 * cnst);
		}

	}

	showAbout() {
		background(10);

		let backZone = [20 * cnst, 20 * cnst, 80 * cnst, 25 * cnst];
		textSize(20 * cnst);
		if (inZone([this.mousePos].concat(backZone))) {
			fill(150);
			if (mouseIsPressed) this.screen = 'menu';
		} else fill(255);
		text('< Menu', backZone[0], backZone[1]);

		fill(255);
		textSize(60 * cnst);
		textAlign(CENTER);
		text('About', width / 2, height / 10);
		textAlign(LEFT, TOP);

		textSize(27 * cnst);
		this.showText(
			'This game is a twist on the classic \'Snake Game\'. In InverSnake, the player controls the apple, and must move it around to trap the hungry AI snake into a knot! With three difficulty levels, see how many times you can trap the snake, and how long you can survive. Try not to get eaten!\n\n\t - TaahaKhan.com', 
			width / 14, height / 3
		);

	}

	showText(info, x, y) {
		let words = info.split(' ');
		let data = ''
		let characters = 0;
		for (let word of words) {
			characters += (word.length + 1);
			if (characters > 40) {
				characters = 0;
				word = word + '\n';
			}
			data += ' ' + word;
		}
		text(data, x, y);
	}
}