/**@type {HTMLInputElement} */
var goal = document.getElementById('goal') // text
/**@type {HTMLInputElement} */
var end_goal = document.getElementById('goal_price') // floating number
var curr_bal = document.getElementById('bal')


var keep_first_char = function(e) {
    var curr = e['target']
    console.log(curr.value)
    var sanitized = curr.value.replace(/[^0-9.]/g, '')
    console.log(sanitized)
    curr.value = '$' + sanitized
}

var percentage = function() {
  if (curr_bal.innerHTML == "") {
    return
  }
  var v = end_goal.value.slice(1) ? end_goal.value.slice(1) : 0
  console.log(v)
  var percent = v / curr_bal.innerHTML
  console.log(percent)
  var children = end_goal.parentElement.children
  for (i = 0; i < children.length; i++) {
    if (children[i].className == "percentage") {
      children[i].innerHTML = `${percent.toFixed(1)}% of current balance`
      if (percent > 100) {
        children[i].style.color = "red"
      }else{
        children[i].style.color = "black"
      }
      return
    }
  }
  var thing = document.createElement('p')
  if (percent > 100) {
    thing.style.color = "red"
  }
  thing.innerHTML = `${percent.toFixed(1)}% of current balance`
  thing.className = "percentage"
  end_goal.insertAdjacentElement('afterend', thing)
  return
}
end_goal.addEventListener('keyup', keep_first_char )
end_goal.addEventListener('keyup', percentage )
