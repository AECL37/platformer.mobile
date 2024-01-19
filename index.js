const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

let gravity = .8;

canvas.width = 547.5;
canvas.height = 250.5;

let pan = {
  left: false,
  right: false,
}

let attackWidth = 25;
let attackHeight = 70;
let attackOffset = 0;

// Player controls
function playerStopXAxis() {
    player.velocity.x = 0;
    keys.d.pressed = false;
    keys.a.pressed = false;
    leaveInteractionInLeftRow()
    pan.left = false;
    pan.right = false;
}

function playerMoveLeft() {
    keys.a.pressed = true;
    player.direction = -player.attackHitbox.width;
    attackOffset = 0;
    pan.right = true;
    pan.left = false;
    
    //end
    interactionsLeftrow += 1;
    consoleText('playerMoveLeft');
}

function playerMoveRight() {
    keys.d.pressed = true;
    player.direction = 45;
    attackOffset = 0;
    pan.right = false;
    pan.left = true;
    
    //end
    interactionsLeftrow += 1;
    consoleText('playerMoveRight');
    
}

function playerAttack() {
    keys.space.pressed = true;
    
    //end
    interactionsRightrow += 1;
    consoleText('playerAttack');
}

function playerJump() {
  attackOffset = -20;
  player.direction = 10;
  if (player.jumps >= 1) {
    player.velocity.y = -15;
  }
  player.jumps -= 1;
  
  //end
  interactionsRightrow += 1;
  consoleText('playerJump');
}

function placeBlock() {
  let x;
  let y;
  if (player.direction > 0) {
    x = player.position.x + player.width;
  }
  if (player.direction == 10) {
    x = player.position.x + -26.5;
  }
  if (player.direction < 0) {
    x = player.position.x - 100;
  }
  if (attackOffset >= 0) {
    y = player.position.y + player.height;
  }
  if (attackOffset < 0) {
    y = player.position.y - 100;
  }
  spawnBlock(x,y);
}

function playerDown() {
  attackOffset = 20;
  player.direction = 10;

    //end
    interactionsRightrow += 1;
    consoleText('playerDown');
}

function playerShoot() {
  player.shootProjectile();

  //end
  interactionsRightrow += 1;
  consoleText('playerShoot');
}

function playerInteract() {
  keys.e.pressed = true;

  //end
  interactionsRightrow += 1;
  consoleText('playerInteract');
}
// END player

let obstacles = [];
let platforms = [];
let projectiles = [];
let hearts = [];
let items = [];
var time = 900;
let plane;
let player;
let camera = {
  position: {
    x: 0,
    y: 0,
  }
}

function startGame() {
  c.setTransform(1, 0, 0, 1, 0, 0);
  playTime = 0;
  healsTaken = 0;
  damageTaken = 0;
  totalkeypress = 0;
  totalElevations = 0;
  obstaclesDestroyed = 0;
  totalKeysPressed = 0;
  rectsSpended = 0;
  rectsCollected = 0;
  highestElevation = 0;
  totalJumps = 0;
  goalHeight = -100;
  c.globalAlpha = 1;
  shortestTime = playerStats.shortestTimeToWin;
  time = 900;
  gameover.style.display = 'none';
  win.style.display = 'none';
  records.style.display = 'none';
  textWarning.style.display = 'block';
  setInterval(function(){
    document.getElementById('estimatedTime').innerHTML = 'Estimated Time: ' + Math.round(time/100/.2) + ' seconds';
  }, 1000)
  obstacles = [];
  platforms = [];
  projectiles = [];
  hearts = [];
  items = [];

  plane = new Item({
    position: {
      x: 0,
      y: 200,
    },
    width: 2000,
    height: 500,
    color: 'blue',
    collisions: [],
  });

  player = new Player({
      position: {
        x: 24,
        y: 100,
      },
      collisions: [obstacles,plane,platforms],
  });

  let randomColor = Math.floor(Math.random()*50).toString(16);
  let color = "#" + randomColor;
  obstacles.push(new Item({
    position: {
      x: 69.1,
      y: 100,
    },
    width: 24,
    height: 120,
    color: color,
    collisions: [plane, player, items, hearts,platforms],
  }));

  randomColor = Math.floor(Math.random()*50).toString(16);
  color = "#" + randomColor;
  obstacles.push(new Item({
    position: {
      x: -0.9,
      y: 100,
    },
    width: 24,
    height: 120,
    color: color,
    collisions: [plane, player, items, hearts,platforms],
  }));

  randomColor = Math.floor(Math.random()*50).toString(16);
  color = "#" + randomColor;
  obstacles.push(new Item({
    position: {
      x: 0,
      y: -20050,
    },
    width: 69.1,
    height: 202.7996080289,
    color: color,
    collisions: [plane, player, items, hearts,platforms],
  }));

  var i = 0;               
  function myLoop() {      
    setTimeout(function() {
      i++;                 
      if (i < 251) {   
        spawnObstacles();     
        myLoop();         
        time -= 1; 
      }                
      else {
        textWarning.style.display = 'none';
      }    
    })
  }
  myLoop();   

  for (let i = 0; i < 150; i++) {
    spawn();
  }

  camera = {
    position: {
      x: 0,
      y: 0,
    }
  }
  frame();
}

