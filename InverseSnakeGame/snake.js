

class Snake {

	constructor(grid, food) {
		this.grid = grid;
		this.scl = grid.scl;
		this.cycle = grid.cycle;
		this.hCycle = grid.cycle.cycle;

		this.pos = grid.center().copy();
		this.vel = createVector(this.scl, 0);

		this.food = food;
		this.gainFromFood = 4;
		this.growthLength = 12;
		this.drawnLength = 0;

		this.dead = false;
		this.won = false;
		this.justAte = false
		this.body = [];

		this.simplify = false;
	}

	show() {
		fill(0, 150, 0);
		noStroke();

		rect(this.pos.x, this.pos.y, this.scl-out, this.scl-out);

		for (let i = 0; i < this.body.length; i++) {
			rect(this.body[i].x, this.body[i].y, this.scl-out, this.scl-out);

			if (i < this.body.length - 1) {
				const over = getAvgPos(this.body[i], this.body[i+1]);
				rect(over.x, over.y, this.scl-out, this.scl-out);
			}

			if (this.body.length > 0) {
				const over = getAvgPos(this.body[0], this.pos);
				rect(over.x, over.y, this.scl-out, this.scl-out);
			}
		}

		this.food.show();
	}

	shrink() {
		this.body.pop();
		this.body.splice(0, 1);
		this.drawnLength--;
	}

	update() {

		for (let i = this.body.length - 1; i >= 1; i--) {
			this.body[i] = this.body[i-1].copy();
		}
		if (this.body.length > 0) {
			this.body[0] = this.pos.copy();
		}

		this.pos.add(this.vel);
		if (!this.grid.isInGrid(this.pos)) {
			this.dead = true;
		} else if (this.isInBody(this.pos)) {
			this.dead = true;
		}

		if (this.body.length >= this.grid.length - 3) this.won = true

		if (!this.won) {

			this.justAte = this.pos.equals(this.food.pos)
			if (this.justAte) {
				this.growthLength += this.gainFromFood;
				this.food.setPosition(this);
			}
	
			if (this.growthLength > 0) {
				this.addSegment();
				this.drawnLength++;
				this.growthLength--;
			}
		}

	}

	toward(pos) {
		const dir = p5.Vector.sub(pos, this.pos);
		this.move(dir);
	}

	move(dir) {
		if (!dir.equals(-this.vel.x, -this.vel.y)) {
			this.vel = dir;
		}
	}

	isInBody(pos) {
		for (let i = 0; i < this.body.length; i++) {
			if (pos.equals(this.body[i])) {
				return true;
			}
		} return false;
	}

	run() {
		if (!this.won && !this.dead) {
			this.update();
		} this.show();
	}

	addSegment() {
		let newSegment = this.pos.copy();
		if (this.body.length > 0) {
			const lastIndex = this.body.length - 1;
			newSegment = this.body[lastIndex].copy();
		}
		this.body.push(newSegment);
	}

	canGo(pos) {
		return !(vectorIsInArray(this.body, pos) || !vectorIsInArray(this.grid.cells, pos))
	}


	// ALGORITHMS ----------------------------------------------------------------

	AlphaSnake() {

		let validMoves = [];

		let bestDist = Infinity;
		let bestDir = null;

		for (let i = -1; i <= 1; i += 1) {
			for (let j = -1; j <= 1; j += 1) {
				if (i != j) {
					let nextPos = p5.Vector.add(this.pos, createVector(scl * i, scl * j));
					if (this.canGo(nextPos) && [i, j].includes(0)) {
						validMoves.push(nextPos);
						let d = DIFFICULTY == 'Easy' ? this.food.pos.dist(nextPos) : Math.abs(nextPos.x - this.food.pos.x) + Math.abs(nextPos.y - this.food.pos.y);
						// let d = Math.abs(nextPos.x - this.food.pos.x) + Math.abs(nextPos.y - this.food.pos.y);
						if (d < bestDist) {
							bestDir = nextPos;
							bestDist = d;
						}
					}
				}
			}
		}

		if (bestDir != null) {
			this.toward(bestDir);
		}

		return null;

	}

	FollowCycleGiven(given) {
		let currIndex = 0;
		for (let i = 0; i < given.length; i++) {
			if (this.pos.equals(given[i])) {
				currIndex = i;
				break;
			}
		}
		let nextIndex = currIndex + 1;
		if (nextIndex >= given.length) nextIndex = 0;
		this.toward(given[nextIndex]);

	}

	FollowCycle() {
		let nextIndex = this.cycle.getIndexOf(this.pos) + 1;
		if (nextIndex >= this.hCycle.length) nextIndex = 0;
		this.toward(this.hCycle[nextIndex]);
	}

	ShortcutHamilton() {
		const node = this.getNextMoveFromShortcut(this.pos);
		this.toward(node);
	}

	getNextMoveFromShortcut(pos) {
		
		pos = pos.copy();
		const x = pos.x; const y = pos.y;

		const pathNumber = this.cycle.getIndexOf(pos);
		const distanceToFood = this.cycle.pathDistance(pathNumber, this.cycle.getIndexOf(this.food.pos));
		let distanceToTail = Infinity;
		if (this.body.length > 0) {
			distanceToTail = this.cycle.pathDistance(pathNumber, this.cycle.getIndexOf(this.body[this.body.length-1]));
		}

		let cuttingAmountAvailable = distanceToTail - this.drawnLength - this.gainFromFood - this.growthLength;
		const emptySquaresOnBoard = this.grid.size() - this.drawnLength - this.growthLength - 1;
		if (this.drawnLength >= this.grid.size() * 0.5 && this.simplify) {
			cuttingAmountAvailable = 0;
		} else if (distanceToFood < distanceToTail) {
			cuttingAmountAvailable -= (this.gainFromFood + this.growthLength);
			if ((distanceToTail - distanceToFood) * 4 > emptySquaresOnBoard) {
				cuttingAmountAvailable -= (this.gainFromFood + this.growthLength);
			}
		}

		const cuttingAmountDesired = distanceToFood;
		if (cuttingAmountDesired < cuttingAmountAvailable) {
			cuttingAmountAvailable = cuttingAmountDesired;
		} if (cuttingAmountAvailable < 0) {
			cuttingAmountAvailable = 0;
		}

		const above = createVector(x, y - this.scl);
		const below = createVector(x, y + this.scl);
		const onleft = createVector(x - this.scl, y);
		const onright = createVector(x + this.scl, y);

		let bestDir = createVector(0, 0);
		let bestDist = -1;

		const goList = [below, onleft, onright, above];
		let validMoves = [];

		for (let node of goList) {
			if (this.canGo(node)) {
				validMoves.push(node);
				const nodeIndex = this.cycle.getIndexOf(node);
				const dist = this.cycle.pathDistance(pathNumber, nodeIndex);
				if (dist <= cuttingAmountAvailable && dist > bestDist) {
					bestDist = dist + 0;
					bestDir = node.copy();
				}
			}
		}

		if (bestDist >= 0) {
			return bestDir
		}

		// Don't know what to do: pick a random move
		console.log("AHHHHHHHHHH " + random(1));
		if (validMoves.length > 0) {
			return random(validMoves);
		}
		return onright;

	}


}
