import { ReactP5Wrapper } from "react-p5-wrapper";
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'


export default function Play() {

  useEffect(() => {

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const socket = io.connect('http://localhost:4000')
    let isReferee = false
    let paddleIndex = 0

    const width = 300
    const height = 500

    // Paddle
    let paddleHeight = 10
    let paddleWidth = 50
    let paddleDif = 25
    let paddleX = [ 135, 135 ]
    let trajectoryX = [ 0, 0 ]
    let playerMoved = false

    // Ball
    let ballX = 160
    let ballY = 250
    let ballRadius = 5
    let ballDirection = 1

    // Speed
    let speedX = 0
    let speedY = 2

    // Score
    let score = [ 0, 0 ]

    function createCanvas() {
      canvas.width = width
      canvas.height = height
      renderCanvas()
    }

    function renderIntro() {
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = 'white'
      ctx.font = '32px Courier New'
      ctx.fillText("Waiting for opponent...", 20, (canvas.height / 2) - 30)
    }

    function renderCanvas() {
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = 'white'

      // Top paddle
      ctx.fillRect(paddleX[1], 5, paddleWidth, paddleHeight)

      // Bottom paddle
      ctx.fillRect(paddleX[0], height - 15, paddleWidth, paddleHeight)
    
      // Dashed center line


      // Ball
      ctx.beginPath()
      ctx.arc(ballX, ballY, ballRadius, 2 * Math.PI, false)
      ctx.fillStyle = 'white'
      ctx.fill()

      // Score
      ctx.font = "32px Courier New"
      ctx.fillText(score[1], 20, (canvas.height / 2) + 50)
      ctx.fillText(score[0], 20, (canvas.height / 2) - 30)
    }

    function ballMove() {
      ballY += speedY * ballDirection
      if (playerMoved) {
        ballX += speedX
      }
      socket.emit('ballMove', {
        ballX, 
        ballY,
        score
      })
    }

    function ballReset() {
      ballX = width / 2
      ballY = height / 2
      speedY = 3

      socket.emit('ballMove', {
        ballX,
        ballY,
        score
      })
    }

    function ballBoundaries() {
      // Bounce off Left Wall
      if (ballX < 0 && speedX < 0) {
        speedX = -speedX
      }
      // Bounce off Right Wall
      if (ballX > width && speedX > 0) {
        speedX = -speedX
      }
      // Bounce off player bottom paddle
      if (ballY > height - paddleDif) {
        if (ballX >= paddleX[0] && ballX <= paddleX[0] + paddleWidth) {
          // Add speed on Hit
          if (playerMoved) {
            speedY += 1
            // Max speed
            if (speedX > 5) {
              speedY = 5
            }
          }
          ballDirection = -ballDirection
          trajectoryX[0] = ballX - (paddleX[0] + paddleDif)
          speedX = trajectoryX[0] * 0.3
        } else {
          // Reset Ball, add to Computer Score
          ballReset()
          score[1]++
        }
      }
      // Bounce off computer paddle top
      if (ballY < paddleDif) {
        if (ballX >= paddleX[1] && ballX <= paddleX[1] + paddleWidth) {
          // Add speed on hit
          if (playerMoved) {
            speedY += 1
            // Max speed
            if (speedY > 5) {
              speedY = 5
            }
          }
          ballDirection = -ballDirection
          trajectoryX[1] = ballX - (paddleX[1] + paddleDif)
          speedX = trajectoryX[1] * 0.3
        } else {
          ballReset()
          score[0]++
        }
      }
    }

    function animate() {
      if (isReferee) {
        ballMove()
        ballBoundaries()
      }
      renderCanvas()
      window.requestAnimationFrame(animate)
    }

    function loadGame() {
      createCanvas()
      renderIntro()
      socket.emit('ready')
    }

    function startGame() {
      paddleIndex = isReferee ? 0 : 1
      window.requestAnimationFrame(animate)
      canvas.addEventListener('mousemove', (e) => {
        playerMoved = true
        paddleX[paddleIndex] = e.offsetX
        if (paddleX[paddleIndex] < 0) {
          paddleX[paddleIndex] = 0
        }
        if (paddleX[paddleIndex] > (width - paddleWidth)) {
          paddleX[paddleIndex] = width - paddleWidth
        }
        socket.emit('paddleMove', {
          xPosition: paddleX[paddleIndex]
        })
        canvas.style.cursor = 'none'
      })
    }

    loadGame()

    socket.on('connect', () => {
      console.log(`Connected as ${socket.id}`);
    })

    socket.on('startGame', (refreeId) => {
      console.log(`Refree is ${refreeId}`);

      isReferee = socket.id === refreeId

      startGame()
    })

    socket.on('paddleMove', (paddleData) => {
      const opponentPaddleIndex = 1 - paddleIndex
      paddleX[opponentPaddleIndex] = paddleData.xPosition
    })

    socket.on('ballMove', (ballData) => {
      ({ ballX, ballY, score } = ballData)
    })

  }, [])

  return (
    <canvas id="canvas"/>
  )

}