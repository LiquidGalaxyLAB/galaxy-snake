var socket = io.connect({query:"type=controller"});
var id;
var cor;
var url = document.URL;
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: -1,
	LEFT: 2,
	RIGHT: -2
};

socket.on("ping", function(){
	socket.emit("pongaa", id)
})

socket.on("color", function(msg){
	cor = msg.hex;
	if(id == msg.id)
		document.getElementById("topo").style.backgroundColor = cor;
})


socket.on("died", function(msg){
	if(msg == id)
	{
		document.getElementById("topo").style.backgroundColor = "grey";
		alert("You Died.");
	}

	
})

socket.on("welcomeController",function(msg){
	id = msg.nController;
})

const options = {
    color: "green",
    zone: document.querySelector('.zone'),
    mode: "static",
    position: { left: "50%", top: "50%"}
}

var manager = nipplejs.create(options);
manager.on("dir", function (evt, data) {
	var direction = data.direction;
	console.log(direction)
	if(direction.angle == "left") {
		vib(100);
		socket.emit("pDir", {dir:DIRECTION.LEFT, id:id});
	} else if(direction.angle == "right") {
		vib(100);
		socket.emit("pDir", {dir:DIRECTION.RIGHT, id:id});
	} else if(direction.angle == "up") {
		vib(100);
		socket.emit("pDir", {dir:DIRECTION.UP, id:id});
	} else if(direction.angle == "down") {
		vib(100);
		socket.emit("pDir", {dir:DIRECTION.DOWN, id:id});
	}
})

function onBtnPauseClickEvent(){
	vib(100);
	socket.emit("pause", {id : id});
}

function onBtnReadyClickEvent(){
	vib(100);
	socket.emit("ready",{id: id});
}

function onBtnRestartClickEvent(){
	vib(300);
	socket.emit("died", id)
	console.log('Died: '+id)
	socket.emit("restart")
	socket.disconnect();
	location.href = url;
}


function vib(time)
{
	if(window.navigator.vibrate)
		window.navigator.vibrate(time);
}