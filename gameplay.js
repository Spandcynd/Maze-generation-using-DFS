let character;

class Character {
  constructor(parentGrid) {
    this.row = 0;
    this.col = 0;
    this.parentGrid = parentGrid;
  }

  move(direction) {
    const currentCell = this.parentGrid[this.row][this.col];

    switch (direction) {
      case 'KeyW':
        if (this.row !== 0 && !currentCell.walls.top) {
          currentCell.character = false;
          this.parentGrid[this.row - 1][this.col].character = true;
          this.row -= 1;
        }
        break;

      case 'KeyD':
        if (this.col !== this.parentGrid.length - 1 && !currentCell.walls.right) {
          currentCell.character = false;
          this.parentGrid[this.row][this.col + 1].character = true;
          this.col += 1;
        }
        break;

      case 'KeyS':
        if (this.row !== this.parentGrid.length - 1 && !currentCell.walls.bottom) {
          currentCell.character = false;
          this.parentGrid[this.row + 1][this.col].character = true;
          this.row += 1;
        }
        break;

      case 'KeyA':
        if (this.col !== 0 && !currentCell.walls.left) {
          currentCell.character = false;
          this.parentGrid[this.row][this.col - 1].character = true;
          this.col -= 1;
        }
        break;
    }
  }
}

document.addEventListener('keydown', (event) => {
  console.log(event.code);
  character.move(event.code);
  maze.refresh();
  if (character.parentGrid[character.row][character.col].goal) {
    setTimeout(() => {
      alert('You win!');
    }, 100);
    setTimeout(() => {
      scroll();
    }, 1000);
  }
});
