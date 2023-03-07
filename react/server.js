var players = [];
var connections = [];
let ball
function Player(id,x,y,v,w,h,p) {
   this.id = id;
   this.x = x;
   this.y = y;
   this.w = w;
   this.h = h;
   this.points = p;
}

function Ball(id,x,y,xv,yv,r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.r = r;
}


var express = require('express'); 
var app = express(); 
var server = app.listen(3001, "192.168.43.180");
console.log("Server listening on port 3001");


var io = require('socket.io')(server, {
    cors:{
        origin: "*"
    }
})


function getCounter(){
	io.sockets.emit('getCounter',connections.length);
	console.log(connections.length);
}

setInterval(heartbeat,33);

function heartbeat(){
	io.sockets.emit('heartbeat',players);
}



setInterval(heartbeatBall,33);

function heartbeatBall(){
	io.sockets.emit('heartbeatBall', ball);
}


io.sockets.on('connection', (socket) => { 
	connections.push(socket);
	getCounter();
	socket.on('start', (data) => {
		let pl = new Player(socket.id,data.x,data.y,data.w,data.h,data.points);
		players.push(pl);
	}); 

	socket.on('startBall', (data) => {
		ball = new Ball(socket.id,data.x,data.y,data.xv,data.yv,data.r);
	}); 

	socket.on('disconnect', (data) => {
		connections.splice(connections.indexOf(socket),1);
		console.log("disconnected");
	});

	socket.on('update', (data) => {
        let player
		for(var i = 0; i < players.length; i++){
			if(socket.id === players[i].id)
				player = players[i];
		}
		player.x = data.x;
		player.y = data.y;
		player.v = data.v;
		player.w = data.w;
		player.h = data.h;
		player.points = data.points;
	}); 

	socket.on('updateBall',function(data){
		ball.x = data.x;
		ball.y = data.y;
		ball.xv = data.xv;
		ball.yv = data.yv;
		ball.r = data.r;
	}); 

});
