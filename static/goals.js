/**@type {HTMLInputElement} */
var goal = document.getElementById('goal') // text
/**@type {HTMLInputElement} */
var end_goal = document.getElementById('goal_price') // floating number
var curr_bal = document.getElementById('bal')
var curr_inc = document.getElementById('inc')
var slider = document.getElementById('time') // the slider
var output = document.getElementById('value')
var submit = document.getElementsByName("Submit")[0]

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
  var percent = (v / curr_bal.innerHTML) * 100
  console.log(percent)
  var children = end_goal.parentElement.children
  for (i = 0; i < children.length; i++) {
    if (children[i].className == "percentage") {
      children[i].innerHTML = `${percent.toFixed(1)}% of current balance<br>Current Balance: $${Number(curr_bal.innerHTML).toFixed(2)}`
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
  thing.innerHTML = `${percent.toFixed(1)}% of current balance<br>Current Balance: $${Number(curr_bal.innerHTML).toFixed(2)}`
  thing.className = "percentage"
  end_goal.insertAdjacentElement('afterend', thing)
  return
}
output.innerHTML = `${slider.value}%`

var income_check = function() {
  output.innerHTML = `${slider.value}%`
  if (curr_inc.innerHTML == "") {
    console.log("Curr inc not working")
    return
  }
  /**
   * Income: $xxx
   * Save to goal per month: $xxx
   */
  console.log(`Curr inc`)
  console.log(curr_inc)
  var saved_per_month = (slider.value / 100) * curr_inc.innerHTML
  saved_per_month = saved_per_month.toFixed(2)
  var formatted_string = `You have an income of $${Number(curr_inc.innerHTML).toFixed(2)}.
  <br><b>You have selected to save $${saved_per_month} each month</b>`
  var children = slider.parentElement.children
  for (i = 0; i < children.length; i++) {
    if (children[i].className == "slidersave") {
      children[i].innerHTML = formatted_string
      return
    }
  }
  var slider_percentage = document.createElement('p')
  slider_percentage.innerHTML = formatted_string
  slider_percentage.className = "slidersave"
  slider.insertAdjacentElement('afterend', slider_percentage)
  return
}
var check = function (e) {
  var err = document.createElement('p')
  err.style.color = "red"
  err.className = "error"
  err.innerHTML = "There was an error in the form. Please check it over"
  var sub = document.getElementsByName('Submit')[0]
  var is_err = false

  if (goal.value == "") {
    e.preventDefault()
    is_err = true
    err.innerHTML += "<br><b>Error with goal name</b>"
  }
  if (end_goal.value == "$") {
    e.preventDefault()
    is_err = true
    err.innerHTML += "<br><b>Error with goal price</b>"
  }
  if (is_err) {
    var s = sub.nextElementSibling
    console.log(s)
    if (s) {
      if (s.className == "error") {
        s.innerHTML = err.innerHTML
      }
    } else {
      sub.insertAdjacentElement('afterend', err)
    }
  }
}

end_goal.addEventListener('keyup', keep_first_char )
end_goal.addEventListener('keyup', percentage )
submit.addEventListener('click', check )
slider.addEventListener('input', income_check )