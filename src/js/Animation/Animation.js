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