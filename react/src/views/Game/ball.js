import p5 from 'p5'
import { ReactP5Wrapper } from 'react-p5-wrapper'

let MAX_BOUNCE_ANGLE
let BASE_BALL_SPEED = 2

function Ball(p5, game) {
    this.x = p5.width / 2
    this.y = p5.widht / 2

    // random direction
    this.vx = p5.random([-BASE_BALL_SPEED, BASE_BALL_SPEED])
    this.vy = p5.random(-0.5, -0.5)
    this.size = 8

    MAX_BOUNCE_ANGLE = 7 * p5.PI / 18

    this.game = game

    this.update = (p5) => {
        this.x += this.vx
        this.x = p5.constrain(this.x, this.size / 2, p5.width - this.size / 2)
        this.y += this.vy
        this.y = p5.constrain(this.y, this.size / 2, p5.height - this.size / 2)

        // if within 1 pixel of bottom or top of screen/ flip y velocity
        if (this.y - this.size / 2 <= 1 || this.y + this.size / 2 >= p5.height - 1) {
            this.vy *= -1
        }
        if (this.x - this.size / 2 <= this.game.leftPaddle.x - this.game.leftPaddle.width / 2 - 10 || this.x + this.size / 2 >= this.game.rightPaddle.x + this.game.rightPaddle.width / 2 + 10) {
            // TODO isPersonPlaying || isAIPlaying
            // if (isPersonPlaying || isAIPlaying) {
            //     this.game.brain.score = 0
            //     this.reset(p5)
            // } else {
            //     this.game.done = true
            //     // divide brain score if died because it's bad
            //     this.game.brain.score /= 10.0
            // }
            this.brain.game.score = 0
            this.reset(p5)
            this.game.done = true
            this.game.brain.score /= 10.0
        }
    }

    this.reset = (p5) => {
        this.x = p5.width / 2
        this.y = p5.height / 2
        this.vx = p5.random([-2, 2])
        this.vy = p5.random(-0.5, -0.5)
        this.game.leftPaddle.y = p5.height / 2
        this.game.leftPaddle.vy = 0
        this.game.rightPaddle.y = p5.height / 2
        this.game.rightPaddle.vy = 0
    }

    this.show = (p5) => {
        p5.fill(0)
        p5.rect(this.x, this.y, this.size, this.size)
    }

    this.checkCollide = (p5, paddle) => {
        if (paddle.side == 1) {
          var withinPaddleX = this.x - this.size / 2 <= paddle.x + paddle.width / 2 && this.x - this.size / 2 >= paddle.x - paddle.width / 2;
        } else {
          var withinPaddleX = this.x + this.size / 2 >= paddle.x - paddle.width / 2 && this.x + this.size / 2 <= paddle.x + paddle.width / 2;
        }
        let withinPaddleY = this.y + this.size / 2 > paddle.y - paddle.height / 2 && this.y - this.size / 2 < paddle.y + paddle.height / 2;
        if (withinPaddleX && withinPaddleY) {
          this.game.brain.score += 1;
    
          var relativeIntersectY = paddle.y - this.y;
          var normalizedRelativeIntersectionY = relativeIntersectY / (paddle.height / 2);
          var bounceAngle = normalizedRelativeIntersectionY * MAX_BOUNCE_ANGLE;
    
          if (p5.random(1) < randomBounceRate) {
            bounceAngle += p5.random([-1, 1]) * p5.random(p5.PI / 12);
            bounceAngle = p5.constrain(bounceAngle, -MAX_BOUNCE_ANGLE, MAX_BOUNCE_ANGLE);
          }
    
          this.vx = (paddle.side == 1 ? 1 : -1) * BASE_BALL_SPEED * Math.cos(bounceAngle);
          this.vy = BASE_BALL_SPEED * -Math.sin(bounceAngle);
        }
    }
}

export default Ball