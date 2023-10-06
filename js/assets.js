function colliding( {obj1,obj2}) {
    return (
    obj1.position.y + obj1.height + obj1.velocity.y >= obj2.position.y &&
    obj1.position.y <= obj2.position.y + obj2.height &&
    obj1.position.x <= obj2.position.x + obj2.width &&
    obj1.position.x + obj1.width >= obj2.position.x
    )
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
const Console = document.getElementById('console');
const consoleBox = document.querySelector('.console-box');

var interactionsLeftrow = 0;
var interactionsRightrow = 0;
var totalInteractions = 0;
var inc = 1;

function toggleConsole() {
    if (consoleBox.style.display == 'none'){
    consoleBox.style.display = 'block';
    }else{
    consoleBox.style.display = 'none';}
}
// console display
function consoleText(text) {
  Console.innerHTML += inc+'. '+text+'<br>';
  inc++;
}

function consoleOutput() {
    totalInteractions = interactionsRightrow + interactionsLeftrow;
    document.getElementById('x').innerHTML = 'Button Interactions:<br>'+
    'interactions: ' + totalInteractions+'<br>'+
    'interactions in left row: ' + interactionsLeftrow+'<br>'+
    'interactions in right row: ' + interactionsRightrow+'<br>'+
    'Player info:<br>'+
    'Player Xvel: '+Math.round(player.velocity.x)+'<br>'+
    'Player Yvel: '+Math.round(player.velocity.y)+'<br>'+
    'Player Xpos: '+Math.round(player.position.x)+'<br>'+
    'Player Ypos: '+Math.round(player.position.y)+'<br>'+
    'Player pan left: '+pan.left+'<br>'+
    'Player pan right: '+pan.right+'<br>'
}

// console commands panel
let consoleInput = document.getElementById('consoleInput');
consoleInput.onkeydown = function(e) {
  if (e.key == 'Enter') {
    let input = consoleInput.value;
    consoleDisplay(input);
    consoleInput.value = '';
  }
}
const consoleDisplay = (input) => {
  consoleInput.value = '';
  try {
    new Function(input)();
  } catch (e) {
    Console.innerHTML += e.message+'<br>';
  }
  finally {
    new Function(input)();
  }
};

function stopInteractingLeftRow() {
  leaveInteractionInRightRow()
}

function leaveInteractionInLeftRow() {
  interactionsLeftrow -= 1;
  totalInteractions = interactionsRightrow + interactionsLeftrow;
  
  if (totalInteractions < 1) {
      consoleText('no button interactions');
  }
  
  if (interactionsLeftrow < 0) {
      interactionsLeftrow = 0;
  }

  if (interactionsLeftrow > 1) {
      interactionsLeftrow = 1;
  }
  if (interactionsLeftrow > 2) {
      interactionsLeftrow = 0;
  }
}
function leaveInteractionInRightRow() {
  interactionsRightrow -= 1;
  totalInteractions = interactionsRightrow + interactionsLeftrow;
  
  if (totalInteractions < 1) {
      consoleText('no button interactions');
  }
  
  if (interactionsRightrow < 0) {
    interactionsRightrow = 0;
  }

  if (interactionsRightrow > 2) {
    interactionsRightrow = 2;
  }
  if (interactionsRightrow > 3) {
    interactionsRightrow = 0;
  }
}

const keys = {
  d: {
      pressed: false,
  },
  a: {
      pressed: false,
  },
  e: {
    pressed: false,
},
}

function spawnObstacles() {
  const randomColor = Math.floor(Math.random()*50).toString(16);
  const color = "#" + randomColor;
  obstacles.push(new Item({
    position: {
      x: rand(0,2000),
      y: rand(-500,-500),
    },
    width: rand(10,150),
    height: rand(10,150),
    color: color,
    collisions: [plane],
  }));
}

function spawn() {
  for (let i = 0; i < 20; i++) {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    let color = "#" + randomColor;
    items.push(new Item({
      position: {
        x: rand(0,2000),
        y: rand(-200,-500),
      },
      width: rand(5,20),
      height: rand(5,20),
      color: color,
      collisions: [obstacles,plane],
    }));
  }
}