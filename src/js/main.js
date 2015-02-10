var Juggler = require('./juggler.js')
var Stage   = require('./Canvas/Stage.js')
var extend  = require('./extend.js')

var changePattern = false
var changeColors  = false

var input_pattern = document.getElementById('pattern')
var select_pattern = document.getElementById('select')
var button = {
  play:  document.getElementById('play'),
  stop:  document.getElementById('stop'),
  speed: document.getElementById('speed'),
}

var input = {
  color: document.getElementById('color')
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
    changePattern = true
    button.play.value = 'play'
    pause = true
}



var pause  = false
input_pattern.oninput = function () {
  changePattern = true
  button.play.value = 'play'
  pause = true
}

button.play.onclick = function () {
    if (changePattern || changeColors) {
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
    changePattern = false
}

button.stop.onclick = function () {
    juggler.stop()
    button.play.value = 'play'
    pause = true
    changePattern = true
}

button.speed.oninput = function () {
    var speed = parseFloat(this.value)
    juggler.speed(speed)
}

input.color.oninput = function () {
    changeColors = true
    var colors = this.value.split(',').map(function (color) {
      return color.trim()
    })
    console.log(colors)
    juggler.colors(colors)
}