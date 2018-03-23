
var log = console.log.bind(console)
var svg = document.querySelector("svg")

var Point = function(x, y) {
	x = x || 0
	y = y || 0
	var now = {}
	now.x = x
	now.y = y
	return now
}
var Vector = Point

function plus(a, b) {
	return Vector(a.x + b.x, a.y + b.y)
}
function minus(a, b) {
	return Vector(a.x - b.x, a.y - b.y)
}
function dot(a, b) {
	return a.x * b.x + a.y * b.y;
}
function cross(a, b) {
	return a.x * b.y - a.y * b.x;
}

var Vertex = function() {
	var now = {}
	now.x = 200 
	now.y = 200
	now.tag = "1"
	now.border = 2
	now.radius = 19
	now.color_fore = "black"
	now.color_back = "white"
	now.dom_shape = document.createElementNS("http://www.w3.org/2000/svg", "circle")
	now.dom_text = document.createElementNS("http://www.w3.org/2000/svg", "text")
	now.init = function() {
		now.render()
		svg.appendChild(now.dom_shape)
		svg.appendChild(now.dom_text)
	}
	now.render = function() {
		now.dom_shape.setAttribute("cx", now.x)
		now.dom_shape.setAttribute("cy", now.y)
		now.dom_shape.setAttribute("r", now.radius)
		now.dom_shape.setAttribute("fill", now.color_back)
		now.dom_shape.setAttribute("stroke", now.color_fore)
		now.dom_shape.setAttribute("stroke-width", now.border)

		now.dom_text.setAttribute("x", now.x)
		now.dom_text.setAttribute("y", now.y)
		now.dom_text.setAttribute("dy", "0.35em")
		now.dom_text.setAttribute("text-anchor", "middle")
		now.dom_text.innerHTML = now.tag
	}
	now.init()
	return now
}

var Edge = function() {

}

function _main() {
	Vertex()
}

window.onload = _main
