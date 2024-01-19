function colliding( {obj1,obj2}) {
    return (
    obj1.position.y + obj1.height >= obj2.position.y &&
    obj1.position.y <= obj2.position.y + obj2.height &&
    obj1.position.x <= obj2.position.x + obj2.width &&
    obj1.position.x + obj1.width >= obj2.position.x
    )
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
}

var healthDifference,
    rectsDifference,
    highestElevation,
    totalElevations,
    totalkeypress,
    playTime,
    damageTaken,
    healsTaken,
    totalJumps,
    rectsCollected,
    rectsSpended,
    obstaclesDestroyed,
    totalKeysPressed,
    shortestTime,
    goalHeight;

let gameover =  document.getElementById('gameover'),
    win =   document.getElementById('win'),
    records = document.getElementById('records');

const playtime = document.getElementById('playtime'),
      deathbyobstacles = document.getElementById('deathbyobstacles'),
      deathbyfalling = document.getElementById('deathbyfalling'),
      totaldeaths = document.getElementById('totaldeaths'),
      totalwins = document.getElementById('totalwins'),
      totalheights = document.getElementById('totalheights'),
      totalelevations = document.getElementById('totalelevations'),
      obstaclesdetroyed = document.getElementById('obstaclesdetroyed'),
      rectscollected = document.getElementById('rectscollected'),
      rectsspend = document.getElementById('rectsspend'),
      damagetaken = document.getElementById('damagetaken'),
      healstaken = document.getElementById('healstaken'),
      totaljumps = document.getElementById('totaljumps'),
      totalkeyspressed = document.getElementById('totalkeyspressed');

const record_playtime = document.getElementById('record-playtime'),
      record_deathbyobstacles = document.getElementById('record-deathbyobstacles'),
      record_deathbyfalling = document.getElementById('record-deathbyfalling'),
      record_totaldeaths = document.getElementById('record-totaldeaths'),
      record_shotestTimeToFinish = document.getElementById('record-shortesttimetofinish'),
      record_totalwins = document.getElementById('record-totalwins'),
      record_totalheights = document.getElementById('record-totalheights'),
      record_totalelevations = document.getElementById('record-totalelevations'),
      record_obstaclesdetroyed = document.getElementById('record-obstaclesdetroyed'),
      record_rectscollected = document.getElementById('record-rectscollected'),
      record_rectsspend = document.getElementById('record-rectsspend'),
      record_damagetaken = document.getElementById('record-damagetaken'),
      record_healstaken = document.getElementById('record-healstaken'),
      record_totaljumps = document.getElementById('record-totaljumps'),
      record_totalkeyspressed = document.getElementById('record-totalkeyspressed'),
      record_highestElevation = document.getElementById('highestpeak');

const Console = document.getElementById('console');
const consoleBox = document.querySelector('.console-box');
const textWarning = document.getElementById('warning');

function playerInfo() {
  let adjustHealthBarContent;
  if (player.health < 100 && player.health >= 10) {
    adjustHealthBarContent = '&nbsp;&nbsp;';
  }
  else if (player.health < 10) {
    adjustHealthBarContent = '&nbsp;';
  }
  else {
    adjustHealthBarContent = '';
  }
  document.getElementById('height').innerHTML = (130-Math.round(goalHeight))/100+'m / ' + (130-Math.round(player.position.y))/100+'m ';
  if (player.health <= 0) {
    document.getElementById('cur-health').innerHTML = adjustHealthBarContent + '0' + ' / ' + '100'
  }
  else {
    document.getElementById('cur-health').innerHTML = adjustHealthBarContent + Math.round(player.health) + ' / ' + '100'

  }
  document.getElementById('health').value = player.health;
  document.getElementById('rects').innerHTML = Math.round(player.rects);            
}


var interactionsLeftrow = 0;
var interactionsRightrow = 0;
var totalInteractions = 0;
var inc = 1;

