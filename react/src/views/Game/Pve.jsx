import React from 'react'
import { ReactP5Wrapper } from 'react-p5-wrapper'

import Game from './game'

import { Neat as _Neat, methods, architect } from 'neataptic'

function sketch(p5) {

    let games = []

    let highestScore = 0
    let curHighestScore = 0

    let isPersonPlaying = false,
        isAIPlaying = false

    let ballSpeed = 6
    let randomBounceRate = 0.2

    let populationSize = 500

    let remainingAlive = populationSize

    let ballSpeedP, ballSpeedSlider
    let populationSizeP, populationSizeSlider

    let previousPopulation

    let endEvalButton

    let baseFrame = 0

    let END_FRAME_COUNT = 1000

    let loadingFile = false

    var Neat = neataptic.Neat;
    var Methods = neataptic.methods;
    var Architect = neataptic.architect;

    var neat, network;

    var MUTATION_RATE = 0.3;
    var ELITISM_RATE = 0.1;

    var USE_TRAINED_POP = false; // use already trained population

    // inputs: vertical displacement of ball from center of paddle, horizontal displacement of ball from center of paddle, ball horizontal velocity, ball vertical velocity, paddle velocity (5)
    // outputs: vertical paddle velocity (1)

    function initNeat(isResetting) {
    if (isResetting) {
        var oldPop = neat.population;
    }
    // hidden layer nodes rule of thumb: inputs + outputs = 5 + 1 = 6
    network = new Architect.Perceptron(5, 6, 1);
    neat = new Neat(
        5,
        1,
        null,
        {
        mutation: [
            Methods.mutation.ADD_NODE,
            Methods.mutation.SUB_NODE,
            Methods.mutation.ADD_CONN,
            Methods.mutation.SUB_CONN,
            Methods.mutation.MOD_WEIGHT,
            Methods.mutation.MOD_BIAS,
            Methods.mutation.MOD_ACTIVATION,
            Methods.mutation.ADD_GATE,
            Methods.mutation.SUB_GATE,
            Methods.mutation.ADD_SELF_CONN,
            Methods.mutation.SUB_SELF_CONN,
            Methods.mutation.ADD_BACK_CONN,
            Methods.mutation.SUB_BACK_CONN
        ],
        popsize: populationSize,
        mutationRate: MUTATION_RATE,
        elitism: Math.round(ELITISM_RATE * populationSize),
        network: network
        }
    );
    neat.generation = 1;
    if (isResetting) {
        // copy previous population into new population
        var smallerSize = populationSize < oldPop.length ? populationSize : oldPop.length;
        for (var i = 0; i < smallerSize; i++) {
        neat.population[i] = oldPop[i];
        }
    } else if (USE_TRAINED_POP) {
        getPopulationFromFile();
    }
    }

    function startEvaluation() {
    games = [];
    for (var genome in neat.population) {
        genome = neat.population[genome];
        games.push(new Game(p5, genome));
    }
    remainingAlive = games.length;
    baseFrame = p5.frameCount;
    }

    function endEvaluation() {
    if (isPersonPlaying || isAIPlaying) {
        isPersonPlaying = false;
        isAIPlaying = false;
        endEvalButton.html('Next Generation');
        startEvaluation();
    } else {
        neat.sort();
        var newGames = [];

        for (var i = 0; i < neat.elitism; i++) {
        newGames.push(neat.population[i]);
        }

        for (var i = 0; i < neat.popsize - neat.elitism; i++) {
        newGames.push(neat.getOffspring());
        }

        neat.population = newGames;
        neat.mutate();

        neat.generation++;
        startEvaluation();
    }
    }


    function Game(p5, genome) {
        this.brain = genome
        this.brain.score = 0
    
        this.done = false
    
        this.ball = new Ball(p5, this)
        this.leftPaddle = new Paddle(30, 1, this)
        this.rightPaddle = new Paddle(470, 2, this)
    
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

    let MAX_BOUNCE_ANGLE
    let BASE_BALL_SPEED = 2

    function Ball(p5, game) {
        this.x = p5.width / 2
        this.y = p5.height / 2

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
 
            if (this.y - this.size / 2 <= 1 || this.y + this.size / 2 >= p5.height - 1) {
                this.vy *= -1
            }

            if (this.x - this.size / 2 <= this.game.leftPaddle.x - this.game.leftPaddle.width / 2 - 10 || this.x + this.size / 2 >= this.game.rightPaddle.x + this.game.rightPaddle.width / 2 + 10) {
                if (isPersonPlaying || isAIPlaying) {
                    this.game.brain.score = 0
                    this.reset(p5)
                } else {
                    this.game.done = true
                    this.game.brain.score /= 10.0
                }
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
            p5.fill(255)
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

    
    function Paddle(x, side, game) {
        this.x = x
        this.width = 10
        this.height = 80
        this.y = 0
        this.vy = 0
        this.side = side // 1 -> left, 2 -> right

        this.game = game

        this.update = (p5) => {
            if (isPersonPlaying && this.side == 2) {
                var newY = p5.constrain(p5.mouseY, this.height / 2 - 40, (p5.height - this.height / 2) - 40)
            } else {
                let input = this.detect()
                let output = this.game.brain.activate(input)

                this.vy = output[0]

                var newY = p5.constrain(this.y + this.vy, this.height / 2 - 40, (p5.height - this.height / 2) - 40)
            }

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


    // Game Start

    function configChanged() {
        ballSpeed = ballSpeedSlider.value()
        // ball speed info
        ballSpeedP.html('Ball Speed: ' + ballSpeed)
        if (populationSize != populationSizeSlider.value()) {
            populationSize = populationSizeSlider.value()
            // population size info
            populationSizeP.html('Population Size: ' + populationSize)
            initNeat(true)
            endEvaluation()
        }
    }   

    function  infoPHTML() {
        // TODO ADD! ${neat.generation} after Generation:
        return `Generation: ${neat.generation}<br>Highest Score: ${highestScore}<br>Current Highest Score: ${curHighestScore}<br>Remaining Alive: ${remainingAlive}`
    }

    p5.setup = () => {
        p5.createCanvas(500, 500)
        // canvas.parent('sketch')
        // p5.rectMode(p5.CENTER)
        initNeat()

        p5.infoP = p5.createP(infoPHTML())

        // config
        p5.createButton('Play this AI').mousePressed(() => {
            endEvalButton.html('Resume AI Training (Stop AI/Player Game)')
            isAIPlaying = false
            isPersonPlaying = true
            neat.sort()
            games = [new Game(p5, neat.population[0])]
        })

        endEvalButton = p5.createButton('Next Generation')
        endEvalButton.mousePressed(endEvaluation)

        ballSpeedP = p5.createP('Ball Speed: ' + ballSpeed)
        ballSpeedSlider = p5.createSlider(1, 20, ballSpeed)
        ballSpeedSlider.changed(configChanged)

        populationSizeP = p5.createP('Population Size: ' + populationSize)
        populationSizeSlider = p5.createSlider(2, 1000, populationSize)
        populationSizeSlider.changed(configChanged)

        startEvaluation()
    }

    p5.draw = () => {
        p5.background(51)
    
        curHighestScore = 0
        remainingAlive = 0
        let allHaveFinished = true
        for (let i = 0; i < games.length; i++) {
            let score = Math.round(games[i].brain.score)
            if (score > curHighestScore) {
                curHighestScore = score
            }
            if (curHighestScore > highestScore) {
                highestScore = curHighestScore
            }
            if (!games[i].done) {
                remainingAlive++
                allHaveFinished = false
            }
        }

        p5.infoP.html(infoPHTML())

        if (!isPersonPlaying && !isAIPlaying && (allHaveFinished || (p5.frameCount - baseFrame) >= END_FRAME_COUNT)) {
            endEvaluation()
            return 
        }

        for (let i = 0; i < games.length; i++) {
            for (let j = 0; j < ballSpeed; j++) {
                games[i].update(p5)
            }
            games[i].show(p5)
        }
    } 

}

export default function Pve() {
  return <ReactP5Wrapper sketch={sketch}/>
}
