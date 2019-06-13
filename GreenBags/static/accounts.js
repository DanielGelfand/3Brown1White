var coll = document.getElementsByClassName("collapsible");
for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("hov");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

var password = document.getElementById('pwd')
var user = document.getElementById('usr')
var account_hov = document.getElementsByClassName('collapsible')[0]
var fin_check = document.getElementById('check1')
var goal_check = document.getElementById('check2')
var in_check = document.getElementById('check3')
var del = document.getElementById('del')
var sub_btn = document.getElementById('sub')
var curr_user = user.value
var err_list = {"user": false, "pass":false}


function has_errs() {
    for (item in err_list) {
        if (err_list[item]) {
            sub_btn.disabled = true
            return true
        }
    }
    sub_btn.disabled = false
    return false
}
var pass_change = function() {
    var check = document.createElement('input')
    check.type = "password"
    check.id = "check"
    check.style.display = "inline-block"
    var confirm = document.createElement('p')
    confirm.style.display = "inline-block"
    confirm.innerHTML = "&emsp;&emsp;Confirm Password:"
    check.addEventListener('input', check_pass )
    if (password.value == "") {
        if (document.getElementById('check') != undefined) {
            document.getElementById('check').remove()
            document.getElementById('confirm').remove()
        }
        return
    }
    if (document.getElementById('check') == undefined) {
        check.id = "check"
        confirm.id = "confirm"
        password.insertAdjacentElement('afterend', check)
        password.insertAdjacentElement('afterend', confirm)
    }
}

var default_user = function() {
    if (user.value == "") {
        user.value = curr_user
    }
}

var user_available = function() {
    var usrs = document.getElementById('usr-list')
    console.log(usrs)
    var list = []
    var parsed = JSON.parse(usrs.innerHTML)
    for (i = 0; i < parsed.length; i++) {
        list.push(parsed[i][0]) // list now is ['user1', 'user2', 'user3',...]
    }
    console.log(list)

    if (list.includes(user.value)) {
        console.log('user in list')
        if (user.value == curr_user) {
            return
        }
        if (document.getElementsByClassName('user error').length == 0) {
            var err = document.createElement('p')
            err.style.color = "red"
            err.innerHTML = "Username already taken"
            err.style.fontSize = "10px"
            err.className = "user error"
            err.style.display = "inline-block"
            user.insertAdjacentElement('afterend', err)
        }
        err_list['user'] = true
    }else{
        if (document.getElementsByClassName('user error').length != 0) {
            document.getElementsByClassName('user error')[0].remove()
        }
        err_list['user'] = false
    }
    has_errs()
}

var check_pass = function() {
    var confirm = document.getElementById("check")
    var err = document.createElement('div')
    err.style.fontSize = "10px"
    err.style.color = "red"
    err.style.display = "inline-block"
    err.innerHTML = "Passwords do not match"

    if (password.value == "") {
        if (document.getElementsByClassName('alert alert-danger error').length != 0) {
            document.getElementsByClassName('alert alert-danger error')[0].remove()
        }
    }
    if (confirm.value != password.value) {
        err_list['pass'] = true
        if (document.getElementsByClassName('alert alert-danger error').length != 0) {
            return
        }
        err.className = "alert alert-danger error"
        user.nextElementSibling.remove()
        user.insertAdjacentElement('afterend', err)
    }else{
        err_list['pass'] = false
        if (document.getElementsByClassName('alert alert-danger error') != 0) {
            document.getElementsByClassName('alert alert-danger error')[0].remove()
            user.insertAdjacentElement('afterend', document.createElement('br'))
        }
    }
    has_errs()
}

var del_acc = function() {
    var s = window.confirm("Are you sure that you want to delete your user? This is permanent and will delete everything")
    if (s) {
        window.location.pathname = '/del'
    }
}

var add_to_dict = function() {
    var total = {
        "username":user.value,
        "password":password.value,
        "reset":{
            "FINANCES":fin_check.checked,
            "GOALS":goal_check.checked,
            "SACRIFICES":in_check.checked
        }
    }
    if (document.getElementsByName('all-options').length != 0) {
        document.getElementsByName('all-options')[0].value = JSON.stringify(total)
        return
    }else{
        var send = document.createElement('input')
        send.value = JSON.stringify(total)
        send.hidden = true
        send.name = 'all-options'
        sub_btn.parentElement.appendChild(send)
    }
    console.log(send.value)
}
password.addEventListener('input', pass_change )
account_hov.addEventListener('click', default_user )
sub_btn.addEventListener('click', add_to_dict )
user.addEventListener('input', user_available )
del.addEventListener('click', del_acc)