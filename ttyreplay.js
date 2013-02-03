
var replay = new EventEmitter()

replay.options = {
  speed: 1
, maxIdle: 1000
, autoPlay: true
, showFrameNumber: false
}


function loadFrames(frames) {
  replay.frames = frames
}

function configure(options) {
  for (var k in options) {
    if (options.hasOwnProperty(k)) {
      replay.options[k] = options[k]
    }
  }
}

function twoDigits(a) {
  return (a < 10 ? '0' : '') + a
}

function formatTime(msc) {
  return twoDigits(Math.floor(msc / 60000)) + ':' + twoDigits(Math.floor(msc % 60000 / 1000))
}

function css(code) {
  var style = document.createElement('style')
  style.textContent = code
  document.getElementsByTagName('head')[0].appendChild(style)
}

// pausing system
;(function() {
  var pauses = {}
  function getPause(frame) {
    return pauses[frame] || 0
  }
  function setPause(frame, duration) {
    pauses[frame] = Math.max(getPause(frame), duration)
  }
  replay.getPause = getPause
  replay.setPause = setPause
})()

// when load
$(function() {

  var frames = replay.frames

  var el = document.getElementById('terminal')
    , buf = new DisplayBuffer(el)

  // function: initialize data
  function init() {
    var pos = 0
    for (var i = 0; i < frames.length; i ++) {
      var frame = frames[i]
        , next = frames[i + 1]
        , length, speed
      frame.position = pos
      if (next != null) {
        length = Math.max(
          replay.getPause(i)
        , Math.min(
            replay.options.maxIdle
          , (next.time - frame.time) / replay.options.speed
          )
        )
        speed = (next.time - frame.time) / length / replay.options.speed
      } else {
        length = 0
        speed = 1
      }
      frame.length = length
      frame.speed = speed
      pos += length
    }
    duration = pos
  }

  // expose a method to replay object
  function expose(obj, name, as) {
    if (!as) as = name
    replay[as] = function() {
      return obj[name].apply(obj, arguments)
    }
  }

  // emit events on the replay
  function emit() {
    replay.emit.apply(replay, arguments)
  }

  // make the buffer perform commands
  function perform(operations) {
    for (var i = 0; i < operations.length; i ++) {
      var operation = operations[i]
      buf[operation[0]].apply(buf, operation.slice(1))
    }
  }

  // our code logic
  init()

  // quick lookup of frame index from position
  var frameIndex = Bsearch(frames.map(function(f) { return f.position }))

  // the player object: manage current time
  var player = {
    playing: false
  , startTime: null
  , startPosition: 0
  , play: function() {
      if (this.playing) return
      this.startPosition = this.getPosition()
      this.startTime = new Date().getTime()
      this.playing = true
      clearInterval(this.interval)
      this.interval = setInterval(update, 16)
      emit('play')
    }
  , stop: function() {
      if (!this.playing) return
      this.startPosition = this.getPosition()
      this.startTime = new Date().getTime()
      this.playing = false
      clearInterval(this.interval)
      emit('stop')
    }
  , setPosition: function(pos) {
      this.startTime = new Date().getTime()
      this.startPosition = pos
      update()
    }
  , getPosition: function() {
      return Math.max(0, Math.min(this.startPosition + (this.playing ? new Date().getTime() - this.startTime : 0), duration))
    }
  , isPlaying: function() {
      return this.playing
    }
  }

  expose(player, 'play')
  expose(player, 'stop')
  expose(player, 'setPosition')
  expose(player, 'getPosition')
  expose(player, 'isPlaying')

  replay.getDuration = function() {
    return duration
  }
  replay.toggle = function() {
    if (replay.isPlaying()) replay.stop(); else replay.play()
  }
  replay.setFrameNumber = function(i) {
    replay.setPosition(replay.frames[i].position)
  }

  // show frame by index
  var showFrame = function() {
    var lastShownFrame = -1
      , currentFrame = 0
    replay.getFrameNumber = function() {
      return currentFrame
    }
    return function showFrame(index) {
      if (index == lastShownFrame) return
      currentFrame = index
      replay.frame = frames[index]
      emit('frame', index)
      var start = index
      for (; start >= 0; start --) {
        if (start == lastShownFrame + 1) break;
        if (frames[start].key) break;
      }
      for (var i = start; i <= index; i ++) {
        perform(frames[i].ops)
      }
      lastShownFrame = index
    }
  }()

  // updater
  var update = function() {
    var date = new Date()
    replay.getTime = function() {
      return date.getTime()
    }
    return function update() {
      var position = player.getPosition()
      var index = frameIndex(position)
      showFrame(index)
      var f = frames[index]
        , next = frames[index + 1]
      date.setTime(f.time + (next == null ? 0 : (position - f.position) / (next.position - f.position) * (next.time - f.time)))
      emit('update', position)
    }
  }()

  setTimeout(function() {
    update()
    if (replay.options.autoPlay) {
      setTimeout(function() { player.play() }, 100)
    }
  }, 1)

})

// slider code
$(function() {
  var state = false
    , slider = $('#slider')
  function mousedown(e) {
    if (state) return
    state = true
    replay.stop()
    return mousemove(e)
  }
  function mousemove(e) {
    if (!state) return
    replay.setPosition((e.pageX - slider.offset().left) / slider.width() * duration)
    return false
  }
  function mouseup() {
    if (!state) return
    state = false
    replay.play()
    return false
  }
  var date = new Date()

  replay.on('update', function() {
    date.setTime(replay.getTime())
    $('#time').text(date.toString())
    var positionText = formatTime(replay.getPosition()) + ' / '
                     + formatTime(replay.getDuration())
    if (replay.options.showFrameNumber) {
      positionText = '[' + replay.getFrameNumber() + '] ' + positionText
    }
    $('#position').text(positionText)
    $('#thumb').css('width', replay.getPosition() / replay.getDuration() * 100 + '%')
  })

  $('#slider').on('mousedown', mousedown)
  $(document).on('mousemove', mousemove).on('mouseup', mouseup)
  var button = $('#play-pause-button')
  button.mousedown(function() {
    replay.toggle()
    return false
  })
  
  function updatePlaying() {
    if (replay.isPlaying()) {
      button.addClass('playing').html('\u275a\u275a')
    } else {
      button.removeClass('playing').html('\u25b6')
    }
  }
  replay.on('play', updatePlaying)
  replay.on('stop', updatePlaying)
  updatePlaying()

})

$(document).keydown(function(e) {
  if (e.which == 32) {
    replay.toggle()
    return false
  }
  if (e.which == 37) {
    replay.stop()
    replay.setFrameNumber(replay.getFrameNumber() - 1)
    return false
  }
  if (e.which == 39) {
    replay.stop()
    replay.setFrameNumber(replay.getFrameNumber() + 1)
    return false
  }
})







