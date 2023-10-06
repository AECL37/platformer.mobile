const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

let gravity = .8;

canvas.width = 547.5;
canvas.height = 250.5;

let pan = {
  left: false,
  right: false,
}

// Player controls
function playerStopXAxis() {
    player.velocity.x = 0;
    leaveInteractionInLeftRow()
    pan.left = false;
    pan.right = false;
}

function playerMoveLeft() {
    player.velocity.x = -3;
    pan.right = true;
    pan.left = false;
    
    //end
    interactionsLeftrow += 1;
    consoleText('playerMoveLeft');
}

function playerMoveRight() {
    player.velocity.x = 3;
    pan.right = false;
    pan.left = true;
    
    //end
    interactionsLeftrow += 1;
    consoleText('playerMoveRight');
    
}

function playerAttack() {
    
    //end
    interactionsRightrow += 1;
    consoleText('playerAttack');
}

function playerJump() {
  player.velocity.y = -15;
  
  //end
  interactionsRightrow += 1;
  consoleText('playerJump');
}

function playerInteract() {
  player.interact();

  //end
  interactionsRightrow += 1;
  consoleText('playerInteract');
}
// END player
let obstacles = [];

let items = [];

let plane = new Item({
  position: {
    x: 0,
    y: 200,
  },
  width: 2000,
  height: 100,
  color: 'blue',
});

let player = new Player({
    position: {
      x: 125,
      y: 100,
    },
    collisions: [obstacles,plane],
  });

var i = 0;               
function myLoop() {      
  setTimeout(function() {
    i++;                 
    if (i < 100) {   
      spawnObstacles();     
      myLoop();          
    }                    
  }, 25)
}
myLoop();   

for (let i = 0; i < 20; i++) {
  spawn();
}

setInterval(spawn, 5000);

let camera = {
  position: {
    x: 0,
    y: 0,
  }
}

// animate canvas and DOM
function frame() {
    window.requestAnimationFrame(frame);
    c.fillStyle = 'white';
    c.fillRect(0,0, canvas.width, canvas.height);

    c.save();
    c.translate(camera.position.x, -player.position.y + 50);

    plane.update();
    plane.fix();
    items.forEach(item => {
      item.update();
    })
    obstacles.forEach(item => {
      item.update();
    })
    player.canvaCollisions();
    player.update();
    plane.fix();

    if (keys.d.pressed) {
        player.velocity.x = 3;
        pan.right = false;
        pan.left = true;
    }
    else if (keys.a.pressed) { 
        player.velocity.x = -3;
        pan.right = true;
        pan.left = false;
    }
    else if (keys.e.pressed) { 
        player.interact();
    }

    if (player.velocity.y < 0) {
      player.shouldPanCameraDown({camera, canvas});
    }
    else if (player.velocity.y > 0) {
      player.shouldPanCameraUp({camera, canvas});
    }
    
    if (pan.right) {
      player.shouldPanCameraToTheRight({canvas, camera});
    }
    else if (pan.left) {
      player.shouldPanCameraToTheLeft({canvas, camera});
    }
    c.restore();

    //end
    consoleOutput();
}
//END

frame();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = true;
            break;

        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = true;
            break;

        case 'w':
        case 'ArrowUp':
            player.velocity.y = -15;
            break;
        case 'e':
        case "'":
            player.interact();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = false;
            player.velocity.x = 0;
            pan.left = false;
            break;

        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = false;
            player.velocity.x = 0;
            pan.right = false;
            break;
        case 'e':
        case "'":
            keys.e.pressed = false;
            break;
    }
});