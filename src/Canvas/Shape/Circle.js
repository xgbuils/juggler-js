function Circle(options) {
	this.shape = options
}

Circle.prototype.draw = function () {
	var shape = this.shape
	var layer = this.layer
	layer.ctx.beginPath()
	layer.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI)
	layer.ctx.closePath()
	if (shape.fill) {
		layer.ctx.fillStyle = shape.fill
		layer.ctx.fill()
	}
}

Circle.prototype.setX = function (x) {
	this.shape.x = x
}

Circle.prototype.setY = function (y) {
	this.shape.y = y
}