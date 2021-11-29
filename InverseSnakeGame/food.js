
class Food {
	
	constructor(grid) {
		this.grid = grid;
		this.pos = grid.randomPos().copy();
	}

	setPosition(snake) {
		let temp = grid.randomPos().copy();
		while (snake.isInBody(temp) || snake.pos.equals(temp)) {
			temp = grid.randomPos().copy();
		}
		this.pos = temp;
	}

	move(dir, blocked) {
		/* Sliding off walls movement */
		let pos = p5.Vector.add(this.pos, dir);
		if (0 < pos.x && pos.x < width && !vectorIsInArray(blocked, createVector(pos.x, this.pos.y))) {
			this.pos.x = pos.x
		} if (0 < pos.y && pos.y < height && !vectorIsInArray(blocked, createVector(this.pos.x, pos.y))) {
			this.pos.y = pos.y
		}
	}

	show() {
		fill(255, 0, 0);
		noStroke();
		rect(this.pos.x, this.pos.y, scl-out, scl-out);
	}

}
