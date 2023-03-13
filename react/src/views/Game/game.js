import { ReactP5Wrapper } from 'react-p5-wrapper'

import Ball from './ball'
import Paddle from './paddle'

function Game(p5, genome) {
    this.brain = genome
    this.brain.score = 0

    this.done = false

    this.ball = new Ball(p5, this)
    this.leftPaddle = new Paddle(p5, 30, 1, this)
    this.rightPaddle = new Paddle(p5, 470, 2, this)

    // show all square
    this.show = (p5) => {
        if (this.done) {
            return 
        }

        this.ball.show(p5)
        this.leftPaddle.show(p5)
        this.rightPaddle.show(p5)
    }

    // update physics and check if dead
    this.update = () => {
        if (this.done) {
            return
        }

        this.ball.update(p5)
        this.leftPaddle.update(p5)
        this.rightPaddle.update(p5)
        this.ball.checkCollide(p5, this.leftPaddle)
        this.ball.checkCollide(p5, this.rightPaddle)
    }
}

export default Game