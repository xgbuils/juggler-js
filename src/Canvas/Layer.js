function Layer(options) {
	this.shapes    = []
	this.container = document.getElementById(options.container)
	this.container.style.position = 'relative'
	this.canvas    = document.createElement('canvas')
	this.canvas.width  = options.width
	this.canvas.height = options.height
	this.width  = options.width
	this.height = options.height
	this.container.appendChild(this.canvas)
    this.ctx       = this.canvas.getContext('2d')
}

Layer.prototype.add = function (shape) {
	this.shapes.push(shape)
	shape.layer = this
}

Layer.prototype.draw = function (shape) {
	this.clear()
	this.shapes.forEach(function (shape) {
		shape.draw()
	})
	this.ctx.stroke()
}

Layer.prototype.clear = function (shape) {
	this.ctx.clearRect(0,0,this.width, this.height)
}

Layer.prototype.remove = function (shape) {
	this.clear()
	this.shapes.forEach(function (shape) {
		delete shape.layer
	})
	this.shapes = []
}