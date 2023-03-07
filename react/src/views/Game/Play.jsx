import { ReactP5Wrapper } from "react-p5-wrapper";
import io from 'socket.io-client'

function Player(p5, x) {
  
  this.x = x
  this.y = p5.height / 2
  this.velocity = 4
  this.w = 20
  this.h = 80
  this.top = this.x - this.h/2
  this.bottom = this.x + this.h/2
  this.points = 0

  this.show = (p5) => {
    p5.fill(255)
    p5.rectMode(p5.CENTER)
    p5.rect(this.x, this.y, this.w, this.h)
  }

  this.move = (p5) => {
    if (this.y < p5.mouseY) 
      this.y += this.velocity
    else if (this.y > p5.mouseY) 
      this.y -= this.velocity
  }
}

function Ball(p5, x, y, xv, yv, r) {
  this.x = x
  this.y = y
  this.xv = xv
  this.yv = yv
  this.r = r

  this.show = (p5) => {
    p5.fill(255)
    p5.ellipse(this.x, this.y, 15, 15)
  }

  this.move = (p5) => {
    if (this.y < 1) {
      this.yv = 5
    } 
    if (this.y >= p5.height) {
      this.yv = -5
    }
    this.y += this.yv
    this.x += this.xv

  }

  this.collision = function(p5, p){
    var r = p5.floor(p5.random(2));
    if(this.y <= p.y + p.h/2 && this.y >= p.y - p.h/2){
      if (this.x >= p.top && this.x <= p.bottom){
        if(r === 1)
            if(this.y-p.y < 0)
              this.yv = 5;
            else if(this.y - p.y == 0)
              this.yv = 0;
            else
              this.yv = -5;
        return true;
      }
    } 
    return false;
  }
}

function sketch(p5) {
  let socket
  let p
  let b
  let players = []
  let go = false
  let counter = 0
  
  p5.setup = () => {
    socket = io.connect('http://192.168.43.180:3001');
    p5.createCanvas(750,500);
    b = new Ball(p5.width/2, p5.height/2, 4, 4, 15);
    socket.on('getCounter', (data) => {
    counter = data;
    if(p === undefined){
      if(counter % 2 === 0 )
        p = new Player(p5, 0);
      else
        p = new Player(p5, p5.width);
    }
    var data = {
    x:p.x,
    y:p.y,
    v:p.velocity,
    w:p.w,
    h:p.h,
    points:p.points
  };
  socket.emit('start', data);

  var data = {
    x:b.x,
    y:b.y,
    xv:b.xv,
    yv:b.yv,
    r:b.r
  };
  socket.emit('startBall', data);
  
  if(counter === 2){
    go = true;
  }
  });
      

  socket.on('heartbeat', (data) => {
    players = data;
  });

  socket.on('heartbeatBall', (data) => {
    if(data !== null){
      b.x = data.x,
      b.y = data.y,
      b.xv = data.xv,
      b.yv = data.yv,
      b.r = data.r
  }
  });

}

  p5.draw = () => {
    p5.background(0);
    p5.rect(p5.width/2,0,5,1000);
    p5.fill(255)
    p5.textSize(40);
    if(go === false)
      p5.text("Waiting for other player.", p5.width/2 - 200, p5.height/2);
      p5.fill(255);
    if(go === true){
    for(var i = 0; i < players.length; i++){
      var id = players[i].id;
      if(id !== socket.id){
        p5.fill(255,0,0);
        p5.rectMode(p5.CENTER);
        p5.rect(players[i].x,players[i].y,players[i].w,players[i].h);
      }
    }
    showPoints(p5, players);
    p.show(p5);
    p.move(p5);
    b.show(p5);
    b.move(p5);
    if(b.collision(p5, p) && p.x === 0)
      b.xv = 4;
    if(b.collision(p5, p) && p.x === p5.width)
      b.xv = -4;
    if(b.x < 0){
      throwBall(p5, b);
      if(p.x === p5.width)
        p.points++;
    }
    if(b.x > p5.width){
        throwBall(p5, b);
        if(p.x === 0)
          p.points++;
    }
    var data = {
    x:p.x,
    y:p.y,
    w:p.w,
    h:p.h,
    points:p.points
    };

  socket.emit('update',data);

  var data = {
    x:b.x,
    y:b.y,
    xv:b.xv,
    yv:b.yv,
    r:b.r
  };
  socket.emit('updateBall',data);
}}
}

function throwBall(p5, b) {
  b.x = p5.width / 2
  b.y = p5.height / 2
}

function showPoints(p5, p){
  p5.textSize(80);
  p5.fill(0, 102, 153);
  for(var i = 0; i < p.length; i++){
    if(p[i].points !== undefined){
      if(p[i].x === 0)
        p5.text(p[i].points.toString(), p5.width/2 - 100, p5.height-100);
      else
        p5.text(p[i].points.toString(), p5.width/2 + 100, p5.height-100);
    }
  }
}

export default function Play() {

    return <ReactP5Wrapper sketch={sketch} />

}