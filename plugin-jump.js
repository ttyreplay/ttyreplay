

function jump(parts) {
  parts = parts.slice()
  parts.sort(function(a, b) {
    return a[0] - b[0]
  })
  var getPartIndex = Bsearch(parts.map(function(a) { return a[0] }))
  var el = $('<p class="jumper"></p>')
    , els = []
  for (var i = 0; i < parts.length; i ++) {
    els[i] = createItem(i)
  }
  function createItem(i) {
    if (i > 0) el.append(' &bull; ')
    var element = $('<a href="javascript://">' + parts[i][1] + '</a>').appendTo(el)
    element.click(function() {
      replay.setFrameNumber(parts[i][0])
    })
    return {
      setActive: function(w) { element[w ? 'addClass' : 'removeClass']('active') }
    }
  }
  var current = null
  replay.on('frame', function(frame) {
    var now = getPartIndex(frame)
    if (now != current && current != null) els[current].setActive(false)
    current = now
    els[current].setActive(true)
  })
  $(function() {
    el.insertBefore('#container')
  })
}


