var bal = document.getElementsByTagName('input')[0]
var monthly = document.getElementsByTagName('input')[1]
var income = document.getElementsByTagName('input')[2]
var sub = document.getElementsByTagName('button')[0]


var pattern = new RegExp('([+-]?([0-9]*[.])?[0-9]+)')
/**
 * Checks if the balance is given correctly
 * @param {MouseEvent} e a mouse event
 */
var is_bal_right = function() {
    if (bal.value == "") {
        remove_err(bal)
        console.log('empty')
    }
    if (!(pattern.test(bal.value))) {
        add_err(bal, "This value must be a number.", 1)
        console.log('letters detected')
    }else{
        remove_err(bal, 1)
        console.log('everything ok')
    }
    if (!errCheck()) {
      sub.disabled = false
    }else{
      sub.disabled = true
    }
}

var is_monthly_right = function() {
    if (monthly.value == "") {
        remove_err(monthly)
        console.log('empty')
    }
    if (!(pattern.test(monthly.value))) {
        add_err(monthly, "This value must be a number.", 2)
        console.log('letters detected')
    }else{
        remove_err(monthly, 2)
	       if (!errCheck()) {
        	  sub.disabled = false
    	   }else{
        	  sub.disabled = true
    	   }
        console.log('everything ok')
    }
}

var is_income_right = function() {
    if (income.value == "") {
        remove_err(bal)
        console.log('empty')
    }
    if (!(pattern.test(income.value))) {
        add_err(income, "This value must be a number.", 3)
        console.log('letters detected')
    }else{
        remove_err(income, 3)
	      if (!errCheck()) {
        	 sub.disabled = false
    	  }else{
        	 sub.disabled = true
    	  }
        console.log('everything ok')
    }
}

/**
 * Adds an error to the given HTML element if there aren't
 * any
 * @param {HTMLElement} elem an HTML element
 * @param {String} error the error message
 */
function add_err(elem, error, id) {
    var children = elem.parentElement.children
    for (i = 0; i < children.length; i++) {
        if (children[i].className == `ErrorMessage${id}`) {
            console.log('found child')
            children[i].innerHTML = error
            return error
        }
    }
    /*if (errCheck()) {
	console.log("makeing false")
        sub.disabled = false
    }else{
	console.log('makeing true')
        sub.disabled = true
    }*/
    var err = document.createElement('p')
    err.style.color = 'red'
    err.style.paddingLeft = "10px"
    err.style.display = "inline"
    err.innerHTML = error
    err.className = `ErrorMessage${id}`
    elem.insertAdjacentElement('afterend', err)
    return error
}

/**
 * Removes the error message from the element
 * @param {HTMLElement} elem An HTML element
 * @returns true if error was present removed, false otherwise
 */
function remove_err(elem, id) {
    var children = elem.parentElement.childNodes
    if (errCheck()) {
        sub.disabled = false
    }else{
        sub.disabled = true
    }
    // console.log(children)
    for (i = 0; i < children.length; i++) {
        if (children[i].className == `ErrorMessage${id}`) {
            elem.parentNode.removeChild(children[i])
            return true
        }
    }
    return false
}

/**
 * Checks if there are any errors
 */
function errCheck() {
    var list = []
    list.push(document.getElementsByClassName('ErrorMessage1')[0])
    list.push(document.getElementsByClassName('ErrorMessage2')[0])
    list.push(document.getElementsByClassName('ErrorMessage3')[0])
    console.log(list)
    var errs = false
    for (i = 0; i < list.length; i++) {
      console.log(list[i])
      if (list[i] != undefined) {
        errs = true
      }
    }
    console.log(errs)
    return errs
}
bal.oninput = is_bal_right
monthly.oninput = is_monthly_right
income.oninput = is_income_right
