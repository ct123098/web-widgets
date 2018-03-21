
var log = console.log.bind(console)
// var canvas = document.querySelector("#Canvas")
// var context = canvas.getContext("2d")

const dx = [-1, 0, 1, 0]
const dy = [0, -1, 0, 1]

var Game = function() {
	var now = {
		width: window.innerWidth - 10,
		height: window.innerHeight - 10,
		fps: 30,

		canvas: null,
		context: null,
	}

	now.init = function() {
		now.canvas = document.createElement("canvas")
		now.context = now.canvas.getContext("2d")
		now.canvas.width = now.width
		now.canvas.height = now.height
		now.canvas.id = "Canvas"
		document.body.appendChild(now.canvas)
	}

	now.init()

	return now
}

var Array2D = function(s1, s2) {
	var now = []
	for(var i = 0; i < s1; i++) {
		now[i] = []
		for(var j = 0; j < s2; j++)
			now[i][j] = null
	}
	return now
}

function plus(p1, p2)
{
	return [p1[0] + p2[0], p1[1] + p2[1]]
}
function minus(p1, p2)
{
	return [p1[0] - p2[0], p1[1] - p2[1]]
}
function dot(p1, p2) {
	return p1[0] * p2[0] + p1[1] * p2[1]
}
function cross(p1, p2) {
	return p1[0] * p2[1] - p1[1] * p2[0]
}

var Shape = function(points) {
	points = points || []
	var now = {
		points: points
	}
	now.inside = function(p) {
		var last = 0
		var n = now.points.length
		for(var i = 0; i < n; i++) {
			var tmp = cross(minus(now.points[i], p), minus(now.points[(i + 1) % n], p))
			if(last * tmp < 0)
				return false
			last = tmp
		}
		return true
	}
	return now
}

var Board = function(game, size) {
	var now = {
		game: game,
		width: Math.min(game.width, game.height),
		height: Math.min(game.width, game.height),

		size: size,
		zoom: Math.min(game.width, game.height) / size,
		shapes: [],

		choose_shape: null,
		choose_pos: null,
	}

	now.init = function() {

		now.game.canvas.addEventListener("mousedown", function(e){
			e.preventDefault()
			var x = e.offsetX, y = e.offsetY
			if(x < 0 || x > now.width || y < 0 || y > now.height)
				return 
			x /= now.zoom
			y /= now.zoom

			for(var i = 0; i < now.shapes.length; i++)
				if(now.shapes[i].inside([x, y])) {
					now.choose_shape = now.shapes[i]
					now.choose_pos = [Math.floor(x), Math.floor(y)]
					// log(choose_shape)
					return 
				}

		}, false)
		now.game.canvas.addEventListener("mousemove", function(e){
			e.preventDefault()
			var x = e.offsetX, y = e.offsetY

			if(x < 0 || x > now.width || y < 0 || y > now.height)
				return 
			if(!now.choose_shape || !now.choose_pos)
				return 

			x = Math.floor(x / now.zoom)
			y = Math.floor(y / now.zoom)

			if(x == now.choose_pos[0] && y == now.choose_pos[1])
				return 

			var points = now.choose_shape.points
			for(var i = 0; i < points.length; i++)
				points[i] = plus(points[i], minus([x, y], now.choose_pos))
			now.choose_pos = [x, y]
			now.draw()

		}, false)
		now.game.canvas.addEventListener("mouseup", function(e){
			e.preventDefault()
			// log(choose_shape)
			now.choose_shape = null
			now.choose_pos = null
		}, false)

		while(now.shapes.length < 6) {
			if(Math.random() < 0.5 || now.shapes.length == 5) {
				var rd = Math.floor(Math.random() * 4)
				var mid = size / 2
				if(rd == 0) {
					var R = Math.floor(Math.random() * 5) + 1
					var H = Math.floor(Math.random() * (now.size - R - R)) + R
					now.insert(Shape([[mid - R, H - R], [mid + R, H - R], [mid + R, H + R], [mid - R, H + R]]))
				}
				else if(rd == 1) {
					var R = Math.floor(Math.random() * 5) + 1
					var H = Math.floor(Math.random() * (now.size - R - R)) + R
					now.insert(Shape([[mid, H - R], [mid + R, H], [mid, H + R], [mid - R, H]]))
				}
				else if(rd == 2) {
					var R = Math.floor(Math.random() * 5) + 1
					var H = Math.floor(Math.random() * (now.size - R)) + R
					now.insert(Shape([[mid, H - R], [mid + R, H], [mid - R, H]]))
				}
				else if(rd == 3) {
					var R = Math.floor(Math.random() * 5) + 1
					var H = Math.floor(Math.random() * (now.size - R))
					now.insert(Shape([[mid, H + R], [mid - R, H], [mid + R, H]]))
				}
			}
			else {
				
			}
		}


		now.draw()
	}

	now.draw = function() {
		var context = now.game.context
		context.clearRect(0, 0, now.width, now.height)
		context.strokeRect(0, 0, now.width, now.height)
		for(var i = 1; i <= now.size - 1; i++)
			for(var j = 1; j <= now.size - 1; j++)
			{
				context.beginPath()
				context.arc(now.zoom * i, now.zoom * j, 2, 0, 2 * Math.PI)
				context.fill()
				// log(now.width / now.size * i, now.height / now.size * j)
			}
		for(var i = 0; i <= now.size - 1; i++)
			for(var j = 0; j <= now.size - 1; j++)
				for(var k = 0; k < 4; k++)
				{
					var times = 0
					var p = [i + 0.5 + 0.25 * dx[k], j + 0.5 + 0.25 * dy[k]]
					for(var l = 0; l < now.shapes.length; l++)
						if(now.shapes[l].inside(p))
							times++
					if(times % 2 == 1)
					{
						// log(p)
						context.beginPath()
						context.moveTo(now.zoom * (i + 0.5), now.zoom * (j + 0.5))
						context.lineTo(now.zoom * (i + 0.5 + 0.5 * (dx[k] + dx[(k + 3) % 4])), now.zoom * (j + 0.5 + 0.5 * (dy[k] + dy[(k + 3) % 4])))
						context.lineTo(now.zoom * (i + 0.5 + 0.5 * (dx[k] + dx[(k + 1) % 4])), now.zoom * (j + 0.5 + 0.5 * (dy[k] + dy[(k + 1) % 4])))
						context.fill()
						context.stroke()
					}
				}
	}

	now.insert = function(shape) {
		now.shapes.push(shape)
		now.draw()
	}
	now.erase = function(shape) {
		for(var i = 0; i < now.shapes.length; i++)
			if(now.shapes[i] == shape) {
				now.shapes.splice(i, 1)
				break
			}
		now.draw()
	}

	now.init()

	return now
}

var _main = function() {
	var game = Game()
	var board = Board(game, 20)
	// var s1 = Shape([[0, 0], [0, 15], [15, 0]])
	// var s2 = Shape([[0, 0], [10, 0], [0, 10]])
	// var s3 = Shape([[4, 0], [8, 4], [4, 8], [0, 4]])
	// board.insert(s1)
	// board.insert(s2)
	// board.insert(s3)
}

window.onload = _main
