const mazeNode = document.querySelector('.maze')
const context = mazeNode.getContext('2d')

let currentCell

class Maze {
  constructor(size, rows, columns) {
    this.size = size
    this.rows = rows
    this.columns = columns
    this.grid = []
    this.stack = []
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      const row = []
      for (let c = 0; c < this.columns; c++) {
        const cell = new Cell(r, c, this.grid, this.size)
        row.push(cell)
      }
      this.grid.push(row)
    }
    currentCell = this.grid[0][0]
  }

  draw() {
    mazeNode.height = this.size
    mazeNode.width = this.size
    mazeNode.style.background = 'black'
    currentCell.visited = true

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.grid[r][c].show(this.size, this.columns, this.rows)
      }
    }

    const nextCell = currentCell.nextRandomNeighbour()

    if (nextCell) {
      nextCell.visited = true

      this.stack.push(currentCell)

      currentCell.highlight(this.columns, this.rows)

      currentCell.removeWalls(currentCell, nextCell)

      currentCell = nextCell

    } else if (this.stack.length > 0) {
      const previousCell = this.stack.pop()
      currentCell = previousCell
      currentCell.highlight(this.columns, this.rows)
    }
    
    if (this.stack.length === 0) {
      return
    }

    window.requestAnimationFrame(() => {
      this.draw()
    })
  }
}


class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum
    this.colNum = colNum
    this.parentGrid = parentGrid
    this.parentSize = parentSize
    this.visited = false
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true
    }
  }

  nextRandomNeighbour() {
    const grid = this.parentGrid
    const col = this.colNum
    const row = this.rowNum
    const neighbours = []

    const topNeighbour = row !== 0 ? grid[row - 1][col] : undefined
    const rightNeighbour = col !== grid.length - 1 ? grid[row][col + 1] : undefined
    const bottomNeighbour = row !== grid.length - 1 ? grid[row + 1][col] : undefined
    const leftNeighbour = col !== 0 ? grid[row][col - 1] : undefined

    if (topNeighbour && !topNeighbour.visited) neighbours.push(topNeighbour)
    if (rightNeighbour && !rightNeighbour.visited) neighbours.push(rightNeighbour)
    if (bottomNeighbour && !bottomNeighbour.visited) neighbours.push(bottomNeighbour)
    if (leftNeighbour && !leftNeighbour.visited) neighbours.push(leftNeighbour)
    
    if (neighbours.length > 0) {
      const randomNeighbourIndex = Math.floor(Math.random() * neighbours.length)
      return neighbours[randomNeighbourIndex]
    } else {
      return undefined
    }
  }

  drawTopWall(x, y, size, columns) {
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + size / columns, y)
    context.stroke()
  }

  drawRightWall(x, y, size, columns, rows) {
    context.beginPath()
    context.moveTo(x + size / columns, y)
    context.lineTo(x + size / columns, y + size / rows)
    context.stroke()
  }

  drawBottomWall(x, y, size, columns, rows) {
    context.beginPath()
    context.moveTo(x, y + size / rows)
    context.lineTo(x + size / columns, y + size / rows)
    context.stroke()
  }

  drawLeftWall(x, y, size, rows) {
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x, y + size / rows)
    context.stroke()
  }

  removeWalls(cell1, cell2) {
    const x = cell1.colNum - cell2.colNum
    if (x === -1) {
      cell1.walls.rightWall = false
      cell2.walls.leftWall = false
    }
    if (x === 1) {
      cell1.walls.leftWall = false
      cell2.walls.rightWall = false
    }

    const y = cell1.rowNum - cell2.rowNum
    if (y === -1) {
      cell1.walls.bottomWall = false
      cell2.walls.topWall = false
    }
    if (y === 1) {
      cell1.walls.topWall = false
      cell2.walls.bottomWall = false
    }
  }

  show(size, columns, rows) {
    const x = this.colNum * size / columns
    const y = this.rowNum * size / rows
    
    context.strokeStyle = 'white'
    context.fillStyle = 'black'
    context.lineWidth = 2

    if (this.walls.topWall) this.drawTopWall(x, y, size, columns)
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows)
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows)
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, rows)
    if (this.visited) {
      context.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2)
    }
  }

  highlight(columns, rows) {
    const x = this.colNum * this.parentSize / columns + 1
    const y = this.rowNum * this.parentSize / rows + 1

    context.fillStyle = 'purple'
    context.fillRect(x + 2, y + 2, this.parentSize / columns - 4, this.parentSize / rows - 4)
  }
}

// Uncomment only one maze
const maze = new Maze(500, 5, 5)
// const maze = new Maze(500, 10, 10)
// const maze = new Maze(500, 20, 20)

maze.setup()
maze.draw()
