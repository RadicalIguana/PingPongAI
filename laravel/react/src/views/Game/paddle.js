import { ReactP5Wrapper } from "react-p5-wrapper"

function Paddle(p5, x, side, game) {
    this.x = x
    this.width = 10
    this.height = 85
    this.y = p5.height / 2
    this.vy = 0
    this.side = side // 1 -> left, 2 -> right

    this.game = game

    this.update = (p5) => {
        // if (isPersonPlaying && this.size == 2) {
        //     let newY = p5.costrain(p5.mouseY, this.height / 2, p5.height - this.height / 2)
        // } else {
        //     let input = this.detect()
        //     let output = this.game.brain.activate(input)

        //     this.vy = output[0]

        //     let newY = p5.constrain(this.y + this.vy, this.height / 2, p5.height - this.height / 2)
        // }

        let input = this.detect()
        let output = this.game.brain.activate(input)
        this.vy = output[0]
        let newY = p5.constrain(this.y + this.vy, this.height / 2, p5.height - this.height / 2)

        this.y = newY
    }
    
    this.show = (p5) => {
        p5.fill(255)
        p5.rect(this.x, this.y, this.width, this.height)
    }

    // inputs: 
    // 1. vertical displacement of ball from center of paddle
    // 2. horizontal displacement of ball from center of paddle
    // 3. ball horizontal velocity
    // 4. ball vertical velocity
    // 5. paddle velocity

    this.detect = () => {
        let inputs = [
            this.game.ball.y - this.y,
            (this.size == 1 ? -1 : 1) * (this.x - this.game.ball.x), 
            (this.size == 1 ? -1 : 1) * this.game.ball.vx,
            (this.size == 1 ? -1 : 1) * this.game.ball.vy,
            this.vy
        ]
        return inputs
    }

}

export default Paddle