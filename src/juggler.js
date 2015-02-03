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
        var K = (maximum - attrs.waiting.time) * attrs.interval 
        var width

        if (attrs.width) {
            var k = (attrs.integer_height - attrs.waiting.time) * attrs.interval
            var r = (k*k) / (K*K)
            width = r * attrs.width
        } else {
            var k = (3 - attrs.waiting.time) * attrs.interval
            var r = (k*k) / (K*K)
            width = 1.5 * attrs.height * r
        }

        return {
            width: width,
            gravity: 8 * attrs.height / (K * K),
            shift: attrs.waiting.shift * r,
            radius: attrs.balls.radius * r
        }
    }

    function Juggler(attrs) {
        this.attrs = {}
        this.attrs = extend(true, this.attrs, {
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
            height: 0.8 * attrs.stage/*.attrs*/.height,
            center: {
                x: 0.5 * attrs.stage/*.attrs*/.width,
                y: 0.9 * attrs.stage/*.attrs*/.height,
            },
            layer: attrs.stage
        }, attrs)

        var target = recalculate(this.attrs, this.attrs.integer_height)
        //console.log(target)
        this.attrs.width   = target.width
        this.attrs.gravity = target.gravity
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

        var radius, shift, gravity, width
        var maximum = Math.max.apply(null, pattern)

        if (maximum > attrs.integer_height) {
            var target = recalculate(attrs, maximum)
            //console.log(target)
            width   = target.width
            gravity = target.gravity
            shift   = target.shift
            radius  = target.radius
        } else {
            shift   = attrs.waiting.shift
            width   = attrs.width
            gravity = attrs.gravity
            radius  = attrs.balls.radius
        }

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
            number.period = (number.value - attrs.waiting.time) * attrs.interval 
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

        var y0 = attrs.center.y
        shift /= 2
        var left  = attrs.center.x - (width / 2)
        var right = attrs.center.x + (width / 2)

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
                            fill: attrs.balls.colors[k% attrs.balls.colors.length],
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
            var steps = Math.floor(frame.time / attrs.interval)
            self.balls.forEach(function (ball) {
                var t = frame.time - attrs.interval * ball.start
                if (t >= 0) {
                    t %= ball.cycle * attrs.interval
                    var i = ball.start % numbers.length
                    var pattern
                    while (true) {
                        pattern = numbers[i].value
                        var time = pattern * attrs.interval
                        if (time > t) {
                            break
                        } else {
                            t -= time
                        }
                        i = numbers[i].next
                    }
                    var step = steps - Math.floor(t / attrs.interval)
                    
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
                            ball.figure.setX(left  - shift + 2 * shift * (t - numbers[i].period)/ (attrs.waiting.time * attrs.interval))
                        } else {
                            ball.figure.setX(right + shift - 2 * shift * (t - numbers[i].period)/ (attrs.waiting.time * attrs.interval))
                        }
                        ball.figure.setY(y0)
                    }
                }
            })
            attrs.layer.draw()
        });
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