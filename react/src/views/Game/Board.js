import { ReactP5Wrapper } from "react-p5-wrapper";

export default class Board {
  constructor(x, y) {
      this.x = x
      this.y = y
      this.speed = 0
  }

  display(p5) {
      p5.fill(255)
      p5.rect(this.x, this.y, 25, 70)
  }

  update(p5) {
      this.y += this.speed

      this.y = p5.constrain(this.y, -150, 80)
  }

  move(y) {
      this.speed = y
  }

}
