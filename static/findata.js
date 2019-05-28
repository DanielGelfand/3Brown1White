var bal = document.getElementById('balance')
var monthly = document.getElementById('monthly')
var income = document.getElementById('income')
var daily = document.getElementById('daily')
var btn = document.getElementById('adder')
var count = document.getElementsByName('expense-name').length + 1


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
    if ((pattern.test(monthly.value.slice(1))) || excess != -1) {
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

/**
 * Checks if input is correct
 * @param {HTMLElement} input_elem The input element
 */
var is_daily_right = function (input_elem) {
    console.log(input_elem)
    console.log(input_elem.parentElement)
    if (input_elem.value == "") {
        remove_err(input_elem)
        console.log('empty')
    }
    var excess = input_elem.value.substring(input_elem.value.indexOf('.') + 1, input_elem.value.length).indexOf('.')
    if ((pattern.test(input_elem.value.slice(1))) || excess != -1) {
        console.log(`This is input: ${input_elem}`)
        add_err(input_elem, "The value(s) must be a valid number.", 4)
        console.log('letters detected')
    } else {
        remove_err(input_elem, 4)
        console.log('everything ok')
    }
}


var addExpense = function() {
    var input = document.createElement('input')
    var nm = document.createElement('input')
    nm.className = 'form-control'
    nm.required = true
    nm.type = "text"
    nm.name = "expense-name"
    nm.placeholder = "Coffee, bus, etc."

    count += 1
    input.className = "form-control"
    input.required = true
    input.type = "text"
    input.name = `Expenditure ${count}`
    input.placeholder = input.name
    input.value = "$"
    input.addEventListener('keyup', keep_first_char )
    input.addEventListener('keyup', add_all )
    btn.insertAdjacentElement('beforebegin', document.createElement('br'))
    btn.insertAdjacentElement('beforebegin', nm)
    btn.insertAdjacentElement('beforebegin', input)
    input = document.getElementsByName(input.name)[0]
    // input.oninput = is_daily_right(input)
}

var removeExpense = function() {
    if (count <= 1) { return }
    count -= 1
    var b = document.getElementById('exp')
    var children = b.children
    var w = children[1]
    var br = children[1]
    var t = children[1]
    for (var i = 0; i < children.length; i++) {
        console.log(children[i])
        console.log(children[i].tagName)
        if (children[i].tagName.toLowerCase() == "input" && children[i].name != "expense-name") {
            // console.log(children[i])
            w = children[i]
        }
        if (children[i].tagName.toLowerCase() == "br") {
            br = children[i]
        }
        if (children[i].name == 'expense-name') {
            t = children[i]
        }
    }
    w.remove()
    br.remove()
    t.remove()
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
    console.log(elem)
    console.log(elem.parentElement)
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
    var excess = sanitized.lastIndexOf('.')
    var counts = (sanitized.match(/[.]/g) || []).length
    console.log(`counts: ${counts}`)
    if (counts > 1) {
        console.log(excess)
        sanitized = sanitized.substring(0, excess) + sanitized.substring(excess + 1, sanitized.length)

    }
    console.log(sanitized)
    curr.value = '$' + sanitized
}

var add_to_dict = function() {
    var total = {}
    var s = daily.parentElement.children
    for (i = 0; i < s.length; i++) {
        if (s[i].name == "expense-name") {
            total[i] = [s[i].value, s[i + 1].value.slice(1)]
        }
    }
    var send = document.createElement('input')
    send.value = JSON.stringify(total)
    send.hidden = true
    send.name = 'all-inputs'
    daily.parentElement.appendChild(send)
}

var add_all = function() {
    var s = daily.parentElement.children
    var sum = 0
    for (i = 0; i < s.length; i++) {
        if (s[i].name == "expense-name") {
            console.log(`Starting on ${i}`)
            console.log(s[i + 1].value)
            sum += Number(s[i + 1].value.slice(1).replace(/[^0-9]/g, ''))
        }
    }
    daily.value = `$${sum}`
}
bal.oninput = is_bal_right
monthly.oninput = is_monthly_right
income.oninput = is_income_right
// daily.oninput = is_daily_right

bal.addEventListener('keyup', keep_first_char )
monthly.addEventListener('keyup', keep_first_char )
income.addEventListener('keyup', keep_first_char )
// daily.addEventListener('keyup', keep_first_char )
daily.addEventListener('keyup', add_all )
document.getElementsByName('Submit')[0].addEventListener('click', add_to_dict )
