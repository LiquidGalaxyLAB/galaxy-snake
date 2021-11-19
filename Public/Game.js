var socket = io.connect({ query: "type=screen" });
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var screenX = window.innerWidth - 2;
var screenY = window.innerHeight - 6;
canvas.width = screenX;
canvas.height = screenY;

var tamGrid = 50;

var widthLimit = canvas.width - (canvas.width % tamGrid);
var heightLimit = canvas.height - (canvas.height % tamGrid);
var screenNumber = 0;
var maxRes = 0;
var screenRes = canvas.width;

var playercount = 0;
var readyPlayers = 0;

// Start of LG Connection
const galaxyPort = 5433
const ip = 'lg1'
const lgSocket = io(`http://${ip}:${galaxyPort}`)
lgSocket.on("reset", () => {
    const url = window.location.href
    const num = url.substring(url.length)
    window.location.href = `http://${ip}:${galaxyPort}/galaxy/basic/screensaver?num=${num}`
})
// End of LG Connection

//Directions
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: -1,
	LEFT: 2,
	RIGHT: -2
};

var Body = {
	new: function (xB, yB) {
		return {
			x: xB,
			y: yB,
			width: tamGrid,
			height: tamGrid,
			speed: 1,
		}
	}
}

var Food = {
	new: function (xF, yF) {
		return {
			x: xF,
			y: yF,
			width: 50,
			height: 50
		}
	}
}

var Color = {
	new: function (hex) {
		return {
			color: hex,
			available: true,

			setSnake: function () {
				this.available = false;
			},

			isAvailable: function () {
				if (this.available)
					return true;
				return false;
			},

			resetSnake: function () {
				this.available = true;
			}
		}
	}
}

var Snake = {
	new: function (idS) {
		return {
			positions: [],
			id: idS,
			dir: DIRECTION.UP,
			ableMove: true,
			ready: false,
			color: null,

			changeDir: function (to) {
				var from = this.dir;
				var retorno = this.dir;
				if (from != to && from * -1 != to && this.ableMove) {
					retorno = to;
					this.ableMove = false;
				}
				this.dir = retorno;
			},

			changeColor: function (c) {
				this.color = c;
			}
		}
	}
}

