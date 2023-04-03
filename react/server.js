

const { log } = require('console');
const express = require('express')
const app = express()
const server= require('http').createServer(app);
const io = require('socket.io')(server,{
    cors:{
        origin: '*',
    }
})


const PORT = 4000;
// const HOST = '192.168.0.7'
const HOST = 'localhost'

// server.listen(PORT, HOST, ()=>{
//     console.log(`Listening on ${HOST}:${PORT} ...`)
// });

server.listen(4000, () => {
    console.log(`Listening on ${PORT}`)
})



let readyPlayerCount = 0;

let usersId = []
let users = []

io.sockets.on('connection', (socket) => {
        let room;

        console.log('a user connected', socket.id);

    socket.on('ready', () => {
        room = 'room ' + Math.floor(readyPlayerCount/2);
        socket.join(room);
        console.log('Player ready ', socket.id, room);
        
        readyPlayerCount++;
        console.log(readyPlayerCount)

        if (readyPlayerCount%2 ===0){
            // broadcast

            let lastTwoUsersId = usersId.slice(-2)
            let lastTwoUsers = users.slice(-2)

            io.sockets.in(room).emit('startGame', socket.id)

            io.sockets.to(room).emit('getData', lastTwoUsersId, lastTwoUsers)

            console.log(users);
            
        }
    })

    socket.on('getData', (id, name) => {
        console.log(name)
        usersId.push(id)
        users.push(name)
    })    

    socket.on('paddleMove', (paddleData)=>{
        socket.to(room).emit('paddleMove', paddleData);
    })

    socket.on('ballMove',(ballData)=>{
        socket.to(room).emit('ballMove',ballData);
    });

    socket.on('disconnect',(reason)=>{
        console.log(`Client ${socket.id} disconnected: ${reason}`)
        socket.leave(room)
    })
})
