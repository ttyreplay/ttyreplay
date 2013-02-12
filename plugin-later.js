
function later() {
  $(function() {
    var el = $('<div class="later"></div>').appendTo('#container')
      , tel =  $('<span class="later-text">n minutes later</span>').appendTo(el).addClass('showing')
    replay.on('frame', function() {
      var idle = replay.frame.idle
      var show = idle >= 10000 && replay.frame.length <= 5000
      if (show) {
        var text, num
        if (idle >= 60000) {
          num = Math.floor(idle / 60000)
          text = num + ' minute' + (num == 1 ? '' : 's')
        } else {
          num = Math.floor(idle / 1000)
          text = num + ' second' + (num == 1 ? '' : 's')
        }
        tel.text(text + ' later')
      }
      el.toggleClass('showing', show)
    })
  })
}
