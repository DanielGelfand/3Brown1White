/**@type {HTMLInputElement} */
var goal = document.getElementById('goal') // text
/**@type {HTMLInputElement} */
var end_goal = document.getElementById('goal_price') // floating number


var keep_first_char = function(e) {
    var curr = e['target']
    console.log(curr.value)
    var sanitized = curr.value.replace(/[^0-9.]/g, '')
    console.log(sanitized)
    curr.value = '$' + sanitized
}

end_goal.addEventListener('keyup', keep_first_char )