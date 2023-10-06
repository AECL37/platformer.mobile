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
  }

  
  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  updateCameraBox() {
    this.camerabox = {
      position: {
        x: this.position.x - 185,
        y: this.position.y - 59.5,
      },
      width: 420,
      height: 180,
    }
  }

  update() {
    this.draw();
    this.updateCameraBox();

    // c.fillStyle = 'rgba(0, 255, 25, 0.2)';
    // c.fillRect(
    //     this.camerabox.position.x,
    //     this.camerabox.position.y,
    //     this.camerabox.width,
    //     this.camerabox.height
    // );

    this.position.x += this.velocity.x;
    this.xCollisions();
    this.applyGravity();
    this.yCollisions();

  }

  canvaCollisions() {
    if (this.position.x + this.width + this.velocity.x >= 2000 ||
        this.position.x + this.velocity.x <= 0
        ) {
        this.velocity.x = 0;
    }
  }

  shouldPanCameraToTheLeft({canvas, camera}) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
    const canvasBox  = canvas.width;

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
        }
      }
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
    for (let i = 0; i < this.collisions.length; i++) {
      const collision1 = this.collisions[i];
      if (collision1.position != undefined) {
        if (
          colliding({
            obj1: this,
            obj2: collision1,
          })
        ) {
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
}


class Item {
  constructor({ position, width, height, color, collisions }) {
    this.position = position;
    this.reservedPosition = position;
    this.collisions = collisions;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = width;
    this.height = height;
    this.color = color;
  }
  
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  fix() {
    this.position = this.reservedPosition;
  }

  update() {
    this.draw();


    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y < plane.position.y) {
      this.velocity.y += gravity;
    }
    else {
      this.velocity.y = 0;
    }
  }
  
  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
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
}