const bodyNode = document.querySelector('body');
const settingsNode = document.querySelector('.settings');
const sizeNode = document.getElementById('size');
const linesNode = document.getElementById('lines');
const submitNode = document.getElementById('go');
const playgroundNode = document.querySelector('.playground');
const restartNode = document.getElementById('restart');
const mazeNode = document.querySelector('.maze');
const context = mazeNode.getContext('2d');

submitNode.addEventListener('click', () => {
  scroll();
  createMaze();
});

restartNode.addEventListener('click', () => {
  scroll();
});

function createMaze(delay = 1000) {
  const size = transformSizeToPX(sizeNode.value);
  const lines = +linesNode.value;
  maze = new Maze(size, lines);
  maze.setup();
  maze.draw();
  setTimeout(() => {
    maze.createFrame();
  }, delay);
}

function scroll() {
  if (settingsNode.className === 'settings') {
    settingsNode.className = 'settings settings_hidden';
    playgroundNode.className = 'playground';
  } else {
    settingsNode.className = 'settings';
    playgroundNode.className = 'playground playground_hidden';
  }
}

function transformSizeToPX(size) {
  switch (size) {
    case 'small':
      return 100;

    case 'medium':
      return 300;

    case 'big':
      return 500;
  }
}
