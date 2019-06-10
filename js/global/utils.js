function geturl() {
    let href = location.href,
        list = {};
    if (href.indexOf('?') != -1) {
        let params = href.split('?')[1]
        if (params.indexOf('&') != -1) {
            let arr = params.split('&'),
                len = arr.length;
            for (let i = 0; i < len; i++) {
                if (arr[i].indexOf('=') != -1) {
                    let l = arr[i].split('=');
                    list[l[0]] = l[1];
                }
            }
        } else if (params.indexOf('=') != -1) {
            let arr = params.split('=');
            list[arr[0]] = arr[1];
        }
    }
    return list;
}

function showToast(obj = {}) { //提示信息
    let body = document.querySelector('body'),
        ran = parseInt(Math.random() * 100000000),
        div = document.createElement("div");
    obj.type = obj.type || 'error';
    obj.text = obj.text || '';
    div.setAttribute("id", "st" + ran);
    div.setAttribute("class", "showToast " + obj.type);
    div.innerHTML = '<span class="text din fl">' + obj.text + '</span>';
    body.appendChild(div);
    setTimeout(function() {
        body.removeChild(document.querySelector('#st' + ran));
    }, 2000);
}

function loading() { //载入loading
    let body = document.querySelector('body'),
        div = document.createElement("div");
    div.setAttribute("id", "loadingId");
    div.setAttribute("class", "loading");
    div.innerHTML = '<div class="loadEffect"> <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><p>加载中</p>';
    body.appendChild(div);
}

function hideloading() {
    if (document.querySelector('#loadingId')) {
        document.querySelector('body').removeChild(document.querySelector('#loadingId'))
    }
}