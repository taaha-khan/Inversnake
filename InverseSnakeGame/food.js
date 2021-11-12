
class Food {
	
	constructor(grid) {
		this.grid = grid;
		this.pos = grid.randomPos().copy();
	}

	setPosition() {
		let temp = grid.randomPos().copy();
		while (snake.isInBody(temp) || snake.pos.equals(temp)) {
			temp = grid.randomPos().copy();
		}
		this.pos = temp;
	}

	move(dir, blocked) {
		let pos = p5.Vector.add(this.pos, dir)
		if (!(vectorIsInArray(blocked, pos) || !vectorIsInArray(this.grid.cells, pos))) {
			this.pos = pos;
		}
	}

	show() {
		fill(255, 0, 0);
		noStroke();
		rect(this.pos.x, this.pos.y, scl-out, scl-out);
	}

}
