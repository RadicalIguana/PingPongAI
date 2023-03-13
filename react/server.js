
const express = require('express')
const app = express()
const server= require('http').createServer(app);
const io = require('socket.io')(server,{
    cors:{
        origin: '*',
    }
})


const PORT = 4000;
const HOST = '192.168.0.165'




server.listen(PORT, HOST, ()=>{
    console.log(`Listening on ${HOST}:${PORT} ...`)
});

let readyPlayerCount = 0;

const pongNameSpace = io.of('/pong')    

io.sockets.on('connection', (socket) => {
        let room;
    
        console.log('a user connected', socket.id);

    socket.on('ready', ()=>{
        room = 'room ' + Math.floor(readyPlayerCount/2);
        socket.join(room);
        console.log('Player ready ', socket.id,room);

        readyPlayerCount++;
        console.log(readyPlayerCount)

        if (readyPlayerCount%2 ===0){
            // broadcast
            io.sockets.in(room).emit('startGame', socket.id)
        }
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

