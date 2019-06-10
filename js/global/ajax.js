let apiHost = apiurl.apiHost
let Ajax = function(params) {
    // 创建ajax对象
    let xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    if ('withCredentials' in xhr) {}
    let url = apiHost;
    url += params.url;
    let type = params.type || 'post';
    type = type.toUpperCase();
    // 用于清除缓存
    let random = Math.random();
    params.data = params.data || '';
    if (!(params.data instanceof FormData) & typeof params.data == 'object' & type == 'POST') {
        params.data = JSON.stringify(params.data);
    }
    if (type == 'GET') {
        let str = '';
        for (let key in params.data) {
            str += key + '=' + params.data[key] + '&';
        }
        params.data = str.replace(/&$/, '');
    }
    if (type == 'GET') {
        if (params.data) {
            xhr.open('GET', url + '?' + params.data, true);
        } else {
            xhr.open('GET', url + '?t=' + random, true);
        }
        xhr.send();

    } else if (type == 'POST') {
        xhr.open('POST', url, true);
        if (params.data instanceof FormData) {
            // xhr.setRequestHeader("Content-type", "multipart/form-data;");
        } else {
            // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded", "charset=utf-8");
            // xhr.setRequestHeader("Access-Control-Allow-Origin", "*", );
            xhr.setRequestHeader("Content-type", "text/plain", "charset=utf-8");
        }
        xhr.send(params.data);
    }

    // 处理返回数据
    xhr.onreadystatechange = function() {
        // console.log(xhr)
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                params.success(JSON.parse(xhr.responseText));
            } else {
                if (typeof params.failed == 'function') {
                    params.failed(xhr.status);
                }
            }
        }
    }
}




// 


// getProvinceCity({
//     type: 'post',
//     success: function(res) {
//         console.log(res)
//     }
// })