
var log = console.log.bind(console)
// var canvas = document.querySelector("#Canvas")
// var division = document.querySelector("#Division")
// var context = canvas.getContext("2d")

const dx = [-1, 1, 0, 0]
const dy = [0, 0, -1, 1]
const ds = ["left", "right", "bottom", "top"]
const EXPAND = 0.5

var Game = function() {
	var now = {
		width: window.innerWidth - 10,
		height: window.innerHeight - 10,
		fps: 30,

		canvas: null,
		container: null,
	}

	now.init = function() {
		now.canvas = document.createElement("canvas")
		now.canvas.style.width = now.width + "px"
		now.canvas.style.height = now.height + "px"
		now.canvas.id = "Canvas"
		document.body.appendChild(now.canvas)

		now.container = document.createElement("div")
		now.container.style.width = now.width + "px"
		now.container.style.height = now.height + "px"
		now.container.id = "Container"
		document.body.appendChild(now.container)
	}

	now.loop = function() {
		setInterval(function(){
			now.update()
			now.clear()
			now.draw()
		}, 1000 / now.fps)
	}

	now.update = function() {}
	now.clear = function() {}
	now.draw = function() {}

	now.init()
	now.loop()

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

var Cell = function(board, x, y, color) {
	x = x || 0
	y = y || 0
	color = color || 0

	var now = {
		board: board,
		width: board.width / board.columns,
		height: board.height / board.rows,

		x: x,
		y: y,
		color: color,
		adj: [],

		dom: document.createElement("div"),
	}

	now.register = function() {
		now.dom.addEventListener("mouseover", function(e){
			e.preventDefault()
			// log("mouseover")
			now.focus()
		}, false)
		now.dom.addEventListener("mouseout", function(e){
			e.preventDefault()
			// log("mouseout")
			now.blur()
		}, false)
		now.dom.addEventListener("click", function(e){
			e.preventDefault()
			// log("click")
			now.board.eliminate(now.x, now.y)
		}, false)


		now.dom.addEventListener("touchstart", function(e){
			e.preventDefault()
			// log("touchstart")
			now.focus()
		}, false)
		now.dom.addEventListener("touchend", function(e){
			e.preventDefault()
			// log("touchend")
			now.blur()
			now.board.eliminate(now.x, now.y)
		}, false)
	}

	now.update = function() {
		// now.dom.innerHTML = now.color
		now.dom.className = ""
		// log(now.dom.classList)
		now.dom.classList.add("cell")
		now.dom.classList.add("cell-color" + now.color)
		// log(now.dom.classList)

		now.dom.style.width = now.width + "px"
		now.dom.style.height = now.height + "px"

		now.dom.style.left = now.x * now.width + "px"
		now.dom.style.top = (board.rows - 1 - now.y) * now.height + "px"
	}

	now.init = function() {
		now.register()
		now.update()
	}

	now.focus = function() {
		for(var i = 0; i < now.adj.length; i++)
			for(var j = 0; j < 4; j++)
			{
				var xx = now.adj[i].x + dx[j], yy = now.adj[i].y + dy[j];
				if(!now.board.inside(xx, yy) || !now.board.cells[xx][yy] || now.board.cells[xx][yy].color != now.adj[i].color)
					now.adj[i].dom.classList.add("cell-focused-" + ds[j])
			}
	}
	now.blur = function() {
		for(var i = 0; i < now.adj.length; i++)
			for(var j = 0; j < 4; j++)
				now.adj[i].dom.classList.remove("cell-focused-" + ds[j])
	}
	now.hide = function() {
		now.dom.classList.add("cell-hidden")
	}

	return now
}

var Board = function(game, rows, columns, colors) {
	rows = rows || 10
	columns = columns || 10
	colors = colors || 5

	var now = {
		game: game,
		width: Math.min(game.width / columns, game.height / rows) * columns,
		height: Math.min(game.width / columns, game.height / rows) * rows,

		rows: rows,
		columns: columns,
		colors: colors,
		score: 0,
		remain: rows * columns,
		end: false,

		cells: [],
		score_dom: document.createElement("div"),
		dom: document.createElement("div"),
	}


	now.create = function() {
		now.cells = Array2D(now.columns, now.rows)
		for(var i = 0; i < now.columns; i++)
			for(var j = 0; j < now.rows; j++)
				now.cells[i][j] = Cell(now, i, j)
		while(true)
		{
			var list = []
			for(var i = 0; i < now.columns; i++)
				for(var j = 0; j < now.rows; j++)
					if(now.cells[i][j].color == 0)
						list.push(now.cells[i][j])
			// log(list)
			if(list.length == 0)
				break
			var que = []
			que.push(list[Math.floor(Math.random() * list.length)])
			var ncolor = Math.floor(Math.random() * now.colors) + 1
			var expand = 1.0
			while(que.length && Math.random() < expand)
			{
				var cur = que[0]
				que.shift()
				cur.color = ncolor
				for(var i = 0; i < 4; i++)
				{
					var xx = cur.x + dx[i], yy = cur.y + dy[i]
					if(!now.inside(xx, yy))
						continue
					if(now.cells[xx][yy].color)
						continue
					var next = now.cells[xx][yy]
					que.push(next)
				}
				expand *= EXPAND
			}
		}
	}

	now.display = function() {
		now.game.container.innerHTML = ""
		now.dom.innerHTML = ""

		now.dom.style.height = now.height + "px"
		now.dom.style.width = now.width + "px"

		for(var i = 0; i < now.columns; i++)
			for(var j = 0; j < now.rows; j++)
			{
				now.cells[i][j].init()
				now.dom.appendChild(now.cells[i][j].dom)
			}

		now.score_dom.classList.add("score")
		now.score_dom.innerHTML = ""
		now.dom.appendChild(now.score_dom)

		now.game.container.appendChild(now.dom)
	}

	now.update = function() {
		for(var i = 0; i < now.columns; i++)
			for(var j = 0; j < now.rows; j++)
				if(now.cells[i][j])
					now.cells[i][j].update()
		var que = [], vis = Array2D(now.columns, now.rows)
		for(var i = 0; i < now.columns; i++)
			for(var j = 0; j < now.rows; j++)
				if(now.cells[i][j] && !vis[i][j])
				{
					var set = []
					que.push(now.cells[i][j])
					set.push(now.cells[i][j])
					vis[i][j] = true
					while(que.length)
					{
						var cur = que[0]
						que.shift()
						for(var k = 0; k < 4; k++)
						{
							var xx = cur.x + dx[k], yy = cur.y + dy[k]
							if(!now.inside(xx, yy))
								continue
							if(!now.cells[xx][yy]|| now.cells[xx][yy].color != cur.color || vis[xx][yy] )
								continue
							var next = now.cells[xx][yy]
							que.push(next)
							set.push(next)
							vis[xx][yy] = true
						}
					}
					for(var k = 0; k < set.length; k++)
						set[k].adj = (set.length > 1 ? set : [])
				}
		now.end = true
		now.remain = 0
		for(var i = 0; i < now.columns; i++)
			for(var j = 0; j < now.rows; j++)
				if(now.cells[i][j]) {
					now.remain += 1
					if(now.cells[i][j].adj.length)
						now.end = false
				}
		if(now.end && now.remain < 10)
			now.score += 20 * (10 - now.remain) * (10 - now.remain)

		if(!now.end)
			now.score_dom.innerHTML = now.score
		else
			now.score_dom.innerHTML = "游戏结束！" + "剩余" + now.remain + "颗。" + "得分" + now.score + "分。"
	}

	now.init = function() {
		now.create()
		now.display()
		now.update()
	}

	now.inside = function(x, y) {
		return 0 <= x && x < now.columns && 0 <= y && y < now.rows
	}

	now.push_down = function() {
		for(var i = 0; i < now.columns; i++) {
			var k = 0
			for(var j = 0; j < now.rows; j++)
				if(now.cells[i][j]) {
					now.cells[i][k] = now.cells[i][j]
					if(now.cells[i][k]) {
						now.cells[i][k].x = i
						now.cells[i][k].y = k
					}
					k++
				}
			for(var j = k; j < now.rows; j++)
				now.cells[i][j] = null
		}
	}

	now.push_left = function() {
		var k = 0
		for(var i = 0; i < now.columns; i++)
			if(now.cells[i][0]) {
				for(var j = 0; j < now.rows; j++) {
					now.cells[k][j] = now.cells[i][j]
					if(now.cells[k][j]) {
						now.cells[k][j].x = k
						now.cells[k][j].y = j
					}
				}
				k++
		}
		for(var i = k; i < now.columns; i++)
			for(var j = 0; j < now.rows; j++)
				now.cells[i][j] = null
	}

	now.eliminate = function(x, y) {
		var set = now.cells[x][y].adj
		if(set.length <= 0)
			return 
		for(var i = 0; i < set.length; i++) {
			set[i].hide()
			now.cells[set[i].x][set[i].y] = null
		}
		now.score += set.length * set.length
		now.push_down()
		now.push_left()
		now.update()
	}

	now.init()

	return now
}

var _main = function() {
	var game = Game()
	var board = Board(game, 10, 10, 5)
}

window.onload = _main
