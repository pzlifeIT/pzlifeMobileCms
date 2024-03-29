;
(function(win, doc) {
    function QRScan(div_id) {
        this.div_id = div_id;
        this.div_can = null;
        this.videos = [];
        this.medioConfig = {};
        this.can_open = false;
        this.init();
    }
    QRScan.prototype = {
        init: function() {
            win.URL = (win.URL || win.webkitURL || win.mozURL || win.msURL);
            var promisifiedOldGUM = function(constraints) {
                var getUserMedia = (navigator.getUserMedia ||
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);

                });
            };
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
            }

            var self = this;
            self.div_can = doc.getElementById(self.div_id);

            navigator.mediaDevices.enumerateDevices().then(function(devices) {
                devices.forEach(function(dv) {
                    var kind = dv.kind;
                    if (kind.match(/^video.*/)) {
                        self.videos.push(dv.deviceId);
                        console.log(dv);
                    }
                });
                var len = self.videos.length;
                self.can_open = true;
                self.medioConfig = {
                    audio: false,
                    video: { deviceId: self.videos[len - 1] }
                }
            });

        },
        openScan: function() {
            var self = this;
            if (self.can_open) {
                var vd = doc.createElement('video');
                vd.setAttribute('id', 'video_id');
                navigator.mediaDevices.getUserMedia(self.medioConfig).then(function(stream) {
                    vd.src = win.URL.createObjectURL(stream);
                    self.div_can.appendChild(vd);
                }).catch(function(err) {
                    var p = doc.createElement('p');
                    p.innerHTML = 'ERROR: ' + err.name +
                        '<br>该浏览器不支持调用摄像头，请使用夸克浏览器';
                    self.div_can.appendChild(p);
                });
                vd.play();
            }
        },
        closeScan: function() {
            this.div_can.innerHTML = '';
        },
        // 截图上传
        getImgDecode: function(func) {
            var self = this;
            var video = doc.getElementById('video_id');
            var canvas = doc.createElement('canvas');
            canvas.width = 340;
            canvas.height = 305;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 340, 305);
            var base64 = canvas.toDataURL("image/jpeg");
            let m = parseInt(Math.random() * 100000)
            let file = self.dataURLtoFile(base64, m + '.jpg')
            func(file)
        },
        dataURLtoFile(dataurl, filename) { //将base64转换为文件
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
    }
    win.QRScan = QRScan;

}(window, document));