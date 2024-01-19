class Player {
  constructor({ position, collisions }) {
    this.position = position;
    this.collisions = collisions;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 45;
    this.height = 70;
    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 90,
    }
    this.attackHitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 25,
      height: 70,
    }
    this.direction = 45;
    this.jumps = 0;
    this.health = 100;
    this.rects = 0;
    this.previousHealth = this.health;
    this.previousRects = this.rects;
  }

  checkIfBawasHealth() {
    if (this.health < this.previousHealth) {
      healthDifference = this.previousHealth - this.health;
      spawnHeart(this.position.x, this.position.y, healthDifference);
      shakeCam(healthDifference);
      damageEffect();
      playerStats.damageTaken += healthDifference;
      damageTaken += healthDifference;
      this.previousHealth = this.health;
    }
    else if (this.health > this.previousHealth) {
      healEffect();
      playerStats.healsTaken += healthDifference;
      healsTaken += healthDifference;
      this.previousHealth = this.health;
    }
    if (this.health <= 0) {
      document.getElementById('health').value = 0;
    }
  }

  checkIfBawasRects() {
    if (this.rects < this.previousRects && this.previousRects != 0) {
      rectsDifference = this.previousRects - this.rects;
      minusEffect();
      playerStats.rectsSpended += rectsDifference;
      rectsSpended += rectsDifference;
      this.previousRects = this.rects;
    }
    else if (this.rects > this.previousRects) {
      rectsDifference = this.rects - this.previousRects;
      addEffect();
      playerStats.rectsCollected += rectsDifference;
      rectsCollected += rectsDifference;
      this.previousRects = this.rects;
    }
  }
  
  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  updateCameraBox() {
    this.camerabox = {
      position: {
        x: this.position.x + 169 - 360,
        y: this.position.y - 59.5,
      },
      width: 420,
      height: 180,
    }
  }

  updateAttackHitbox() {
    this.attackHitbox = {
      position: {
        x: this.position.x + this.direction,
        y: this.position.y + attackOffset,
      },
      width: attackWidth,
      height: attackHeight,
    }
  }

  attack() {
    for (let i = 0; i < obstacles.length; i++) {
      const collisions = obstacles[i];

      if (
        colliding({
          obj1: this.attackHitbox,
          obj2: collisions,
        })
      ) {
        collisions.width -= ((attackWidth/attackHeight)*attackHeight)/attackHeight;
        collisions.height -= (attackWidth*(attackHeight/attackWidth))/attackWidth;

        if (this.position.x < collisions.position.x){
          collisions.position.x += ((attackWidth/attackHeight)*attackHeight)/attackHeight;
        }
        if (this.position.y < collisions.position.y + collisions.height){
          collisions.position.y += (attackWidth*(attackHeight/attackWidth))/attackWidth;
        }
        if (collisions.width < 1) {
          obstacles.splice(i, 1);
          playerStats.obstaclesDestroyed++;
          obstaclesDestroyed++;
          for (let i = 0; i < (collisions.reservedWidth*collisions.reservedHeight)/3500+1; i++) {
            spawnLoot(collisions.position.x+rand(0,collisions.reservedWidth), collisions.position.y-rand(0,collisions.reservedHeight), 10,10);
          }
        }
        else if (collisions.height < 1) {
          obstacles.splice(i, 1);
          playerStats.obstaclesDestroyed++;
          obstaclesDestroyed++;
          for (let i = 0; i < (collisions.reservedWidth*collisions.reservedHeight)/3500+1; i++) {
            spawnLoot(collisions.position.x+rand(0,collisions.reservedWidth), collisions.position.y-rand(0,collisions.reservedHeight), 10,10);
          }
        }
        }
    }
  }

  //position, damage, velocity, collisions, threshold
  shootProjectile() {
    if (this.rects >= 20) {
      this.rects -= 20;
      let direction;
      let offset;
      if (this.direction == 10) {
        direction = 0;
      }
      else if (this.direction > 0) {
        direction = 30;
      }
      else if (this.direction < 0) {
        direction = -30;
      }

      if (attackOffset > 0) {
        offset = 30;
      }
      else if (attackOffset < 0) {
        offset = -30;
      }
      else {
        offset = 0;
      }
      projectiles.push(new Projectile({
        position: {
          x: this.position.x + this.direction,
          y: this.position.y + attackOffset,
        },
        damage: 30,
        velocity: {
          x: direction,
          y: offset,
        },
        collisions: [plane,obstacles],
        threshold: 2,
      }))
    }
  }

  update() {
    this.draw();
    this.updateCameraBox();
    this.updateAttackHitbox();
    this.checkIfBawasHealth();
    this.checkIfBawasRects();

    // c.fillStyle = 'rgba(255, 255, 0, 0.7)';
    // c.fillRect(
    //     this.camerabox.position.x,
    //     this.camerabox.position.y,
    //     this.camerabox.width,
    //     this.camerabox.height
    // );

    c.fillStyle = 'rgba(0, 255, 25, 0.2)';
    c.fillRect(
        this.attackHitbox.position.x,
        this.attackHitbox.position.y,
        this.attackHitbox.width,
        this.attackHitbox.height
    );

    this.position.x += this.velocity.x;
    this.xCollisions();
    this.checkIfBawasHealth();
    this.applyGravity();
    this.checkIfBawasHealth();
    this.yCollisions();
    this.checkIfBawasHealth();

  }

  canvaCollisions() {
    if (this.position.x + this.width + this.velocity.x >= 2000) {
        this.velocity.x = 0;
        this.position.x + this.width;
    }
    else if (this.position.x + this.velocity.x <= 0) {
      this.velocity.x = 0;
      this.position.x = 0;
    }
  }

  shouldPanCameraToTheLeft({canvas, camera}) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
    const canvasBox  = canvas.width/0.75;

    if (cameraboxRightSide >= 2000) {return}

    if (cameraboxRightSide >= canvasBox + Math.abs(camera.position.x)) {
        camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight({canvas, camera}) {
    if (this.camerabox.position.x <= 0) {return}

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
        camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraDown({canvas, camera}) {
    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
        camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraUp({canvas, camera}) {
      if (
          this.camerabox.position.y + this.camerabox.height >=
          250.5 - camera.position.y
      ) {
          camera.position.y -= this.velocity.y;
      }
  }


  interact() {
    for (let i = 0; i < items.length; i++) {
      const collisions = items[i];

      if (
        colliding({
          obj1: this,
          obj2: collisions,
        })
      ) {
        items.splice(i, 1);
        this.rects += items[i].width-9;
        this.rects += items[i].height-9;
        }
      }
      for (let i = 0; i < hearts.length; i++) {
        const collisions = hearts[i];
  
        if (
          colliding({
            obj1: this,
            obj2: collisions,
          })
        ) {
          this.health += collisions.healthValue;
          hearts.splice(i, 1);
          }
        }
  }
  

  applyGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
        if (this.velocity.y < 0) {
          totalElevations += this.velocity.y;
        }
  }

  xCollisions() {
    for (let i = 0; i < this.collisions.length; i++) {
      const collision1 = this.collisions[i];
      if (collision1.position != undefined) {
        if (
          colliding({
            obj1: this,
            obj2: collision1,
          })
        ) {
          if (this.velocity.x > 0) {
            this.velocity.x = 0;

            const offset = this.width;


            this.position.x = collision1.position.x - offset - 0.01;
            break;
        }
        if (this.velocity.x < 0) {
            this.velocity.x = 0;

            const offset = this.position.x;


            this.position.x = collision1.position.x + collision1.width + 0.01;
            break;
        }
        }
      }
      for (let j= 0; j < this.collisions[i].length; j++) {
        const collision = this.collisions[i][j];
        
        if (collision != undefined) {
          if (
            colliding({
              obj1: this,
              obj2: collision,
            })
          ) {
            if (this.velocity.x > 0) {
              this.velocity.x = 0;

              const offset = this.width;


              this.position.x = collision.position.x - offset - 0.01;
              break;
          }
          if (this.velocity.x < 0) {
              this.velocity.x = 0;

              const offset = this.position.x;


              this.position.x = collision.position.x + collision.width + 0.01;
              break;
          }
          }
        }
      }
    }
  }

  yCollisions() {
    for (let i = 0; i < this.collisions.length; i++) {
      const collision1 = this.collisions[i];
      if (collision1.position != undefined) {
        if (
          colliding({
            obj1: this,
            obj2: collision1,
          })
        ) {
            if (this.velocity.y > 23.5) {
              this.health -= this.velocity.y - 23.4;
              if (this.health <= 0) {
                playerStats.deaths.fall += 1;
              }
            }
            if (this.velocity.y > 0) {
              this.velocity.y = 0;
              this.jumps = 2;

              const offset = this.height;

              this.position.y = collision1.position.y - offset - 0.01;
              break;
          }
          if (this.velocity.y < 0) {
              this.velocity.y = 0;

              const offset = this.position.y;

              this.position.y = collision1.position.y + collision1.height - offset + 0.01;
              break;
          }
        }
      }
      for (let j= 0; j < this.collisions[i].length; j++) {
        const collision = this.collisions[i][j];
        if (collision != undefined) {
          if (
            colliding({
              obj1: this,
              obj2: collision,
            })
          ) {
            if (this.velocity.y > 23.5) {
              this.health -= this.velocity.y;
              if (this.health <= 0) {
                playerStats.deaths.fall += 1;
              }
            }
            if (this.velocity.y > 0) {
              this.velocity.y = 0;
              this.jumps = 2;

              const offset = this.height;

              this.position.y = collision.position.y - offset - 0.01;
              break;
          }
          if (this.velocity.y < 0) {
              this.velocity.y = 0;

              const offset = this.position.y;

              this.position.y = collision.position.y + collision.height + 0.01;
              break;
          }
          }
        }
      }
    }
  }
}


class Item {
  constructor({ position, width, height, color, collisions, health }) {
    this.position = position;
    this.reservedPosition = position;
    this.collisions = collisions;
    this.reservedWidth = width;
    this.reservedHeight = height;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = width;
    this.height = height;
    this.color = color;
    this.mass = width*height;
    this.healthValue = health;
  }
  
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  fix() {
    this.position = this.reservedPosition;
    this.draw();
  }

  update() {
    this.draw();

    this.mass = this.width*this.height;

    this.position.x += this.velocity.x;
    this.xCollisions();
    this.applyGravity();
    this.yCollisions();
  }
  
  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
}

xCollisions() {
  for (let i = 0; i < this.collisions.length; i++) {
    const collision1 = this.collisions[i];
    if (collision1.position != undefined) {
      if (
        colliding({
          obj1: this,
          obj2: collision1,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset = this.width;


          this.position.x = collision1.position.x - offset - 0.01;
          break;
      }
      if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.position.x;


          this.position.x = collision1.position.x + collision1.width + 0.01;
          break;
      }
      }
    }
    for (let j= 0; j < this.collisions[i].length; j++) {
      const collision = this.collisions[i][j];
      
      if (collision != undefined) {
        if (
          colliding({
            obj1: this,
            obj2: collision,
          })
        ) {
          if (this.velocity.x > 0) {
            this.velocity.x = 0;

            const offset = this.width;


            this.position.x = collision.position.x - offset - 0.01;
            break;
        }
        if (this.velocity.x < 0) {
            this.velocity.x = 0;

            const offset = this.position.x;


            this.position.x = collision.position.x + collision.width + 0.01;
            break;
        }
        }
      }
    }
  }
}

  yCollisions() {
    if (this.collisions.length != undefined){
      for (let i = 0; i < this.collisions.length; i++) {
        const collision1 = this.collisions[i];
        if (collision1.position != undefined) {
          if (
            colliding({
              obj1: this,
              obj2: collision1,
            })
          ) {
            if (collision1.health != undefined) {
              let calculation = Math.sqrt(Math.sqrt(this.mass)*this.mass)
                if (((this.velocity.y+0.01)/10)* calculation > 790) {
                  collision1.health -= ((this.velocity.y) * Math.sqrt(this.mass))/212;
                  if (collision1.health <= 0) {
                    playerStats.deaths.obstacles += 1;
                  }
                }
            }
              if (this.velocity.y > 0) {
                this.velocity.y = 0;

                const offset = this.height;

                this.position.y = collision1.position.y - offset - 0.01;
                break;
            }
            if (this.velocity.y < 0) {
                this.velocity.y = 0;

                const offset = this.position.y;

                this.position.y = collision1.position.y + collision1.height - offset + 0.01;
                break;
            }
          }
        }
        for (let j= 0; j < this.collisions[i].length; j++) {
          const collision = this.collisions[i][j];
          
          if (collision != undefined) {
            if (
              colliding({
                obj1: this,
                obj2: collision,
              })
            ) {
              if (this.velocity.y > 0) {
                this.velocity.y = 0;

                const offset = this.height;

                this.position.y = collision.position.y - offset - 0.01;
                break;
            }
            if (this.velocity.y < 0) {
                this.velocity.y = 0;

                const offset = this.position.y;

                this.position.y = collision.position.y + collision.height - offset + 0.01;
                break;
            }
            }
          }
        }
      }
    }
    else {
      if (
        colliding({
          obj1: this,
          obj2: this.collisions,
        })
      ) {
          if (this.velocity.y > 0) {
            this.velocity.y = 0;

            const offset = this.height;

            this.position.y = collision1.position.y - offset - 0.01;
        }
        if (this.velocity.y < 0) {
            this.velocity.y = 0;

            const offset = this.position.y;

            this.position.y = collision1.position.y + collision1.height - offset + 0.01;
        }
      }
    }
  }
}

