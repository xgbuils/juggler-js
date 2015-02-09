(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./rAF.js')

var Animation = function (func) {
    this.func   = func
    this.on     = false
    this.paused = this.played = Date.now()
    this.v      = 1
    this.active = false
}
Animation.prototype = {
    play: function () {
        if (this.func && !this.on) {
            this.played += (Date.now() - this.paused)
            loop.call(this)
            this.active = this.on = true
        }
    },
    pause: function () {
        if (this.func && this.on) {
            cancelAnimationFrame(this.id)
            this.active = this.on = false
            this.paused = Date.now()
        }        
    },
    stop: function () {
        if (this.func) {
            this.pause()
            this.paused = this.played = Date.now()
        }
    },
    seek: function (time) {
        if (this.func) {
            var now     = Date.now()
            this.played = now - time
            this.paused = now
        }
    },
    speed: function (v) {
        if(this.func && isFinite(v)) {
            if (v) {
                v = v / this.v
                var now         = Date.now()
                var diff_played = (now - this.played) / v
                var diff_paused = (now - this.paused) / v
                this.played     = now - diff_played
                this.paused     = now - diff_paused
                this.v *= v
                if (this.active)
                    this.play()
            } else {
                this.pause()
                this.active = true
            }
        }
    },
    remove: function () {
    	if (this.func) {
            this.pause()
            delete this.func
        }
    },
}
function loop () {
    var now = Date.now()
    var frame = {
        time: (now - this.played) * this.v
    }
    this.func(frame)
    this.id = window.requestAnimationFrame(loop.bind(this))
}
module.exports = Animation
},{"./rAF.js":2}],2:[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
function Circle(options) {
	this.shape = options
}

Circle.prototype.draw = function () {
	//console.log('draw circle')
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

module.exports = Circle
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	'use strict';
	if (!obj || toString.call(obj) !== '[object Object]') {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

function extend() {
	'use strict';
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

module.exports = extend
},{}],7:[function(require,module,exports){
var Animation = require('./Animation/Animation.js')
var Circle = require('./Canvas/Shape/Circle.js')
var extend = require('./extend.js')
var Layer = require('./Canvas/Layer.js')
var Stage = require('./Canvas/Stage.js')

var Juggler = (function () {

    var abc = "abcdefghijklmnopqrstuvwxyz"
    var nums = {}
    for (var i = 0; i < 10; ++i) {
        nums[i] = i
    }
    for (var i = 0; i < abc.length; ++i) {
        nums[abc[i]] = i + 10
    }

    function recalculate (attrs, maximum) {
        var juggling = attrs.juggling
        var stage    = attrs.stage
        var K = (maximum - juggling.waiting.time) * juggling.interval 
        var width

        if (stage.width) {
            var k = (juggling.integer_height - juggling.waiting.time) * juggling.interval
            var r = k / K //(k * k) / (K * K)
            width = r * stage.width
            console.log('uu', r)
        } else {
            var k = (3 - juggling.waiting.time) * juggling.interval
            var r = k / K // (k * k) / (K * K)
            width = 1.5 * juggling.height * r
        }

        return {
            width: 0.5 * width,
            gravity: 8 * juggling.height / (K * K),
            shift: juggling.waiting.shift * r,
            radius: juggling.balls.radius * r
        }
    }

    function Juggler(attrs) {
        console.log(attrs.stage)
        this.attrs = {}
        this.attrs = extend(true, this.attrs, {
            stage: {
                width:  500,
                height: 650
            },
            juggling: {
                interval: 500,
                waiting: {
                  time: 0.5,
                  shift: 50,
                },
                integer_height: 5,
                balls: {
                    radius: 10,
                    colors: ['red', 'blue', 'green', 'yellow', 'black', 'orange', 'purple']
                },
                height: 0.8 * attrs.stage.height,
                center: {
                    x: 0.5 * attrs.stage.width,
                    y: 0.9 * attrs.stage.height
                }
            },
            layer: new Layer()
        }, attrs)
        this.attrs.stage = new Stage(this.attrs.stage)
        this.attrs.stage.add(this.attrs.layer)

        var juggling = this.attrs.juggling
        var target = recalculate(this.attrs, this.attrs.juggling.integer_height)

        juggling.width   = target.width
        juggling.gravity = target.gravity
    }

    Juggler.toPattern = function (string) {
        return string.split('').map(function(e) {
            return nums[e]
        })
    }

    Juggler.prototype.setPattern = function (pattern) {
        if (typeof pattern === 'string') {
            pattern = Juggler.toPattern(pattern)
        }

        var attrs = this.attrs
        var stage    = attrs.stage
        var juggling = attrs.juggling

        var radius, shift, gravity, width
        var maximum = Math.max.apply(null, pattern)

        if (maximum > juggling.integer_height) {
            var target = recalculate(attrs, maximum)
            //console.log(target)
            console.log('jhgsdfjkasg')
            width   = target.width
            gravity = target.gravity
            shift   = target.shift
            radius  = target.radius
        } else {
            console.log('eeeeee', juggling.width)
            shift   = juggling.waiting.shift
            width   = juggling.width
            gravity = juggling.gravity
            radius  = juggling.balls.radius
        }
        console.log('width:', width)

        //console.log(width, gravity, radius, shift)
        var num_balls = pattern.reduce(function (a, b) {
          return a + b
        }, 0)

        if (num_balls % pattern.length != 0) {
            throw new Error('El patró es irrealitzable. Es necessita un nombre enter de boles. Actualment: ' + num_balls / pattern.length)
        }

        num_balls /= pattern.length

        var numbers = [] // throws

        for (var i = 0; i < pattern.length; ++i) {
            var number = {}
            number.value  = pattern[i]
            number.next   = (i + number.value) % pattern.length
            number.period = (number.value - juggling.waiting.time) * juggling.interval 
            number.velocity = 0.5 * gravity * number.period
            numbers.push(number)
        }

        for (var i = 0; i < pattern.length; ++i) {
            if (!numbers[i].cycle) {
                var cycle_flags = {}
                var index = i
                var cycle = 0
                while (!cycle_flags[index]) {
                    cycle_flags[index] = true
                    index = numbers[index].next
                    cycle += numbers[index].value
                }
                for (var index in cycle_flags) {
                    numbers[index].cycle = cycle
                }
            }
        }

        var y0 = juggling.center.y
        shift /= 2
        var left  = juggling.center.x - (width / 2)
        var right = juggling.center.x + (width / 2)

        var j = 0
        var jmod = 0
        var i = 0
        var k = 0
        var begin = {}
        this.balls = []

        while (i < num_balls) {
            if (numbers[jmod].value !== 0) {
                if (begin[j] === undefined) {
                    begin[j] = i
                    begin[j + numbers[jmod].value] = i
                    ++i
                    var ball = {
                        figure: new Circle({
                            x: j % 2 === 0 ? left + 15 : right -15,
                            y: y0,
                            radius: radius || 10,
                            fill: juggling.balls.colors[k% juggling.balls.colors.length],
                        }),
                        start: j,
                        cycle: numbers[jmod].cycle
                    }
                    this.balls.push(ball)
                    attrs.layer.add(ball.figure)
                    ++k
                } else {
                    begin[j + numbers[jmod].value] = numbers[jmod].value
                }
            }
            ++j
            jmod = j % numbers.length
        }

        var self = this

        //attrs.stage.add(attrs.layer)          
        attrs.animation = new Animation(function(frame) {
            var steps = Math.floor(frame.time / juggling.interval)
            //console.log(steps)
            self.balls.forEach(function (ball) {
                var t = frame.time - juggling.interval * ball.start
                if (t >= 0) {
                    t %= ball.cycle * juggling.interval
                    var i = ball.start % numbers.length
                    var pattern
                    while (true) {
                        pattern = numbers[i].value
                        var time = pattern * juggling.interval
                        if (time > t) {
                            break
                        } else {
                            t -= time
                        }
                        i = numbers[i].next
                    }
                    var step = steps - Math.floor(t / juggling.interval)
                    
                    if (t < numbers[i].period) {
                        // a l'aire
                        if (numbers[i].value % 2 != 0) {
                            if (step % 2 === 0) {
                                ball.figure.setX(left  + shift + width * t / numbers[i].period)
                            } else {
                                ball.figure.setX(right - shift - width * t / numbers[i].period)
                            }
                        } else {
                            if (step % 2 === 0) {
                                ball.figure.setX(left  + shift - 2 * shift * t / numbers[i].period)
                            } else {
                                ball.figure.setX(right - shift + 2 * shift * t / numbers[i].period)
                            }
                        }
                        ball.figure.setY(y0 - numbers[i].velocity * t + 0.5 * gravity * t * t)
                    } else {
                        // a la mà
                        if ((step + numbers[i].value) % 2 === 0) {
                            ball.figure.setX(left  - shift + 2 * shift * (t - numbers[i].period)/ (juggling.waiting.time * juggling.interval))
                        } else {
                            ball.figure.setX(right + shift - 2 * shift * (t - numbers[i].period)/ (juggling.waiting.time * juggling.interval))
                        }
                        ball.figure.setY(y0)
                    }
                }
            })
            attrs.layer.draw()
        })
    }

    Juggler.prototype.removePattern = function () {
        var self = this
        self.attrs.animation.stop()
        self.attrs.layer.remove()
        //self.attrs.layer = new Kinetic.Layer()
    }

    Juggler.prototype.play = function () {
        this.attrs.animation.play()
    }

    return Juggler
})()

module.exports = Juggler
},{"./Animation/Animation.js":1,"./Canvas/Layer.js":3,"./Canvas/Shape/Circle.js":4,"./Canvas/Stage.js":5,"./extend.js":6}],8:[function(require,module,exports){
var Juggler = require('./juggler.js')
var Stage   = require('./Canvas/Stage.js')
var extend  = require('./extend.js')
/*
      var circle = new Circle({
        x: 100,
        y: 50,
        radius: 20,
        fill: 'red'
      })

      layer.add(circle)

      layer.draw()*/

var input_pattern = document.getElementById('pattern')
var select_pattern = document.getElementById('select')
var input_button = document.getElementById('button')

var juggler = new Juggler({
    stage: {
        container: 'container',
        width: 500,
        height: 650
    }
})

juggler.setPattern('531')
console.log('eoo', extend(true, {}, juggler.balls[0].figure.shape))
juggler.play()

select_pattern.onchange = function () {
    input_pattern.value = select_pattern.value
}

input_button.onclick = function () {
    console.log('eeeo')
    var pattern = input_pattern.value
    juggler.removePattern()
    juggler.setPattern(pattern)
    juggler.play()
}
},{"./Canvas/Stage.js":5,"./extend.js":6,"./juggler.js":7}]},{},[8]);