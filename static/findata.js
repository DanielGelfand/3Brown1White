var bal = document.getElementById('balance')
var monthly = document.getElementById('monthly')
var income = document.getElementById('income')
var daily = document.getElementById('daily')
var btn = document.getElementById('adder')
var m_btn = document.getElementById('month_adder')
var count = document.getElementsByName('expense-name').length + 1
var m_count = document.getElementsByName('monthly-name').length + 1


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

var addMonthlyExpense = function () {
    var rate = document.createElement('select')
    rate.name = "m_importance"
    for (i = 0; i < 10; i++) {
        var child = document.createElement('option')
        child.value = i + 1
        child.innerHTML = i + 1
        rate.appendChild(child)
    }
    var description = document.createElement('p')
    description.innerHTML = "Select your importance: "


    var input = document.createElement('input')
    var nm = document.createElement('input')
    nm.className = 'form-control'
    nm.required = true
    nm.type = "text"
    nm.name = "monthly-name"
    nm.placeholder = "Rent, Bills, etc."

    m_count += 1
    input.className = "form-control"
    input.required = true
    input.type = "text"
    input.name = `Monthly Expenditure ${m_count}`
    input.placeholder = input.name
    input.value = "$"
    input.addEventListener('keyup', keep_first_char)
    input.addEventListener('keyup', m_add_all)
    m_btn.insertAdjacentElement('beforebegin', document.createElement('br'))
    m_btn.insertAdjacentElement('beforebegin', nm )
    m_btn.insertAdjacentElement('beforebegin', input )
    m_btn.insertAdjacentElement('beforebegin', rate )
    rate.insertAdjacentElement('beforebegin', description )
    m_btn.insertAdjacentElement('beforebegin', document.createElement('br'))
    input = document.getElementsByName(input.name)[0]
}

var addExpense = function() {
    var rate = document.createElement('select')
    rate.name = "importance"
    for (i = 0; i < 10; i++) {
        var child = document.createElement('option')
        child.value = i + 1
        child.innerHTML = i + 1
        rate.appendChild(child)
    }
    var description = document.createElement('p')
    description.innerHTML = "Select your importance: "

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
    btn.insertAdjacentElement('beforebegin', rate )
    rate.insertAdjacentElement('beforebegin', description )
    btn.insertAdjacentElement('beforebegin', document.createElement('br'))
    input = document.getElementsByName(input.name)[0]
    // input.oninput = is_daily_right(input)
}

