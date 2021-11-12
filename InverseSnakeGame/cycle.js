

class HamiltonianCycle {

	constructor(grid) {

		this.grid = grid;
		this.scl = grid.scl;
		this.sclh = this.scl / 2

		this.coordinates = new Grid(grid.cols / 2, grid.rows / 2, grid.scl * 2);
		this.coordinates.createGrid();

		for (let i = 0; i < this.coordinates.cells.length; i++) {
			this.coordinates.cells[i].x += this.scl / 2;
			this.coordinates.cells[i].y += this.scl / 2;
		}

		this.forest = [];
		this.walls = [];
		this.edges = [];

		this.cycle = [];
		this.indexes = {};
		this.indexList = [];
	}

	generateSpanningTree() {
		
		this.forest = []
		this.walls = []
		this.edges = []
		
		let position = this.coordinates.randomPos()
		this.forest.push(position);

		while (this.forest.length < this.coordinates.cells.length) {

			const connection = this.getRandomPrimNode();
			position = connection[0];
			const direction = random(connection[1]);

			const edge = new Edge(position, direction, this.scl);
			edge.getWallsBetweenNodes();

			for (let wall of edge.walls) {
				this.walls.push(wall);
			}

			this.forest.push(direction)
			this.edges.push(edge);

		}
	}

	traversePath() {

		this.cycle = [];
		const runner = new Runner(this.grid.randomPos(), this.walls, this.grid.cells, this.scl);

		while (runner.traveled.length < this.grid.cells.length) {

			const directions = [createVector(-1, 0), createVector(0, -1), createVector(1, 0), createVector(0, 1)];

			const current = runner.strDirections.indexOf(runner.dir);
			let nextOne = current + 1;
			let prev = current - 1;

			if (nextOne >= directions.length) nextOne = 0
			if (prev < 0) prev = directions.length - 1;

			const canGoLeft = runner.canGo(directions[prev]);
			const canGoStraight = runner.canGo(directions[current]);
			const canGoRight = runner.canGo(directions[nextOne]);

			if (canGoLeft) {
				this.moveRunner(prev, runner);
			} else if (canGoStraight) {
				this.moveRunner(current, runner);
			} else if (canGoRight) {
				this.moveRunner(nextOne, runner);
			}

			runner.traveled.push(runner.getPos());
			this.cycle.push(runner.getPos());
		}

	}

	moveRunner(index, runner) {
		if (index == 0) runner.left();
		else if (index == 1) runner.up();
		else if (index == 2) runner.right();
		else if (index == 3) runner.down();
	}

	getRandomPrimNode() {

		this.forest = shuffle(this.forest);

		for (let pos of this.forest) {

			const above = createVector(pos.x, pos.y - this.coordinates.scl);
			const below = createVector(pos.x, pos.y + this.coordinates.scl);
			const onright = createVector(pos.x + this.coordinates.scl, pos.y);
			const onleft = createVector(pos.x - this.coordinates.scl, pos.y);

			const neighbors = [above, below, onright, onleft];
			const adjacent = [];

			for (let val of neighbors) {
				if (!vectorIsInArray(this.forest, val)) {
					if (vectorIsInArray(this.coordinates.cells, val)) {
						if (!val.equals(pos)) {
							adjacent.push(val);
						}
					}
				}
			}

			if (adjacent.length > 0) {
				return [pos, adjacent];
			}
			
		}

	}

	generateHamiltonianCycle() {

		this.generateSpanningTree();
		this.traversePath();

		while (true) {
			let complete = true;
			for (let cell of this.grid.cells) {
				if (!vectorIsInArray(this.cycle, cell)) {
					complete = false;
					break;
				}
			}
			if (!complete) {
				this.generateSpanningTree();
				this.traversePath();
			} else {
				break
			}
		}

		for (let i = 0; i < this.cycle.length; i++) {
			const list = [this.cycle[i].x, this.cycle[i].y];
			this.indexes[list] = i;
		}
		return this.cycle;

	}

