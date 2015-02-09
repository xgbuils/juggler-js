function Stage (options) {
	this.layers    = []
	var container = this.container = document.getElementById(options.container)
	container.style.position = 'relative'
	container.width  = options.width
	container.height = options.height
	this.width  = parseInt(options.width)
	this.height = parseInt(options.height)
}

Stage.prototype.add = function (layer) {
	var canvas = layer.canvas
	this.layers.push(layer)
	canvas.width  = layer.width  = this.width
	canvas.height = layer.height = this.height
	this.container.appendChild(canvas)
}

module.exports = Stage