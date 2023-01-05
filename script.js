let maze;

class Maze {
  constructor(size, lines) {
    this.size = size;
    this.lines = lines;
    this.cellSize = size / lines;
    this.currentCell = undefined;
    this.grid = [];
    this.stack = [];
  }

  setup() {
    for (let rowNum = 0; rowNum < this.lines; rowNum++) {
      const row = [];
      for (let colNum = 0; colNum < this.lines; colNum++) {
        const cell = new Cell(rowNum, colNum, this.grid, this.cellSize);
        row.push(cell);
      }
      this.grid.push(row);
    }
    this.currentCell = this.grid[0][0];
    this.grid[0][0].character = true;
    this.grid[this.grid.length - 1][this.grid.length - 1].goal = true;

    character = new Character(this.grid);
  }

  removeWalls(cell1, cell2) {
    const x = cell1.col - cell2.col;
    if (x === -1) {
      cell1.walls.right = false;
      cell2.walls.left = false;
    }
    if (x === 1) {
      cell1.walls.left = false;
      cell2.walls.right = false;
    }

    const y = cell1.row - cell2.row;
    if (y === -1) {
      cell1.walls.bottom = false;
      cell2.walls.top = false;
    }
    if (y === 1) {
      cell1.walls.top = false;
      cell2.walls.bottom = false;
    }
  }

  draw() {
    mazeNode.height = this.size;
    mazeNode.width = this.size;
    mazeNode.style.background = 'black';

    for (let r = 0; r < this.lines; r++) {
      for (let c = 0; c < this.lines; c++) {
        this.grid[r][c].draw();
      }
    }
  }

  createFrame() {
    setTimeout(() => {
      this.draw();

      console.log(this.stack);
      this.currentCell.visited = true;

      const nextCell = this.currentCell.nextRandomNeighbour();

      if (nextCell) {
        nextCell.visited = true;
        this.stack.push(this.currentCell);
        this.currentCell.highlight('blue');
        this.removeWalls(this.currentCell, nextCell);
        this.currentCell = nextCell;
      } else if (this.stack.length > 0) {
        const previousCell = this.stack.pop();
        this.currentCell = previousCell;
        this.currentCell.highlight('red');
      } else {
        return;
      }

      window.requestAnimationFrame(() => {
        this.createFrame();
      });
    }, 0);
  }

  refresh() {
    this.draw();
  }
}

class Cell {
  constructor(rowNum, colNum, parentGrid, cellSize) {
    this.row = rowNum;
    this.col = colNum;
    this.parentGrid = parentGrid;
    this.size = cellSize;
    this.visited = false;
    this.character = false;
    this.goal = false;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }

  nextRandomNeighbour() {
    const grid = this.parentGrid;
    const col = this.col;
    const row = this.row;
    const neighbours = [];

    const topNeighbour = row !== 0 ? grid[row - 1][col] : undefined;
    const rightNeighbour = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    const bottomNeighbour = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    const leftNeighbour = col !== 0 ? grid[row][col - 1] : undefined;

    if (topNeighbour && !topNeighbour.visited) neighbours.push(topNeighbour);
    if (rightNeighbour && !rightNeighbour.visited) neighbours.push(rightNeighbour);
    if (bottomNeighbour && !bottomNeighbour.visited) neighbours.push(bottomNeighbour);
    if (leftNeighbour && !leftNeighbour.visited) neighbours.push(leftNeighbour);

    if (neighbours.length > 0) {
      const randomNeighbourIndex = Math.floor(Math.random() * neighbours.length);
      return neighbours[randomNeighbourIndex];
    } else {
      return undefined;
    }
  }

  drawTopWall(x, y) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + this.size, y);
    context.stroke();
  }

  drawRightWall(x, y) {
    context.beginPath();
    context.moveTo(x + this.size, y);
    context.lineTo(x + this.size, y + this.size);
    context.stroke();
  }

  drawBottomWall(x, y) {
    context.beginPath();
    context.moveTo(x, y + this.size);
    context.lineTo(x + this.size, y + this.size);
    context.stroke();
  }

  drawLeftWall(x, y) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + this.size);
    context.stroke();
  }

  draw() {
    const x = this.col * this.size;
    const y = this.row * this.size;

    context.strokeStyle = 'white';
    context.fillStyle = 'black';
    context.lineWidth = 2;

    if (this.walls.top) this.drawTopWall(x, y);
    if (this.walls.right) this.drawRightWall(x, y);
    if (this.walls.bottom) this.drawBottomWall(x, y);
    if (this.walls.left) this.drawLeftWall(x, y);

    if (this.goal) {
      context.fillStyle = 'green';
      context.fillRect(x + 2, y + 2, this.size - 4, this.size - 4);
    }

    if (this.character) {
      context.fillStyle = 'brown';
      context.fillRect(x + 2, y + 2, this.size - 4, this.size - 4);
    }
  }

  highlight(color) {
    const x = this.col * this.size;
    const y = this.row * this.size;

    context.fillStyle = color;
    context.fillRect(x + 3, y + 3, this.size - 6, this.size - 6);
  }
}
