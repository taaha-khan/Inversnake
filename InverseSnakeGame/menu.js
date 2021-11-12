
class Menu {

	constructor() {
		this.difficulty = 'Easy';
		this.switchFrame = 0;
		this.screen = 'menu';
	}

	inZone(data) {
		const [pos, startX, startY, width, height] = data;
		return (pos.x >= startX && pos.y >= startY && pos.x <= startX + width && pos.y <= startY + height)
	}

	drawRect(data) {
		const [startX, startY, width, height] = data;
		rect(startX - 10, startY - 5, width + 20, height + 10);
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

		this.switchFrame++;

		textSize(10);
		text(`(${Math.round(mouseX)}, ${Math.round(mouseY)})`, mouseX, mouseY);
		if (mouseIsPressed) print(`(${mouseX}, ${mouseY})`);

		// TODO: Change font to something cool
		fill(255);
		textSize(75);
		textAlign(LEFT);
		text("Inversnake", width / 10, height / 6);

		textSize(35);

		let zones = [['Play Game', 0], ['Difficulty ' + this.difficulty, 70], ['About', 140]]

		for (let zone of zones) {
			let box = [width / 10, height / 2 + zone[1], 350, 50];
			if (this.inZone([this.mousePos].concat(box))) {
				fill(50);
				this.drawRect(box);
				if (mouseIsPressed) {
					if (zone[0][0] == 'P') {
						MODE = 'game';
						DIFFICULTY = this.difficulty.toLowerCase();
					} else if (zone[0][0] == 'D' && this.switchFrame > 20) {
						this.difficulty = this.difficulty == 'Easy' ? 'Hard' : 'Easy';
						this.switchFrame = 0;
					} else if (zone[0][0] == 'A') {
						this.screen = 'about';
					}
				}
			}
			fill(255);
			text(zone[0], box[0], box[1]);
		}

	}

	showAbout() {
		background(10);

		let backZone = [20, 20, 80, 25];
		
		textSize(20);
		if (this.inZone([this.mousePos].concat(backZone))) {
			fill(100);
			if (mouseIsPressed) {
				this.screen = 'menu';
			}
		} else fill(255);
		text('< Back', backZone[0], backZone[1]);

		fill(255);
		textSize(60);
		textAlign(CENTER);
		text('About', width / 2, height / 10);
		textAlign(LEFT, TOP);

		textSize(30);
		this.showText(
			'This game is a spin off the classic \'Snake Game\' where a snake would move around eating apples and growing larger. The twist is, the player becomes the food now, and must run away from a hungry AI snake! Use the WASD keys to move around, and the spacebar to pause. Try not to get trapped! - TaahaKhan.com', 
			width / 20, height / 3
		);

	}

	showText(info, x, y) {
		let words = info.split(' ');
		let data = ''
		let characters = 0;
		for (let word of words) {
			characters += (word.length + 1);
			if (characters > 35) {
				characters = 0;
				word = word + '\n';
			}
			data += ' ' + word;
		}
		text(data, x, y);
	}
}