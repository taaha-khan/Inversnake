

class Grid {
	constructor(cols, rows, scl) {

		this.cols = cols;
		this.rows = rows;
		this.scl = scl;

		this.width = cols * scl;
		this.height = rows * scl;

		this.cells = [];
	}

	isInGrid(pos) {
		return (pos.x < this.width && pos.x >= 0 && pos.y < this.height && pos.y >= 0);
	}

	size() {
		return this.cells.length;
	}

	createGrid() {
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {
				this.cells.push(createVector(i * this.scl + out / 2, j * this.scl + out / 2));
			}
		}
		return this.cells;
	}

	show() {
		for (let i = 0; i < this.cells.length; i++) {
			stroke(50);
			// fill(20);
			noFill();
			rect(this.cells[i].x - out / 2, this.cells[i].y - out / 2, this.scl, this.scl);
			// fill(255);
			// ellipse(this.cells[i].x + scl / 2 - out / 2, this.cells[i].y + scl / 2 - out / 2, 5, 5);
		}
		strokeWeight(1);
	}

	randomPos() {
		return random(this.cells);
	}

	center() {
		return this.cells[floor(this.cells.length / 2) + floor(this.cols / 2)];
	}

	randomX() {
		return floor(random(this.cols)) * this.scl + out / 2;
	}

	randomY() {
		return floor(random(this.rows)) * this.scl + out / 2;
	}
}
