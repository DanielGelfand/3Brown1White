var bal = document.getElementById('balance')
var monthly = document.getElementById('monthly')
var income = document.getElementById('income')
var daily = document.getElementById('daily')


var pattern = new RegExp('([^.0-9])+')
/**
 * Checks if the balance is given correctly
 * @param {MouseEvent} e a mouse event
 */
var is_bal_right = function () {
    if (bal.value == "") {
        remove_err(bal)
        console.log('empty')
    }
    var excess = bal.value.substring(bal.value.indexOf('.') + 1, bal.value.length).indexOf('.')
    console.log(excess)
    if ((pattern.test(bal.value.slice(1))) || excess != -1) {
        add_err(bal, "This value must be a valid number.", 1)
        console.log('letters detected')
    } else {
        remove_err(bal, 1)
        console.log('everything ok')
    }
}

var is_monthly_right = function () {
    if (monthly.value == "") {
        remove_err(monthly)
        console.log('empty')
    }
    var excess = monthly.value.substring(monthly.value.indexOf('.') + 1, monthly.value.length).indexOf('.')
    if ((pattern.test(monthly.value.slice(1))) || monthly != -1) {
        add_err(monthly, "This value must be a valid number.", 2)
        console.log('letters detected')
    } else {
        remove_err(monthly, 2)
        console.log('everything ok')
    }
}

var is_income_right = function () {
    if (income.value == "") {
        remove_err(income)
        console.log('empty')
    }
    var excess = income.value.substring(income.value.indexOf('.') + 1, income.value.length).indexOf('.')
    if ((pattern.test(income.value.slice(1))) || excess != -1) {
        add_err(income, "This value must be a valid number.", 3)
        console.log('letters detected')
    } else {
        remove_err(income, 3)
        console.log('everything ok')
    }
}

var is_daily_right = function () {
    if (daily.value == "") {
        remove_err(daily)
        console.log('empty')
    }
    var excess = daily.value.substring(daily.value.indexOf('.') + 1, daily.value.length).indexOf('.')
    if ((pattern.test(daily.value.slice(1))) || excess != -1) {
        add_err(daily, "This value must be a valid number.", 4)
        console.log('letters detected')
    } else {
        remove_err(daily, 4)
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
    list.push(document.getElementsByClassName('ErrorMessage4')[0])
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

var keep_first_char = function(e) {
    var curr = e['target']
    console.log(curr.value)
    var sanitized = curr.value.replace(/[^0-9.]/g, '')
    console.log(sanitized)
    curr.value = '$' + sanitized
}

bal.oninput = is_bal_right
monthly.oninput = is_monthly_right
income.oninput = is_income_right
daily.oninput = is_daily_right
bal.addEventListener('keyup', keep_first_char )
monthly.addEventListener('keyup', keep_first_char )
income.addEventListener('keyup', keep_first_char )
daily.addEventListener('keyup', keep_first_char )