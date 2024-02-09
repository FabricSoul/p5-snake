import "./style.css";
import p5 from "p5";

const grid = 20;

class Snake {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
  gameover: boolean;
  food: { x: number; y: number };
  foodEaten: boolean;
  snakeLength: number;
  snakeBody: Array<{ x: number; y: number }>;

  //best catch
  manhattan: number;
  record: number;
  bestcatch: boolean;
  
  constructor() {
    this.x = 15;
    this.y = 20;
    this.xSpeed = 0;
    this.ySpeed = -1;
    this.gameover = false;
    this.food = {
      x: Math.floor((Math.random() * 800) / grid),
      y: Math.floor((Math.random() * 600) / grid),
    };
    this.foodEaten = true;
    this.snakeLength = 1;
    this.snakeBody = [{ x: this.x, y: this.y }];
  }

  update() {
    this.record+=1;//best catch
    //after 3 updates, bestcatch disappears.
    if(this.record>3){
      this.bestcatch=false;
    }
    if (this.foodEaten) {
      this.food = {
        x: Math.floor((Math.random() * 800) / grid),
        y: Math.floor((Math.random() * 600) / grid),
      };
      this.foodEaten = false;

      //best catch
      this.manhattan=Math.abs(this.food.x-this.x)+Math.abs(this.food.y-this.y);
    }
    if (this.x * grid <= 800 - grid && this.x * grid >= 0) {
      this.x += this.xSpeed;
    } else {
      this.gameover = true;
    }
    if (this.y * grid <= 600 - grid && this.y >= 0) {
      this.y += this.ySpeed;
    } else {
      this.gameover = true;
    }

    // check if the snake has eaten the food
    if (this.x === this.food.x && this.y === this.food.y) {
      this.foodEaten = true;
      this.snakeLength++;
      //best catch
      if(this.manhattan==this.record){
        this.bestcatch=true;
      }else{
        this.bestcatch=false;
      }
      this.record=0;
    }

    // update the position of the snake by updating the array
    // make the first element current position and remove the last element
    this.snakeBody.unshift({ x: this.x, y: this.y });
    if (this.snakeBody.length > this.snakeLength) {
      this.snakeBody.pop();
    }

    // check if the snake has eaten itself
    for (let i = 1; i < this.snakeBody.length; i++) {
      if (this.x === this.snakeBody[i].x && this.y === this.snakeBody[i].y) {
        this.gameover = true;
      }
    }
  }

  show(p: p5) {
    //render food
    p.fill(255, 0, 0);
    p.rect(this.food.x * grid, this.food.y * grid, grid, grid);
    // render every part of the snake
    p.fill(255);
    for (let i = 0; i < this.snakeLength; i++) {
      p.rect(
        this.snakeBody[i].x * grid,
        this.snakeBody[i].y * grid,
        grid,
        grid
      );
    }
    //render "best catch"
    if(this.bestcatch){
      p.fill(255,0,0);
      p.textsize(10);
      p.text("Best Catch",380,10);
    } 
  }

  direction(x: number, y: number) {
    this.xSpeed = x;
    this.ySpeed = y;
  }
}

new p5((p: p5) => {
  let snake: Snake;

  p.setup = () => {
    p.frameRate(3);
    let canvas = p.createCanvas(800, 600);
    canvas.parent("app");

    snake = new Snake();
  };

  p.keyPressed = () => {
    if (p.keyCode === p.UP_ARROW) {
      snake.direction(0, -1);
    } else if (p.keyCode === p.DOWN_ARROW) {
      snake.direction(0, 1);
    } else if (p.keyCode === p.RIGHT_ARROW) {
      snake.direction(1, 0);
    } else if (p.keyCode === p.LEFT_ARROW) {
      snake.direction(-1, 0);
    }
  };

  p.draw = () => {
    p.background(220);
    if (snake.gameover) {
      p.fill(255, 0, 0);
      p.textSize(32);
      p.text("Game Over", 300, 300);
      return;
    }
    snake.update();
    snake.show(p);
  };
});