function toggleConsole() {
    if (consoleBox.style.display == 'block'){
    consoleBox.style.display = 'none';
    }else{
    consoleBox.style.display = 'block';}
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
  if (input == 'pos') {
    player.position.y -= 5000;
    player.velocity.y = 0;
    Console.innerHTML += 'Function executed'+'<br>';

  }
  else if (input == 'spawn hearts') {
    spawnHeart(player.position.x, player.position.y, 200);
    Console.innerHTML += 'Function executed'+'<br>';
  }
  else if (input == 'spawn rects') {
    let pos = player.position;
    spawnLoot(pos.x,pos.y,25,25);
    Console.innerHTML += 'Function executed'+'<br>';
  }
  else if (input == 'killself') { 
    var i = 0;               
    function myLoop() {      
      setTimeout(function() {
        i++;                 
        if (i < 4) {   
          player.health -= 33.33333333333333333;  
          myLoop();          
        }                 
      },100)
    }
    myLoop(); 
    Console.innerHTML += 'Function executed'+'<br>';
  }
  else {
    Console.innerHTML += input+' is not a function'+'<br>';
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
  keys.space.pressed = false;
  keys.e.pressed = false;

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
  space: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  f: {
    pressed: false,
  },
}

function spawnObstacles() {
  let randomColor = Math.floor(Math.random()*50).toString(16);
  let color = "#" + randomColor;
  let decider = rand(1,2);
  let height;
  if (decider == 2) {
    height = rand(300,350);
  }
  if (decider == 1) {
    height = rand(15,100);
  }
  obstacles.push(new Item({
    position: {
      x: rand(100,2000),
      y: rand(-17000,0),
    },
    width: rand(15,400),
    height: height,
    color: color,
    collisions: [plane, player, platforms, items, hearts],
  }));
}

function spawnBlock(x,y) {
  if (player.rects >= 15) {
    player.rects -= 15;
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    let color = "#" + randomColor;
    platforms.push(new Item({
      position: {
        x: x,
        y: y,
      },
      width: 45,
      height: 45,
      color: color,
      collisions: [player],
    }));
  }
}


function spawn() {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    let color = "#" + randomColor;
    items.push(new Item({
      position: {
        x: rand(0,2000),
        y: rand(-20000,-1700),
      },
      width: rand(10,20),
      height: rand(10,20),
      color: color,
      collisions: [obstacles, plane, platforms, hearts],
    }));
}

function spawnLoot(x,y,w,h) {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    let color = "#" + randomColor;
    items.push(new Item({
      position: {
        x: x,
        y: y,
      },
      width: w,
      height: h,
      color: color,
      collisions: [obstacles, plane, platforms, hearts],
    }));

}

function spawnHeart(x,y,value) {
  hearts.push(new Item({
    position: {
      x: x+rand(-5,5),
      y: y+rand(-2.5,2.5),
    },
    width: 25,
    height: 25,
    color: 'red',
    collisions: [obstacles, plane, platforms],
    health: value,
  }));
}

function detectCollisions(){
  let obj1;
  let obj2;

  // Start checking for collisions
  for (let i = 0; i < obstacles.length; i++)
  {
      obj1 = obstacles[i];

      if (
        colliding({
          obj1: obj1,
          obj2: player.attackHitbox
        })
      ) {
        
      }
      for (let j = i + 1; j < obstacles.length; j++)
      {
          obj2 = obstacles[j];
          // Compare object1 with object2
          if (
            colliding({
              obj1: obj1,
              obj2: obj2,
            })
          ) {
              if (obj1.velocity.y > 0) {
                obj1.velocity.y = 0;

                const offset = obj1.height;

                obj1.position.y = obj2.position.y - offset - 0.01;
                break;
            }
            if (obj1.velocity.y < 0) {
              obj1.velocity.y = 0;

                const offset = obj1.position.y;

                obj1.position.y = obj2.position.y + obj2.height - offset + 0.01;
                break;
            }
          }
      }
  }

    // Start checking for collisions
    for (let i = 0; i < items.length; i++)
    {
        obj1 = items[i];
        for (let j = i + 1; j < items.length; j++)
        {
            obj2 = items[j];
            // Compare object1 with object2
            if (
              colliding({
                obj1: obj1,
                obj2: obj2,
              })
            ) {
                if (obj1.velocity.y > 0) {
                  obj1.velocity.y = 0;
  
                  const offset = obj1.height;
  
                  obj1.position.y = obj2.position.y - offset - 0.01;
                  break;
              }
              if (obj1.velocity.y < 0) {
                obj1.velocity.y = 0;
  
                  const offset = obj1.position.y;
  
                  obj1.position.y = obj2.position.y + obj2.height - offset + 0.01;
                  break;
              }
            }
        }
    }
}

function shakeCam()  {
  var i = 0;     
  function set() {      
    c.save();
    setTimeout(function() {
      i++;                 
      if (i < healthDifference+1) {
        c.globalAlpha -= 0.01;
        let x = rand(-healthDifference/10-1,healthDifference/10+1);
        let y = rand(-healthDifference/10-1,healthDifference/10+1);
        c.translate(x,y); 
        set();  
      }             
      else {
        fixBlurEffect(healthDifference);
      }       
    }, 1)
    c.restore(); 
  }
  set();        
}

function fixBlurEffect(val) {
  var i = 0;
  function seoht() {      
    c.save();
    setTimeout(function() {
      i++;                 
      if (i < val + 1) {
        c.globalAlpha += 0.01;
        seoht();  
      }                  
    }, 200 + 100 - player.health)
    c.restore(); 
  }
  seoht();  
}

function lose() { 
  applyToPlayRecords()
  saveStats();
  gameover.style.display = 'block';
  records.style.display = 'block';
}

function winner() {
  applyToPlayRecords()
  saveStats();
  checkShortestTimeToFinish(playTime);
  win.style.display = 'block';
  records.style.display = 'block';
  playerStats.wins++;
}

function healEffect() {
    let el = document.getElementById('healingEffect');
    el.classList.add('healingEffect');
    const node = el;
    const clone = node.cloneNode(true);
    clone.innerHTML += Math.ceil(healthDifference);
    document.body.appendChild(clone);
    clone.addEventListener("animationend", () => {
        clone.remove()
    });   
}

function damageEffect() {
  let el = document.getElementById('damageEffect');
  el.classList.add('damageEffect');
  const node = el;
  const clone = node.cloneNode(true);
  clone.innerHTML += Math.ceil(healthDifference);
  document.body.appendChild(clone);
  clone.addEventListener("animationend", () => {
      clone.remove()
  });
}

function addEffect() {
  let el = document.getElementById('addEffect');
  el.classList.add('addEffect');
  const node = el;
  const clone = node.cloneNode(true);
  clone.innerHTML += Math.round(rectsDifference);
  document.body.appendChild(clone);
  clone.addEventListener("animationend", () => {
      clone.remove()
  });
}

function minusEffect() {
  let el = document.getElementById('minusEffect');
  el.classList.add('minusEffect');
  const node = el;
  const clone = node.cloneNode(true);
  clone.innerHTML += Math.round(rectsDifference);
  document.body.appendChild(clone);
  clone.addEventListener("animationend", () => {
      clone.remove()
  });
}

function drawLabel( ctx, text, p1, p2, alignment, padding ){
  if (!alignment) alignment = 'center';
  if (!padding) padding = 0;

  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;   
  var p, pad;
  if (alignment=='center'){
    p = p1;
    pad = 1/2;
  } else {
    var left = alignment=='left';
    p = left ? p1 : p2;
    pad = padding / Math.sqrt(dx*dx+dy*dy) * (left ? 1 : -1);
  }

  ctx.save();
  ctx.textAlign = alignment;
  ctx.translate(p.x+dx*pad,p.y+dy*pad);
  ctx.rotate(Math.atan2(dy,dx));
  ctx.font = '20px Arial';
  ctx.fillText(text,0,0);
  ctx.restore();
}

let highestPoint = {
  position: {
    x: 0,
    y: 0,
  }
}

function checkHighestPoint() {
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].position.y < highestPoint.position.y) {
      goalHeight = obstacles[i].position.y-45;
      highestPoint.position = obstacles[i].position;
    }
  }
}

