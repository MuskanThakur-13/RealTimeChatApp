// Server side
//Node server which will handle socket io connections
const express = require("express");
const app = express();

const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });


const users={};

app.get('/', function(req, res){
  res.sendFile("./index.html", {root : __dirname});
});

io.on('connection',socket =>{
    socket.on('new-user-joined', name =>{
      console.log("New user", name)
      users[socket.id] = name;
      socket.broadcast.emit('user-joined',name);
    });

    socket.on('send',message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id] })
    });


    socket.on('disconnect', message =>{
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    });

}) 

app.listen(5000, ()=>{
  console.log("app runs")
})