// animate canvas and DOM
function frame() {
    if (player.health > 0 && player.position.y >= goalHeight) {
      setTimeout(tick, 1000);
      checkHighestElevation(player.position.y);
      applyToRecords();
      window.requestAnimationFrame(frame);
      c.fillStyle = 'white';
      c.fillRect(0,0, canvas.width+232, canvas.height+232);

      c.save();
      c.scale(.75,.75)
      c.translate(camera.position.x, -player.position.y + 230);

      plane.fix();
      items.forEach(item => {
        item.update();
      })
      detectCollisions();
      obstacles.forEach(item => {
        item.update();
      })
      platforms.forEach(item => {
        item.fix();
      })
      hearts.forEach(item => {
        item.update();
      })
      projectiles.forEach(item => {
        item.update();
      })
      for (let i = 0; i < projectiles.length; i++) {
        if (projectiles[i].threshold <= 0) {
          projectiles.splice(i , 1);
        }
      }

      detectCollisions();
      checkHighestPoint();
      player.canvaCollisions();
      player.update();
      plane.fix();

      if (hearts.length) {
        c.beginPath();
        let start = player.position;
        for (let i = 0; i < hearts.length; i++) {
          let target = hearts[i].position;
          let distance = Math.round(dist(start.x, Math.abs(start.y), target.x, Math.abs(target.y))+130)/100+'m';
          c.moveTo(start.x, start.y);
          c.lineTo(target.x, target.y)
          drawLabel(c, distance, start, target, 'left', 25);
        }
        c.stroke();
      }

      if (highestPoint) {
        c.beginPath();
        let start = player.position;
        let target = highestPoint.position;
        let distance = Math.round(dist(start.x, Math.abs(start.y), target.x, Math.abs(target.y))+130)/100+'m';
        c.moveTo(start.x, start.y);
        c.lineTo(target.x, target.y)
        drawLabel(c, distance, start, target, 'left', 25);
        c.stroke();
      }

      if (keys.d.pressed) {
          player.velocity.x = 3;
          player.direction = 45;
          attackOffset = 0;
          pan.right = false;
          pan.left = true;
      }
      else if (keys.a.pressed) { 
          player.velocity.x = -3;
          player.direction = -player.attackHitbox.width;
          attackOffset = 0;
          pan.right = true;
          pan.left = false;
      }
      else if (keys.s.pressed) {
        player.direction = 10;
        attackOffset = 20;
      }
      c.restore();
    if (keys.e.pressed) { 
          player.interact();
      }
      else if (keys.space.pressed) {
        player.attack();
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
    }
    else if (player.position.y <= goalHeight) {
      winner();
      console.log('working as hell');
      c.clearRect(0,0, canvas.width, canvas.height);
    }
    else if (player.health <= 0) {
      lose();
      c.clearRect(0,0, canvas.width, canvas.height);
    }
    
    c.setTransform(1, 0, 0, 1, 0, 0);
    //end
    consoleOutput();
    playerInfo();
}
//END

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
          if (player.jumps >= 1) {
              player.velocity.y = -15;
              totalJumps++;
              playerStats.totalJumps++;
            }
            player.jumps -= 1;
            player.direction = 10;
            attackOffset = -20;
            break;
        case 'e':
        case "'":
            keys.e.pressed = true;
            break;
        case ' ':
        case "/":
          keys.space.pressed = true;
            break;
        case 's':
        case "ArrowDown":
          keys.s.pressed = true;
            break;
        case 'f':
        case ";":
          placeBlock();
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
        case ' ':
        case "/":
          keys.space.pressed = false;
            break;
        case 's':
        case "ArrowDown":
          keys.s.pressed = false;
            break;
        case 'q':
        case "Enter":
          player.shootProjectile();
            break;
    }
});

window.addEventListener('keyup', (event) => {
  playerStats.randomFacts.keys.totalKeys++;
  totalKeysPressed++;
  switch (event.key) {
    case 'w':
      playerStats.randomFacts.keys.w += 1;
    case 'd':
      playerStats.randomFacts.keys.d += 1;
      break;
    case 'a':
      playerStats.randomFacts.keys.a += 1;
      break;
    case 'e':
      playerStats.randomFacts.keys.e += 1;
      break;
    case ' ':
      playerStats.randomFacts.keys.space += 1;
      break;
    case 's':
      playerStats.randomFacts.keys.s += 1;
      break;
    case 'q':
      playerStats.randomFacts.keys.q += 1;
      break;
    case 'f':
      playerStats.randomFacts.keys.f += 1;
      break;
    case 'ArrowRight':
      playerStats.randomFacts.keys.ArrowRight += 1;
      break;
    case 'ArrowLeft':
      playerStats.randomFacts.keys.ArrowLeft += 1;
      break;
    case "'":
      playerStats.randomFacts.keys.apostrophe += 1;
      break;
    case '/':
      playerStats.randomFacts.keys.ForwardSlash += 1;
      break;
    case 'ArrowDown':
      playerStats.randomFacts.keys.ArrowDown += 1;
      break;
    case ';':
      playerStats.randomFacts.keys.semicolon += 1;
      break;
    case 'Enter':
      playerStats.randomFacts.keys.enter += 1;
      break;
    default:
      playerStats.randomFacts.keys.otherKeys += 1;
  }
})
