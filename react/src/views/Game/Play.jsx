import { ReactP5Wrapper } from "react-p5-wrapper";

class Player {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.speed = 0
    }

    show(p5) {
        p5.rectMode(p5.CENTER);
        p5.rect(this.x, this.y, 20, 80)
    }

    move(dir) {
      this.speed = dir
    }

    update(p5) {
      this.y += this.speed

      this.y = p5.constrain(this.y, -111, 111)
    }
}

function sketch(p5) {
    
    let player

    p5.setup = () =>{
        p5.createCanvas(750, 300, p5.WEBGL)

        player = new Player(-360, 0)

    }

    p5.draw = () => {
      p5.background(0)

      player.show(p5)

      player.update(p5)

    }

    p5.mouseDragged = () => {
      player.move(2)
    }

    p5.keyPressed = () => {
      if (p5.keyCode == p5.UP_ARROW) {
        player.move(-2)
      } else if (p5.keyCode == p5.DOWN_ARROW) {
        player.move(2)
      }
    }

    p5.keyReleased = () => {
      if (p5.keyCode == p5.UP_ARROW || p5.keyCode == p5.DOWN_ARROW) {
        player.move(0)
      }
    }
}

export default function Play() {

    return <ReactP5Wrapper sketch={sketch} />

}