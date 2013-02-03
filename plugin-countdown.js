
function countdown(options) {
  var start = options.start
    , end = options.end
    , finish = options.finish
    , hide = options.hide
  var el = $('<div class="countdown"></div>').appendTo('#container')
  replay.on('update', function() {
    var time = replay.getTime()
    if (finish && time > finish) time = finish
    if (end && time > end) time = end
    var finished = time >= finish
    var ff = replay.frame.speed > 2
    el.toggleClass('finished', finished)
      .toggleClass('fast-forward', ff)
      .toggleClass('hidden', time < start || (hide != null && time > hide))
      .text((ff && !finished ? '\u25B6\u25B6 ' : '') + formatTime(end - time))
  })
}
