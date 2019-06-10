(function(win, doc) {
    let user = document.querySelector('#user'),
        pwd = document.querySelector('#pwd'),
        loginBtn = document.querySelector('#loginBtn');
    document.onkeydown = function(e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            loginBtn.click()
        }
    }
    loginBtn.onclick = function() {
        let userVal = user.value,
            pwdVal = pwd.value;
        if (!userVal) {
            showToast({
                text: '请输入用户名'
            })
            return
        }
        if (!pwdVal) {
            showToast({
                text: '请输入密码'
            })
            return
        }
        login(userVal, pwdVal)
    }

    function login(user = '', pwd = '') {
        app.requests({
            url: 'admin/login',
            data: {
                admin_name: user,
                passwd: pwd
            },
            login: true,
            success(res) {
                let href = localStorage.getItem("mobile_href");
                localStorage.setItem("cms_con_id", res.cms_con_id);
                window.location.href = href || window.location.origin + '/lucky.html'
            },
            Error(code) {
                switch (parseInt(code)) {
                    case 3002:
                        showToast({
                            text: '用户不存在'
                        })
                        break;
                    case 3003:
                        showToast({
                            text: '密码错误'
                        })
                        break;
                    case 3004:
                        showToast({
                            text: '登录失败'
                        })
                        break;
                    default:
                        showToast({
                            text: '意料之外的错误'
                        })
                }

            }
        })
    }
})(window, document)