var removeMonthlyExpense = function() {
    if (m_count <= 1) { return }
    m_count -= 1
    var b = document.getElementById('mon')
    var children = b.children
    var w = children[1]
    var br = children[1]
    var t = children[1]
    var p = children[1]
    var r = children[1]
    for (var i = 0; i < children.length; i++) {
        console.log(children[i])
        console.log(children[i].tagName)
        if (children[i].tagName.toLowerCase() == "input" && children[i].name.startsWith('Monthly Exp')) {
            // console.log(children[i])
            w = children[i]
        }
        if (children[i].tagName.toLowerCase() == "br") {
            br = children[i]
        }
        if (children[i].name == 'monthly-name') {
            t = children[i]
        }
        if (children[i].tagName.toLowerCase() == "select") {
            r = children[i]
        }
        if (children[i].tagName.toLowerCase() == "p") {
            p = children[i]
        }
    }
    w.remove()
    br.remove()
    t.remove()
    p.remove()
    r.remove()
}
var removeExpense = function() {
    if (count <= 1) { return }
    count -= 1
    var b = document.getElementById('exp')
    var children = b.children
    var w = children[1]
    var br = children[1]
    var t = children[1]
    var p = children[1]
    var r = children[1]
    for (i = 0; i < children.length; i++) {
        console.log(children[i])
        console.log(children[i].tagName)
        if (children[i].tagName.toLowerCase() == "input" && children[i].name.startsWith('Expenditure')) {
            // console.log(children[i])
            console.log(`This is the input:`)
            console.log(children[i])
            w = children[i]
        }
        if (children[i].tagName.toLowerCase() == "br") {
            br = children[i]
        }
        if (children[i].name == 'expense-name') {
            t = children[i]
        }
        if (children[i].tagName.toLowerCase() == "select") {
            r = children[i]
        }
        if (children[i].tagName.toLowerCase() == "p") {
            p = children[i]
        }
    }
    w.remove()
    br.remove()
    t.remove()
    p.remove()
    r.remove()
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

var keep_char = function() {
    var w = document.getElementsByName('monthly-name')
    var s = document.getElementsByName('expense-name')
    var larger = w.length > s.length ? w.length : s.length
    for (i = 0; i < larger; i++) {
        console.log(`Currently: ${i}`)
        if (i < w.length) {
            console.log(w[i])
            w[i].nextElementSibling.addEventListener('keyup', keep_first_char)
            w[i].nextElementSibling.addEventListener('keyup', keep_first_char)
        }
        if (i < s.length) {
            console.log(s[i])
            s[i].nextElementSibling.addEventListener('keyup', keep_first_char)
        }
    }
}

var add_to_dict = function() {
    var total = {}
    var s = daily.parentElement.children
    for (i = 0; i < s.length; i++) {
        if (s[i].name == "expense-name") {
            total[i] = [s[i].value, s[i + 1].value.slice(1)]
        }
    }
    if (document.getElementsByName('all-inputs').length > 0) {
        document.getElementsByName('all-inputs')[0].value = JSON.stringify(total)
    }else{
        var send = document.createElement('input')
        send.value = JSON.stringify(total)
        send.hidden = true
        send.name = 'all-inputs'
        daily.parentElement.appendChild(send)
    }
    var i_total = {}
    var important = document.getElementsByName('importance')
    var names = document.getElementsByName('expense-name')
    for (i = 0; i < important.length; i++) {
        // console.log(names[i].value)
        i_total[i] = [names[i].value, important[i][important[i].selectedIndex].text]
    }
    console.log(i_total)


    var m_total = {}
    var w = monthly.parentElement.children
    for (i = 0; i < w.length; i++) {
        if (w[i].name == "monthly-name") {
            console.log(w[i])
            m_total[i] = [w[i].value, w[i + 1].value.slice(1)]
        }
    }
    console.log(document.getElementsByName('monthly-inputs'))
    if (document.getElementsByName('monthly-inputs').length > 0) {
        document.getElementsByName('monthly-inputs')[0].value = JSON.stringify(m_total)
    }else{
        var m_send = document.createElement('input')
        m_send.value = JSON.stringify(m_total)
        m_send.hidden = true
        m_send.name = 'monthly-inputs'
        monthly.parentElement.appendChild(m_send)
    }
    var im_total = {}
    var m_important = document.getElementsByName('m_importance')
    var m_names = document.getElementsByName('monthly-name')
    for (i = 0; i < m_important.length; i++) {
        // console.log(names[i].value)
        im_total[i] = [m_names[i].value, m_important[i][m_important[i].selectedIndex].text]
    }
    console.log(im_total)
    var d = document.createElement('input')
    var m = document.createElement('input')
    d.hidden = true
    m.hidden = true
    d.value = JSON.stringify(i_total)
    m.value = JSON.stringify(im_total)
    d.name = "daily-importance"
    m.name = "monthly-importance"
    daily.parentElement.appendChild(d)
    monthly.parentElement.appendChild(m)
}

var m_add_all = function() {
  var s = monthly.parentElement.children
  var sum = 0
  for (i = 0; i < s.length; i++) {
    if (s[i].name == "monthly-name") {
      console.log(`Starting on ${i}`)
      console.log(s[i + 1].value)
      var excess = s[i + 1].value.substring(s[i + 1].value.indexOf('.') + 1, s[i + 1].value.length).indexOf('.')
      if (excess != -1) {
        var w = s[i + 1].value
        w = w.substring(0, w.lastIndexOf('.')) + w.substring(w.lastIndexOf('.') + 1, w.length)
        s[i + 1].value = w
      }
      sum += Number(s[i + 1].value.slice(1).replace(/([^.0-9])+/g, ''))
    }
  }
  monthly.value = `$${sum}`
}

var add_all = function() {
    var s = daily.parentElement.children
    var sum = 0
    for (i = 0; i < s.length; i++) {
        if (s[i].name == "expense-name") {
            console.log(`Starting on ${i}`)
            console.log(s[i + 1].value)
            var excess = s[i + 1].value.substring(s[i + 1].value.indexOf('.') + 1, s[i + 1].value.length).indexOf('.')
            if (excess != -1) {
                var w = s[i + 1].value
                w = w.substring(0, w.lastIndexOf('.')) + w.substring(w.lastIndexOf('.') + 1, w.length)
                s[i + 1].value = w
            }
            sum += Number(s[i + 1].value.slice(1).replace(/([^.0-9])+/g, ''))
        }
    }
    daily.value = `$${sum}`
}

var check = function(e) {
    var err = document.createElement('p')
    err.style.color = "red"
    err.className = "error"
    err.innerHTML = "There was an error in the form. Please check it over"
    var sub = document.getElementsByName('Submit')[0]
    var is_err = false

    if (bal.value == "$") {
        e.preventDefault()
        err.innerHTML += "<br><b>Error with balance</b>"
        is_err = true
    }
    if (income.value == "$") {
        e.preventDefault()
        err.innerHTML += "<br><b>Error with income</b>"
        is_err = true
    }
    var t = document.getElementsByName('expense-name')
    for (i = 0; i < count - 1; i++) {
        if (t[i].nextElementSibling.value == "$") {
            e.preventDefault()
            err.innerHTML += "<br><b>Error with daily expenditures</b>"
            is_err = true
            break
        }
    }
    t = document.getElementsByName('monthly-name')
    for (i = 0; i < m_count - 1; i++) {
        if (t[i].nextElementSibling.value == "$") {
            e.preventDefault()
            err.innerHTML += "<br><b>Error with monthly costs</b>"
            is_err = true
            break
        }
    }
    if (is_err) {
        var s = sub.nextElementSibling
        console.log(s)
        if (s) {
            if (s.className == "error") {
                s.innerHTML = err.innerHTML
            }
        }else{
            sub.insertAdjacentElement('afterend', err)
        }
    }
}
bal.oninput = is_bal_right
monthly.oninput = is_monthly_right
income.oninput = is_income_right
// daily.oninput = is_daily_right
keep_char()

bal.addEventListener('keyup', keep_first_char )
monthly.addEventListener('keyup', keep_first_char )
income.addEventListener('keyup', keep_first_char )
// daily.addEventListener('keyup', keep_first_char )
daily.addEventListener('keyup', add_all )
document.getElementsByName('Submit')[0].addEventListener('click', add_to_dict )
document.getElementsByName('Submit')[0].addEventListener('click', check )