function checkHighestElevation(num) {
  if ((num) < highestElevation) {
    highestElevation = num;
  }
  if (num < playerStats.highestElevation) {
    playerStats.highestElevation = num;
  }
}

function checkShortestTimeToFinish(num) {
  if ((num) < shortestTime) {
    shortestTime = num;
    playerStats.shortestTimeToWin = shortestTime;
  }
}

function tick() {
  playerStats.playTime++;
  playTime++;
  if (playerStats.shortestTimeToWin <= 0) {
    shortestTime = Infinity;
  }
}

function applyToPlayRecords() {
  playerStats.totalHeights += highestElevation;
  playerStats.totalElevations += totalElevations;
  playtime.innerHTML = playTime/100*2;
  deathbyobstacles.innerHTML = playerStats.deaths.obstacles;
  deathbyfalling.innerHTML = playerStats.deaths.fall;
  totaldeaths.innerHTML = playerStats.deaths.fall + playerStats.deaths.obstacles;
  totalwins.innerHTML = playerStats.wins;
  totalheights.innerHTML = (130-Math.round(highestElevation))/100+'m';
  totalelevations.innerHTML = Math.round(Math.abs(totalElevations))/100+'m';
  obstaclesdetroyed.innerHTML = obstaclesDestroyed;
  rectscollected.innerHTML = rectsCollected;
  rectsspend.innerHTML = rectsSpended;
  damagetaken.innerHTML = Math.round(damageTaken);
  healstaken.innerHTML = Math.round(healsTaken);
  totaljumps.innerHTML = totalJumps;
  totalkeyspressed.innerHTML = totalKeysPressed;
}

