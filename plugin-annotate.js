
function annotate(list) {
  var map = {}
    , showing = false
  function getPause(i) {
    return 1000 + list[i][1].length * 50
  }
  for (var i = 0; i < list.length; i ++) {
    replay.setPause(list[i][0], getPause(i))
    map[list[i][0]] = list[i][1]
  }
  replay.on('frame', function(frame) {
    setTimeout(function() {
      if (!map[frame] && showing) {
        hide()
      } else if (map[frame]) {
        show(map[frame])
      }
    }, 15)
  })
  var el = $('<div class="annotation"></div>')
    , txt = $('<span class="text"></span>').appendTo(el)
    , nub = $('<div class="nub"></div>').appendTo(el)
  function hide() {
    showing = false
    el.fadeOut('fast')
  }
  function show(text) {
    var cursor = $('#terminal .cursor')[0]
    if (!cursor) return
    showing = true
    var parent = cursor.offsetParent
      , top = cursor.offsetTop
      , left = cursor.offsetLeft + cursor.offsetWidth
    console.log(cursor.offsetLeft, cursor.offsetWidth, left)
    txt.text(text)
    el.remove().stop().css({'opacity':0,'top':0,'left':0}).appendTo(document.body).show()
    top += (cursor.offsetHeight - el[0].offsetHeight) / 2
    left += 8
    el.css({'opacity':1,'top':top,'left':left}).appendTo(parent)
  }
}










