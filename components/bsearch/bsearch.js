
var Bsearch = function() {

  function bsearch(arr, value) {
    if (value == null) return bind(arr)
    var min = 0, max = arr.length - 1, left = min, right = max
    while (left <= right) {
      var mid = Math.floor((left + right) / 2)
      if (arr[mid] <= value) {
        if (!arr[mid + 1] || value < arr[mid + 1]) {
          return mid
        } else {
          left = mid + 1
        }
      } else {
        right = mid - 1
      }
    }
    return 0
  }

  function bind(arr) {
    function search(value) {
      return bsearch(arr, value)
    }
    return search
  }

  return bsearch

}()

if (typeof module != 'undefined') module.exports = Bsearch