function applyToRecords() {
  record_playtime.innerHTML = playerStats.playTime/100*2;
  record_deathbyobstacles.innerHTML = playerStats.deaths.obstacles;
  record_deathbyfalling.innerHTML = playerStats.deaths.fall;
  record_totaldeaths.innerHTML = playerStats.deaths.fall + playerStats.deaths.obstacles;
  record_totalwins.innerHTML = playerStats.wins;
  record_shotestTimeToFinish.innerHTML = playerStats.shortestTimeToWin/100*2;
  record_totalheights.innerHTML = (130-Math.round(playerStats.totalHeights))/100+'m';
  record_totalelevations.innerHTML = Math.round(Math.abs(playerStats.totalElevations))/100+'m';
  record_obstaclesdetroyed.innerHTML = playerStats.obstaclesDestroyed;
  record_rectscollected.innerHTML = playerStats.rectsCollected;
  record_rectsspend.innerHTML = playerStats.rectsSpended;
  record_damagetaken.innerHTML = Math.round(playerStats.damageTaken);
  record_healstaken.innerHTML = Math.round(playerStats.healsTaken);
  record_totaljumps.innerHTML = playerStats.totalJumps;
  record_totalkeyspressed.innerHTML = playerStats.randomFacts.keys.totalKeys;
  record_highestElevation.innerHTML = Math.round(Math.abs(playerStats.highestElevation))/100+'m';
}

function togglePlayerStats() {
  applyToRecords();
  const el = document.getElementById('playerRecords');
  let style = el.style;
  if (style.display == 'block') {
    style.opacity = 0;
    style.display = 'none';
  }
  else {
    style.opacity = 1;
    style.display = 'block';
  }
}

function loaded() {
  document.getElementById('loader').style.display = 'none';
}
