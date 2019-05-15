var bal = document.getElementsByTagName('input')[0]
var monthly = document.getElementsByTagName('input')[1]
var income = document.getElementsByTagName('input')[2]
var sub = document.getElementsByTagName('button')[0]

/**
 * Checks if the balance is given correctly
 * @param {MouseEvent} e a mouse event
 */
var is_bal_right = function() {
    if (bal.value == "") {
        remove_err(bal)
        console.log('empty')
    }
    var pattern = new RegExp('[a-zA-Z]')
    if (pattern.test(bal.value)) {
        add_err(bal, "This value must be a number")
        console.log('letters detected')
    }else{
        remove_err(bal)
        console.log('everything ok')
    }
}

/**
 * Adds an error to the given HTML element if there aren't
 * any
 * @param {HTMLElement} elem an HTML element
 * @param {String} error the error message
 */
function add_err(elem, error) {
    var children = elem.parentElement.children
    for (i = 0; i < children.length; i++) {
        if (children[i].className == "ErrorMessage") {
            console.log('found child')
            children[i].innerHTML = error
            return error
        }
    }
    var err = document.createElement('p')
    err.style.color = 'red'
    err.style.cssFloat = 'right'
    err.innerHTML = error
    err.className = "ErrorMessage"
    elem.insertAdjacentElement('afterend', err)
    return error
}

/**
 * Removes the error message from the element
 * @param {HTMLElement} elem An HTML element
 * @returns true if error was present removed, false otherwise
 */
function remove_err(elem) {
    var children = elem.parentElement.childNodes
    // console.log(children)
    for (i = 0; i < children.length; i++) {
        if (children[i].className == "ErrorMessage") {
            elem.parentNode.removeChild(children[i])
            return true
        }
    }
    return false
}

bal.oninput = is_bal_right