class Projectile {
  constructor({ position, damage, velocity, collisions, threshold} ) {
    this.position = position;
    this.damage = damage;
    this.velocity = velocity;
    this.collisions = collisions;
    this.threshold = threshold;
    this.width = 30;
    this.height = 30;
  }

  draw() {
    c.fillStyle ='blue';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.detectCollisions();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  detectCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
      const collisions = obstacles[i];

      if (
        colliding({
          obj1: this,
          obj2: collisions,
        })
      ) {
        collisions.width -= this.damage;
        collisions.height -= this.damage;
        this.threshold -= 1;

        if (this.position.x < collisions.position.x){
          collisions.position.x += this.damage;
        }
        if (this.position.y < collisions.position.y + collisions.height){
          collisions.position.y += this.damaged;
        }
        if (collisions.width < 1) {
          obstacles.splice(i, 1);
          playerStats.obstaclesDestroyed++;
          obstaclesDestroyed++;
          for (let i = 0; i < (collisions.reservedWidth*collisions.reservedHeight)/3500+1; i++) {
            spawnLoot(collisions.position.x+rand(0,collisions.reservedWidth), collisions.position.y-rand(0,collisions.reservedHeight), 10,10);
          }
        }
        else if (collisions.height < 1) {
          obstacles.splice(i, 1);
          playerStats.obstaclesDestroyed++;
          obstaclesDestroyed++;
          for (let i = 0; i < (collisions.reservedWidth*collisions.reservedHeight)/3500+1; i++) {
            spawnLoot(collisions.position.x+rand(0,collisions.reservedWidth), collisions.position.y-rand(0,collisions.reservedHeight), 10,10);
          }
        }
        }
    }
  }
}

class sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }
  play() {
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
}
