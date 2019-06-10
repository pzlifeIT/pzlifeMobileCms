(function(win, doc) {
    let href = window.location.href
    if (href.indexOf('login') == -1) {
        localStorage.setItem("mobile_href", href);
    }
    window.app = {
        requests: function(params) {
            let that = this;
            if (!localStorage.getItem("cms_con_id") & !params.login) {
                that.skiplogin();
                return
            }
            if (!(params.data instanceof FormData) & !params.login) {
                params.data = params.data || {};
                params.data.cms_con_id = localStorage.getItem("cms_con_id") || "";
            } else if (!params.login) {
                params.data.append("cms_con_id", localStorage.getItem("cms_con_id") || "");
            }
            hideloading();
            loading();
            Ajax({
                data: params.data || "",
                url: params.url,
                type: params.type || 'POST',
                success: function(res) {
                    console.log(res);
                    hideloading();
                    if (!params.login & res.code == "5000") {
                        that.skiplogin();
                        return
                    }
                    if (res.code == "200") {
                        typeof params.success == 'function' ? params.success(res) : ''
                    } else if (res.code == "3100") {
                        showToast({
                            text: '没有权限'
                        })
                    } else {
                        typeof params.Error == 'function' ? params.Error(res.code) : '';
                    }
                    typeof params.complete == 'function' ? params.complete(res) : '';
                },
                failed: function(code) {
                    if (typeof params.failed == "function") {
                        params.failed();
                    }
                    hideloading();
                    that.networkerror(code);
                }
            })
        },
        skiplogin() {
            window.location.href = window.location.origin + "/login.html";
        },
        networkerror(code) {
            let text = "";
            switch (parseInt(code)) {
                case 201:
                case 202:
                case 203:
                case 204:
                case 205:
                case 206:
                    text = "服务器无响应";
                    break;
                case 400:
                    text = "错误请求";
                    break;
                case 401:
                    text = "身份验证错误";
                    break;
                case 403:
                    text = "服务器拒绝请求";
                    break;
                case 404:
                case 410:
                    text = "404错误";
                    break;
                case 405:
                    text = "方法禁用";
                    break;
                case 406:
                    text = "不接受请求";
                    break;
                case 407:
                    text = "需要代理授权";
                    break;
                case 408:
                    text = "请求超时";
                    break;
                case 409:
                case 411:
                case 412:
                case 415:
                case 416:
                case 417:
                    text = "请求格式出错";
                    break;
                case 413:
                    text = "请求实体过大";
                    break;
                case 414:
                    text = "请求的URI过长";
                    break;
                case 500:
                case 501:
                case 502:
                case 503:
                case 504:
                case 505:
                    text = "服务器错误";
                    break;
                default:
                    text = "网络错误";
            }
            showToast({
                type: "error",
                text: text
            });
        }
    }
})(window, document);