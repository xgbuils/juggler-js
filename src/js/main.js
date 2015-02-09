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
var button = {
  play:  document.getElementById('play'),
  stop:  document.getElementById('stop'),
  speed: document.getElementById('speed')
}

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
    change = true
    button.play.value = 'play'
    pause = true
}


var change = false
var pause  = false
input_pattern.oninput = function () {
  change = true
  button.play.value = 'play'
  pause = true
}

button.play.onclick = function () {
    if (change) {
      var pattern = input_pattern.value
      juggler.removePattern()
      juggler.setPattern(pattern)
    }
    if (pause) { 
        juggler.play()
        this.value = 'pause'
    } else {
        juggler.pause()
        this.value = 'play'
    }
    pause = !pause
    change = false
}

button.stop.onclick = function () {
    juggler.stop()
    button.play.value = 'play'
    pause = true
    change = true
}

button.speed.oninput = function () {
    var speed = parseFloat(this.value)
    juggler.speed(speed)
}