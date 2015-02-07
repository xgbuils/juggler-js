var Juggler = require('./juggler.js')
var Layer   = require('./Canvas/Layer.js')
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

var layer = new Layer({
  container: 'container',
  width: 500,
  height: 650
})

var juggler = new Juggler({
    stage: layer,
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