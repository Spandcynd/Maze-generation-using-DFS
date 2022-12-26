const mazeNode = document.querySelector('.maze')
const context = mazeNode.getContext('2d')

let currentCell

class Maze {
  constructor(height, width, rows, columns) {
    this.height = height
    this.width = width
    this.rows = rows
    this.columns = columns
    this.colWidth = width / columns
    this.rowHeight = height / rows
    this.grid = []
    this.stack = []
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      const row = []
      for (let c = 0; c < this.columns; c++) {
        const cell = new Cell(r, c, this.grid, this.colWidth, this.rowHeight)
        row.push(cell)
      }
      this.grid.push(row)
    }
    currentCell = this.grid[0][0]
  }

  draw() {
    mazeNode.height = this.height
    mazeNode.width = this.width
    mazeNode.style.background = 'black'
    currentCell.visited = true

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.grid[r][c].show(this.size, this.columns, this.rows)
      }
    }

    const nextCell = currentCell.nextRandomNeighbour(this.columns, this.rows)

    if (nextCell) {
      nextCell.visited = true

      this.stack.push(currentCell)

      currentCell.highlight()

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
  constructor(rowNum, colNum, parentGrid, colWidth, rowHeight) {
    this.rowNum = rowNum
    this.colNum = colNum
    this.parentGrid = parentGrid
    this.width = colWidth
    this.height = rowHeight
    this.visited = false
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true
    }
  }

  nextRandomNeighbour(columns, rows) {
    const grid = this.parentGrid
    const col = this.colNum
    const row = this.rowNum
    const neighbours = []

    const topNeighbour = row !== 0 ? grid[row - 1][col] : undefined
    const rightNeighbour = col !== columns - 1 ? grid[row][col + 1] : undefined
    const bottomNeighbour = row !== rows - 1 ? grid[row + 1][col] : undefined
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

  drawTopWall(x, y) {
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + this.width, y)
    context.stroke()
  }

  drawRightWall(x, y) {
    context.beginPath()
    context.moveTo(x + this.width, y)
    context.lineTo(x + this.width, y + this.height)
    context.stroke()
  }

  drawBottomWall(x, y) {
    context.beginPath()
    context.moveTo(x, y + this.height)
    context.lineTo(x + this.width, y + this.height)
    context.stroke()
  }

  drawLeftWall(x, y) {
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x, y + this.height)
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

  show() {
    const x = this.colNum * this.width
    const y = this.rowNum * this.height
    
    context.strokeStyle = 'white'
    context.fillStyle = 'black'
    context.lineWidth = 2

    if (this.walls.topWall) this.drawTopWall(x, y)
    if (this.walls.rightWall) this.drawRightWall(x, y)
    if (this.walls.bottomWall) this.drawBottomWall(x, y)
    if (this.walls.leftWall) this.drawLeftWall(x, y)
    if (this.visited) {
      context.fillRect(x + 1, y + 1, this.width - 2, this.height - 2)
    }
  }

  highlight() {
    const x = this.colNum * this.width + 1
    const y = this.rowNum * this.height + 1

    context.fillStyle = 'purple'
    context.fillRect(x + 2, y + 2, this.width - 4, this.height - 4)
  }
}

const maze = new Maze(400, 1000, 10, 25)
maze.setup()
maze.draw()
