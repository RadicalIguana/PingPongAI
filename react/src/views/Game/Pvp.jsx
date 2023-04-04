import axios from 'axios'
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import axiosClient from '../../axios-client'
import { useStateContext } from '../../contexts/contextProvider'

//const HOST = 'http://192.168.0.7:4000'
// const HOST = 'http://localhost:4000'

const HOST = '/ws'
// const HOST = {path: '/socket.io'}

export default function Pvp() {

  useEffect(() => {

      let socket

      let id
      let username 

      const getUsers = async () => {
        await axiosClient.get('/user')
          .then(({data}) => {
            id = data.id
            username = data.name
          })
      }

      const postResult = async () => {
        const payload = {
          winner: winner,
          loser: loser,
          winner_name: winner_name,
          loser_name: loser_name,
          game_result: `${score[0]} : ${score[1]}`
        }
        await axiosClient.post('/storeResult', payload)
          .then((response) => {
            console.log(response.status)
          })
          .catch((error) => {
            console.log(error);
          })
      }

      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')

      let playAnimation = true

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

      // Players
      let players = []
      let userIds = []
      let winner 
      let loser
      let winner_name
      let loser_name
  
      function createCanvas() {
        canvas.width = width
        canvas.height = height
      }
  
      function renderIntro() {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, width, height)
  
        ctx.fillStyle = 'white'
        ctx.font = '16px Courier New'
        ctx.textBaseline = 'middle'
        ctx.fillText("Waiting for opponent...", 50, (canvas.height / 2) - 30)
      }

      function renderWinner() {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = 'white'
        ctx.font = '16px Courier New'
        if (score[0] == 3) {
          winner = userIds[1]
          winner_name = players[1]
          loser = userIds[0]
          loser_name = players[0]
          
          ctx.textBaseline = 'middle'
          ctx.fillText(`${players[1]} Wins!`, 60, (canvas.height / 2) - 30)
        }
        if (score[1] == 3) {
          winner = userIds[0]
          winner_name = players[0]
          loser = userIds[1]
          loser_name = players[1]
          
          ctx.textBaseline = 'middle'
          ctx.fillText(`${players[0]} Wins!`, 80, (canvas.height / 2) - 30)
        }
        ctx.textBaseline = 'middle'
        ctx.fillText(`${score[0]} : ${score[1]}`, 125, (canvas.height / 2) - 60)
      }
  
      function renderCanvas() {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, width, height)
  
        ctx.fillStyle = 'white'
  
        // Top paddle
        ctx.fillRect(paddleX[1], 5, paddleWidth, paddleHeight)
  
        // Bottom paddle
        ctx.fillRect(paddleX[0], height - 15, paddleWidth, paddleHeight)
      
  
        // Ball
        ctx.beginPath()
        ctx.arc(ballX, ballY, ballRadius, 2 * Math.PI, false)
        ctx.fillStyle = 'white'
        ctx.fill()
  
        // Score
        ctx.font = "32px Courier New"
        ctx.fillText(score[0], 20, (canvas.height / 2) + 50)
        ctx.fillText(score[1], 20, (canvas.height / 2) - 30)
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
        // Bounce off paddle top
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

        if (score[1] === 3 || score[0] === 3) {
          playAnimation = false
        }
        
        if (isReferee) {
          ballMove()
          ballBoundaries()
        }

        if (playAnimation) {
          renderCanvas()
          window.requestAnimationFrame(animate)
        } else {
          renderWinner()

          setTimeout(async () => {
            
            if (isReferee) {
              
              await postResult()
            }
            
            score = [ 0, 0 ]
            playAnimation = true
            
            window.requestAnimationFrame(animate)
            
          }, 3000)
        }
      }

  
      async function loadGame() {
        createCanvas()
        renderIntro()
        socket = io.connect("ws://localhost:4000")

        await getUsers()

        socket.emit('getData', id, username)
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
        
      })

      socket.on('disconnect', () => {
        console.log(`Disconnected ${socket.id}`);
      })

      socket.on('getData', (ids, users) => {
        userIds = ids
        players = users
        console.log(userIds);
        console.log(players);
      })
  
      socket.on('startGame', (refreeId) => {
        console.log(`Id: ${socket.id}`);
        console.log(`RefereeId: ${refreeId}`);
  
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