var Game = {
	initialize: function () {
		this.snakes = [];
		this.colors = [];
		this.countdownTime = 0;
		this.runningCountdown = false;
		this.colors.push(Color.new.call(this, "green"))
		this.colors.push(Color.new.call(this, "red"))
		this.colors.push(Color.new.call(this, "blue"))
		this.colors.push(Color.new.call(this, "yellow"))

		this.xmaxCanvas = Math.floor(widthLimit / tamGrid)
		this.ymaxCanvas = Math.floor(heightLimit / tamGrid)

		this.food = Food.new.call(0, 0);
		this.resetFood();

		this.running = this.over = false;

		SnakeGame.menu();
		SnakeGame.loop();

		socket.on('welcome', function (msg) {
			screenNumber = msg.nScreen
			socket.emit("windowData", { screen: screenNumber, screenResolution: screenRes })
		});

		socket.on('updateNScreens', function (msg) {
			maxRes = msg.maxRes;
			widthLimit = maxRes - (maxRes % tamGrid);
			SnakeGame.xmaxCanvas = Math.floor(widthLimit / tamGrid)
		});
		socket.on('updateNControllers', function (msg) {
			playercount = msg.nControllers;
		})

		socket.on("pDir", function (msg) {
			SnakeGame.snakes.forEach(function (snakeAt) {
				if (snakeAt.id === msg.id) {
					snakeAt.changeDir(msg.dir)
				}
			})
		})

		socket.on("died", function (msg) {
			for (var i = 0; i < SnakeGame.snakes.length; i++) {
				if (SnakeGame.snakes[i].id == msg) {
					SnakeGame.snakes[i].color.resetSnake();
					SnakeGame.snakes.splice(i, 1);
				}
			}
		})

		socket.on('updateData', function (msg) {
			if (screenNumber != 1) {
				SnakeGame.snakes = msg.p;
				SnakeGame.food = msg.food;
				SnakeGame.running = msg.running;
				SnakeGame.over = msg.over;
				readyPlayers = msg.readyPlayers;
				playercount = msg.playercount;
			}
		});

		socket.on('addNewPlayer', function (msg) {
			if (screenNumber == 1) {
				var aux = Snake.new.call(this, msg.id);
				var randomPositions = SnakeGame.randomPosition();
				aux.positions.push(Body.new.call(this, randomPositions[0], randomPositions[1]));
				aux.positions.push(Body.new.call(this, randomPositions[0], randomPositions[1] + tamGrid));
				aux.changeColor(SnakeGame.findAvailableColor());
				aux.color.setSnake();
				SnakeGame.snakes.push(aux);
				socket.emit("color", { hex: aux.color.color, id: msg.id });
			}
		})

		socket.on("ready", function (msg) {
			SnakeGame.snakes.forEach(function (snakeAt) {
				if (msg.id == snakeAt.id) {
					snakeAt.ready = !snakeAt.ready;
				}
			})
		})

		socket.on("restart", function () {
			SnakeGame.resetSnakes();
		})

		socket.on("pause", function (msg) {
			SnakeGame.snakes.forEach(function (snakeAt) {
				if (msg.id == snakeAt.id) {
					snakeAt.ready = false;
				}
			})
		})


		socket.on("decreaseIdScreen", function (msg) {
			if (screenNumber > msg.min)
				screenNumber -= 1;
		})
	},

	randomPosition: function () {
		var b = true;
		var x;
		var y;

		while (b) {
			b = false;
			x = this.randomInt(0, this.xmaxCanvas) * tamGrid;
			y = this.randomInt(0, this.ymaxCanvas) * tamGrid;

			this.snakes.forEach(function (snake) {
				for (var i = 0; i < snake.positions.length; i++) {
					if (x == snake.positions[i].x && this.food.y == snake.positions[i].y)
						b = true;
				}
			});
		}
		return [x, y];
	},

	draw: function () {

		context.clearRect(0, 0, canvas.width, canvas.height);

		//draw the background
		context.fillStyle = '#000000'
		context.fillRect(0, 0, canvas.width, canvas.height);

		//draw the food
		context.fillStyle = '#FFFFFF';
		context.fillRect(this.food.x - (screenRes * (screenNumber - 1)), this.food.y, this.food.width, this.food.height);
		/*const image = document.getElementById('grape');
		context.drawImage(image, this.food.x - (screenRes * (screenNumber -1)),this.food.y,this.food.width,this.food.height);
		*/

		//draw the snake	
		this.snakes.forEach(snakeAt => {
			context.fillStyle = snakeAt.color.color;
			context.strokeStyle = "white";
			for (var i = 0; i < snakeAt.positions.length; i++) {
				var aux = snakeAt.positions[i];
				context.fillRect(aux.x - (screenRes * (screenNumber - 1)), aux.y, aux.width, aux.height)
				context.strokeRect(aux.x - (screenRes * (screenNumber - 1)), aux.y, tamGrid, tamGrid);
			}
		});

		if (this.countdownTime > 0) {
			var boxX = canvas.width / 2;
			var boxY = canvas.height / 2;
			context.font = 'bold 300px Courier new';
			context.fillStyle = '#FFFFFF';
			context.fillText('' + this.countdownTime, boxX - 50, boxY);
		}

	},

	countdown: function (tempo) {
		this.countdownTime = 3;
		this.runningCountdown = true;
		var timer = setInterval(() => {
			SnakeGame.countdownTime -= 1;
			if (SnakeGame.countdownTime <= 0) {
				clearInterval(timer);
				SnakeGame.runningCountdown = false;
			}
		}, tempo);
	},

	loop: function () {
		
		if (screenNumber == 1) {
		var bool = true;
		var auxReady = playercount;
		SnakeGame.snakes.forEach(function (snakeaAt) {
			if (!snakeaAt.ready) {
				bool = false;
				auxReady -= 1;
			}
		})

		if (auxReady <= playercount - 1)
			SnakeGame.countdownTime = -1;

		if (SnakeGame.countdownTime > 0 && !SnakeGame.runningCountdown)
			SnakeGame.countdown(1000);

		if (playercount > 0 && bool) {
			if (!SnakeGame.runningCountdown && !SnakeGame.running)
				SnakeGame.countdownTime = 3;
			SnakeGame.running = true;
			SnakeGame.over = false;
		}
		else
			SnakeGame.running = false;

			readyPlayers = auxReady;
			socket.emit("updateData", {
				p: SnakeGame.snakes,
				food: SnakeGame.food,
				running: SnakeGame.running,
				over: SnakeGame.over,
				playercount: playercount,
				readyPlayers: readyPlayers
			})
		}
		if (SnakeGame.runningCountdown || SnakeGame.countdownTime > 0)
			SnakeGame.draw();
		else if (SnakeGame.running && !SnakeGame.over) {
			SnakeGame.draw();
			SnakeGame.update();
		}
		else {
			SnakeGame.menu();
		}
		if (!this.over) {
			setTimeout(function () {
				requestAnimationFrame(SnakeGame.loop)
			}, 100);
		}
	},

	update: function () {
		if (screenNumber == 1) {
			this.snakes.forEach(function (snakeAt) {
				//old position of the head
				var oldPosX = snakeAt.positions[0].x;
				var oldPosY = snakeAt.positions[0].y;

				//movement of the snake
				if (snakeAt.dir === DIRECTION.UP)
					oldPosY -= (tamGrid);
				else if (snakeAt.dir === DIRECTION.DOWN)
					oldPosY += (tamGrid);

				if (snakeAt.dir === DIRECTION.LEFT)
					oldPosX -= tamGrid;
				else if (snakeAt.dir === DIRECTION.RIGHT)
					oldPosX += tamGrid;

				if (oldPosX >= widthLimit)
					oldPosX = 0;
				else if (oldPosX <= -tamGrid)
					oldPosX = widthLimit - tamGrid;

				if (oldPosY >= heightLimit)
					oldPosY = 0;
				else if (oldPosY <= -tamGrid)
					oldPosY = heightLimit - tamGrid;

				SnakeGame.snakes.forEach(function (snakeAt2) {
					//snake collision with itself
					var overSnakes = [];
					for (var i = 1; i < snakeAt2.positions.length; i++) {
						if ((snakeAt.positions[0].x) == (snakeAt2.positions[i].x) && (snakeAt.positions[0].y) == (snakeAt2.positions[i].y)) {
							overSnakes.push(snakeAt.id);

						}
					}

					overSnakes.forEach(function (i) {
						socket.emit('died', i);
					})
				})

				//food logic
				if (snakeAt.positions[0].x == SnakeGame.food.x && snakeAt.positions[0].y == SnakeGame.food.y) {
					SnakeGame.resetFood();
				}
				else
					snakeAt.positions.pop();


				snakeAt.positions.unshift(Body.new.call(this, oldPosX, oldPosY));

				snakeAt.ableMove = true;
			})


		}
	},

	resetFood: function () {
		var b = true;

		while (b) {
			b = false;
			this.food.x = this.randomInt(0, this.xmaxCanvas) * tamGrid;
			this.food.y = this.randomInt(0, this.ymaxCanvas) * tamGrid;

			this.snakes.forEach(function (snakeAt) {
				for (var i = 0; i < snakeAt.positions.length; i++) {
					if (SnakeGame.food.x == snakeAt.positions[i].x && SnakeGame.food.y == snakeAt.positions[i].y)
						b = true;
				}
			})
		}
	},

	resetSnakes: function () {
		SnakeGame.snakes.forEach(snakeAt => {
			snakeAt.positions.splice(1, snakeAt.positions.length - 2);
			snakeAt.ready = false;
		})
	},

	resetAll: function () {
		this.resetFood();
	},

	menu: function () {
		//draws a background
		context.fillStyle = '#000000'
		context.fillRect(0, 0, canvas.width, canvas.height);

		var menuType = 'screen';
		var boxW = 400;
		var boxH = 100;
		var boxX = canvas.width / 2 - (boxW / 2);
		var boxY = canvas.height / 2 - (boxH / 2);

		if (menuType == 'screen') {
			context.font = 'bold 50px Courier new';
			context.fillStyle = '#FFFFFF';
			context.fillText('WAITING PLAYERS', boxX, boxY, boxW, boxH);
			context.fillText('Connected players: ', boxX, boxY + boxH, boxW, boxH);
			context.fillText(playercount, boxX + boxW, boxY + boxH, boxW, boxH);
			context.fillText('Players ready for game: ', boxX, boxY + (2 * boxH), boxW, boxH);
			context.fillText(readyPlayers, boxX + boxW, boxY + (2 * boxH), boxW, boxH);
		}

	},

	onGameOver: function (winner) {
		if (winner) {
			console.log("We have a winner = " + winner.id + ", Score: " + winner.positions.length)
		}
		else {
			console.log("Everybody Died, you lose")
		}

		SnakeGame.over = true;
		SnakeGame.running = false;
	},

	randomInt: function (min, max) {
		var random = Math.floor(Math.random() * (max - min) + min)
		return random;
	},

	findAvailableColor: function () {

		for (var i = 0; i < this.colors.length; i++) {
			if (this.colors[i].isAvailable()) {
				return this.colors[i];
			}
		}
		return null;
	}
};

SnakeGame = Object.assign({}, Game);
SnakeGame.initialize();