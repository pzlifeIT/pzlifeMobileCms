let geturl = function() {
    let href = location.href,
        list = {}
    if (href.indexOf('?') != -1) {
        let params = href.split('?')[1]
        if (params.indexOf('&') != -1) {
            let arr = params.split('&'),
                len = arr.length
            for (let i = 0; i < len; i++) {
                if (arr[i].indexOf('=') != -1) {
                    let l = arr[i].split('=')
                    list[l[0]] = l[1]
                }
            }
        } else if (params.indexOf('=') != -1) {
            let arr = params.split('=')
            list[arr[0]] = arr[1]
        }
    }
    return list
}
let showToast = function(obj = {}) { //提示信息
    let body = document.querySelector('body'),
        ran = parseInt(Math.random() * 100000000),
        div = document.createElement("div");
    obj.type = obj.type || 'error'
    obj.text = obj.text || ''
    div.setAttribute("id", "st" + ran);
    div.setAttribute("class", "showToast " + obj.type);
    div.innerHTML = '<span class="text din fl">' + obj.text + '</span>';
    body.appendChild(div);
    setTimeout(function() {
        body.removeChild(document.querySelector('#st' + ran));
    }, 2000)
}
let loading = function() { //载入loading
    let body = document.querySelector('body'),
        div = document.createElement("div");
    div.setAttribute("id", "loadingId");
    div.setAttribute("class", "loading");
    div.innerHTML = '<div class="loadEffect"> <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><p>加载中</p>';
    body.appendChild(div);
}
let hideloading = function() {
    if (document.querySelector('#loadingId')) {
        document.querySelector('body').removeChild(document.querySelector('#loadingId'))
    }
}

function dataURLtoFile(dataurl, filename) { //将base64转换为文件
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function imageDeal(files, returnBase64) {
    //获取file，转成base64	
    var file = files;
    //取传入的第一个文件	
    if (undefined == file) { //如果未找到文件，结束函数，跳出		
        return;
    }
    if (file.size <= 1048576) {
        returnBase64(file)
        return
    }
    var r = new FileReader();
    r.readAsDataURL(file);
    r.onload = function(e) {
        var base64 = e.target.result;
        var bili = 1.5;
        console.log("压缩前：" + base64.length);
        suofang(base64, bili, returnBase64);
    }
}

function suofang(base64, bili, callback) {
    console.log("执行缩放程序,bili=" + bili); //处理缩放，转格式	
    var _img = new Image();
    _img.src = base64;
    _img.onload = function() {
        var _canvas = document.createElement("canvas");
        var w = this.width / bili;
        var h = this.height / bili;
        _canvas.setAttribute("width", w);
        _canvas.setAttribute("height", h);
        _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
        var base64 = _canvas.toDataURL("image/jpeg");
        _canvas.toBlob(function(blob) {
            if (blob.size > 1024 * 1024) {
                suofang(base64, bili, callback);
            } else {
                let m = parseInt(Math.random() * 100000)
                let file = dataURLtoFile(base64, m + '.jpg')
                callback(blob, file);
            }
        }, "image/jpeg");
    }
}

function downloadIamge(imgsrc, name = 'photo') { //下载图片地址和图片名
    if (!imgsrc) return
    let image = new Image();
    // 解决跨域 Canvas 污染问题
    console.log(imgsrc)
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
}