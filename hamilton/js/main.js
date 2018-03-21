
var log = console.log.bind(console)
var canvas = document.querySelector("#Canvas")
var context = canvas.getContext("2d")

var width = 750
var height = 750
var n = 10
var points = []
var trace = []
var vis = [], cur = []
var best = [], bestv = 1e100
var end = false

function distance2(p1, p2)
{
	return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
}
function distance(p1, p2)
{
	return Math.sqrt(distance2(p1, p2))
}

function check() {
	var ret = 0
	for(var i = 0; i < n; i++)
		ret += distance(points[cur[i]], points[cur[(i + 1) % n]])
	if(ret < bestv) {
		bestv = ret
		for(var i = 0; i < n; i++)
			best[i] = cur[i]
	}
}

function search(h) {
	if(h == n) {
		check(cur)
		return 
	}
	for(var i = 0; i < n; i++)
		if(!vis[i]) {
			vis[i] = true
			cur[h] = i
			search(h + 1)
			vis[i] = false
		}
}

function solve() {
	vis = new Array(n)
	cur[0] = 0
	vis[0] = true
	search(1)
	log(best, bestv)
	for(var i = 0; i < n; i++) {
		context.strokeStyle = "red";
		context.beginPath()
	    context.moveTo(points[best[i]].x, points[best[i]].y);
	    context.lineTo(points[best[(i + 1) % n]].x, points[best[(i + 1) % n]].y);
		context.stroke()
	}
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);  
	for(var i = 0; i < n; i++) {
		context.beginPath()
		context.arc(points[i].x, points[i].y, 10, 0, 2 * Math.PI, 0)
		context.stroke()
	}
	for(var i = 1; i < trace.length; i++) {
		context.beginPath()
	    context.moveTo(points[trace[i - 1]].x, points[trace[i - 1]].y);
	    context.lineTo(points[trace[i]].x, points[trace[i]].y);
		context.stroke()
	}
	if(trace.length == n) {
		context.beginPath()
	    context.moveTo(points[trace[trace.length - 1]].x, points[trace[trace.length - 1]].y);
	    context.lineTo(points[trace[0]].x, points[trace[0]].y);
		context.stroke()
		if(!end) {
			end = true
			solve()
		}
	}
	else {
		context.beginPath()
		context.arc(points[trace[trace.length - 1]].x, points[trace[trace.length - 1]].y, 10, 0, 2 * Math.PI, 0)
		context.fill()
	}
}

function _main() {

	for(var i = 0; i < n; i++) {
		var p = {x: Math.random() * width, y: Math.random() * height}
		var flag = true
		for(var j = 0; j < i; j++)
			if(distance2(p, points[j]) <= 30 * 30) {
				flag = false
				break
			}
		if(!flag) {
			i--
			continue
		}
		points.push(p)
	}
	trace.push(0)
	draw()
	// solve()

	canvas.addEventListener("click", function(e){
		e.preventDefault()
		var x = e.offsetX, y = e.offsetY
		var tar = -1
		for(var i = 0; i < n; i++)
			if(distance2({x: x, y: y}, points[i]) <= 10 * 10) {
				tar = i
				break
			}
		if(tar >= 0) {
			var flag = true
			for(var i = 0; i < trace.length; i++)
				if(trace[i] == tar) {
					flag = false
					break
				}
			if(flag)
				trace.push(tar)
		}
		draw()
	}, false)

}

// entrance
window.onload = _main
