function Layer(options) {
	this.shapes    = []
	this.canvas    = document.createElement('canvas')
	this.canvas.style.position = 'absolute'
	this.canvas.style.top  = '0'
	this.canvas.style.left = '0'
    this.ctx       = this.canvas.getContext('2d')
}

var LayerProto = Layer.prototype

LayerProto.add = function (shape) {
	this.shapes.push(shape)
	shape.layer = this
}

LayerProto.draw = function (shape) {
	this.clear()
	this.shapes.forEach(function (shape) {
		shape.draw()
	})
}

var ua = window.navigator.userAgent
var native_android_browser = /android/i.test(ua) && ua.indexOf('534.30')

if (native_android_browser) {
	console.log('native_android_browser')
    LayerProto.clear = function (shape) {
    	this.ctx.clearRect(0, 0, this.width, this.height)
    	// if early version of android browser
    	// fix bug android browsers: 
    	// https://medium.com/@dhashvir/android-4-1-x-stock-browser-canvas-solution-ffcb939af758
    	this.canvas.style.display = 'none'
        this.canvas.offsetHeight
        this.canvas.style.display = 'inherit'
    }
} else {
	LayerProto.clear = function (shape) {
		this.ctx.clearRect(0, 0, this.width, this.height)
	}
}

LayerProto.remove = function (shape) {
	this.clear()
	this.shapes.forEach(function (shape) {
		delete shape.layer
	})
	this.shapes = []
}

module.exports = Layer