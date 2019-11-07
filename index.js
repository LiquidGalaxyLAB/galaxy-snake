var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const exec = require('child_process').exec
var url=require('url');

var maxRes = 0


var clients = [];
function client( id, socketId, screen, screenSize){
  this.id = id;
  this.socketId = socketId;
  this.screen = screen;
  this.screenSize = screenSize;
}

var controllers = [];
var Controller = {
	new: function(idC){
		return{
      id:idC,
      resp:true
		}
	}
}

function message( screen, nScreen){
  this.screen = screen;
  this.nScreen = nScreen;
}
var nScreens = 0
var nControllers = 0;
var auxResp = 0;
app.use(express.static(__dirname+'/Public'));
app.get('/screen', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/', function(req, res){
  res.writeHead(301, {Location:"http://192.168.0.155:8114/controller"}); //hardcoded ip address
  res.end();
});
setInterval(() => {
  if(controllers.length != auxResp)
  {
    for(var i=0; i < controllers.length; i++)
    {
      if(!controllers[i].resp)
      {
        io.emit('died',controllers[i].id)
        dropController(controllers[i].id)
        i--;
      }
      else
        controllers[i].resp = false;
    }

    auxResp = 0;
  }
  io.emit("ping")

  io.emit('updateNControllers',{nControllers:nControllers});
}, 1000);

function dropController(id){
  for(var i=0; i < controllers.length; i++)
  {
    if(controllers[i].id == id)
    {
      nControllers--;
      console.log("Morreu: ", id)
      controllers.splice(i,1);
      break;
    }
  }
}

io.on('connection', function(socket){
  //welcome process
  if(socket.handshake.query['type'] == "screen")
  {
    nScreens+=1;
    socket.emit("welcome", {nScreen : nScreens , nScreens : nScreens})
  }
  else if(socket.handshake.query['type'] == "controller")
  {
    if(nControllers < 4){
      nControllers += 1;

      controllers.push(Controller.new.call(this, socket.id));
      socket.emit("welcomeController", {nController : socket.id})
      io.emit('updateNControllers',{nControllers:nControllers});
      io.emit("addNewPlayer",{id:socket.id})
    }
    else
      console.log("max de players atingido");
    
  }

  socket.on("windowData", function(msg){
      maxRes += msg.screenResolution;
      clients.push(new client(nScreens,socket.id,msg.screen, msg.screenResolution))
      io.emit('updateNScreens', {nScreens : nScreens , maxRes : maxRes})
  })

  socket.on("updateData", function(msg){
    io.emit("updateData", msg)
  })
  
	socket.on("pDir", function(msg){
		io.emit("pDir", msg);
  })
  
  socket.on("play", function(){
    io.emit("play")
  })

  socket.on("pause", function(msg){
    io.emit("pause",msg)
  })
  
  socket.on("fps", function(){
    io.emit("fps")
  })

  socket.on("pongaa", function(msg){
    auxResp++;
    for(var i=0; i<controllers.length; i++)
    {
      if(controllers[i].id == msg)
      {
        controllers[i].resp = true;
      }
    }
  })

  socket.on("died", function(msg)
  {
    io.emit("died", msg)
    dropController(msg);
  })

  socket.on("ready",function(msg){
    io.emit("ready",msg);
  })

  socket.on("restart", function(){
    io.emit("restart");
  })
  
  socket.on("color", function(msg){
    io.emit("color", msg);
  })
  
  //send to the last socket
  socket.on('disconnect', function(){
    if(socket.handshake.query['type'] == "screen"){
      nScreens -= 1;
      var aux = null;
      clients.forEach(function(client){
        if (socket.id == client.socketId){
          aux = client;
          maxRes -= client.screenSize;
        }
        if(aux != null && client.id > aux.id)
        {
          client.screen-=1;
          client.id -= 1;
        }
      })
      if(aux != null)
        clients.splice(aux.id-1,1)
      io.emit('updateNScreens', {nScreens : nScreens , maxRes : maxRes})
      io.emit("decreaseIdScreen", {min : aux.screen})
    }
    else if(socket.handshake.query['type'] == "controller")
    {
    }
  });
});


http.listen(8114,function(){
  console.log("Listening on port 8114!")
});