	getIndexOf(pos) {
		return this.indexes[[pos.x, pos.y]];
	}

	pathDistance(pos1, pos2) {
		if (pos1 < pos2) {
			return pos2 - pos1 - 1;
		} return pos2 - pos1 - 1 + this.cycle.length;
	}

	show(showPrim = false, showCycle = true) {
		if (showPrim) {
			for (let edge of this.edges) {
				edge.show();
			}
		} if (showCycle) {
			// Why is this not working
			noFill();
			stroke(150);
			strokeWeight(1);
			for (let i = 0; i < this.cycle.length - 1; i++) {
				line(this.cycle[i].x + this.sclh, this.cycle[i].y + this.sclh, this.cycle[i+1].x + this.sclh, this.cycle[i+1].y + this.sclh);
				// stroke(100);
				// textSize(9);
				// textWidth(0.01);
				// text(this.getIndexOf(this.cycle[i]), this.cycle[i].x - 3, this.cycle[i].y + 3)
			}
		}
	}
}


class Edge {

	constructor(node1, node2, scl) {

		this.node1 = node1;
		this.node2 = node2;
		
		this.scl = scl;
		this.sclh = scl / 2;
		this.sclm = scl * 1.5;
		
		this.walls = []
		this.directionToNode1 = createVector(0, 0);
		this.directionToNode2 = createVector(0, 0)
	}

	show() {
		stroke(0, 0, 255);
		line(this.node1.x + this.sclh, this.node1.y + this.sclh, this.node2.x + this.sclh, this.node2.y + this.sclh);
		// for (let wall of this.walls) ellipse(wall.x, wall.y, 5, 5);
	}

	getWallsBetweenNodes() {

		const direction = this.getDirectionBetweenNodes();
		const xoff = direction.x;
		const yoff = direction.y;

		const differences = [this.sclh, this.sclm];

		for (let i = 0; i < differences.length; i++) {
			const pos = this.node1.copy();

			pos.x += xoff * differences[i];
			pos.y += yoff * differences[i];

			this.walls.push(pos);
		}

		return this.walls;

	}

	getDirectionBetweenNodes() {
		
		let xoff = this.node2.x - this.node1.x;
		let yoff = this.node2.y - this.node1.y;

		if (xoff != 0) xoff /= abs(xoff);
		else if (yoff != 0) yoff /= abs(yoff);

		this.directionToNode2 = createVector(xoff, yoff);
		this.directionToNode1 = createVector(yoff, xoff);
		
		return this.directionToNode2;

	}

}


class Runner {

	constructor(pos, maze, grid, scl) {

		this.x = pos.x;
		this.y = pos.y;

		this.dir = 'right';
		this.strDirections = ['left', 'up', 'right', 'down'];

		this.scl = scl;
		this.sclh = scl / 2;
		this.sclm = scl * 1.5;

		this.grid = grid;
		this.maze = maze;
		this.traveled = [];
	}

	getPos() {
		return createVector(this.x, this.y);
	}

	canGo(direction) {
		const scaled = direction.copy();
		direction.x *= this.scl; direction.y *= this.scl;
		if (vectorIsInArray(this.grid, createVector(this.x + direction.x, this.y + direction.y))) {
			if (!vectorIsInArray(this.traveled, createVector(this.x + direction.x, this.y + direction.y))) {
				if (!vectorIsInArray(this.maze, createVector(this.x + (scaled.x * this.sclh), this.y + (scaled.y * this.sclh)))) {
					return true;
				}
			}
		} return false;
	}

	up() {
		this.y -= this.scl;
		this.dir = 'up';
	}
	down() {
		this.y += this.scl;
		this.dir = 'down';
	}
	right() {
		this.x += this.scl;
		this.dir = 'right';
	}
	left() {
		this.x -= this.scl;
		this.dir = 'left';
	}

}