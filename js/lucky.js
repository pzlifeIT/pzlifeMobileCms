(function() {
    let goodImg = document.querySelector('#goodImg'),
        goodTitle = document.querySelector('#goodTitle'),
        goodHint = document.querySelector('#goodHint'),
        goodBtn = document.querySelector('#goodBtn');
    let ids = geturl(),
        pid = ids.pid,
        wid = ids.wid;
    let docking = false
    verifyWinners();
    goodBtn.onclick = function() {
        getWinning();
    };

    function verifyWinners() {
        app.requests({
            url: 'OfflineActivities/verifyWinners',
            data: {
                pid: pid,
                winning_id: wid
            },
            success(res) {
                goodImg.src = res.image_path
                goodTitle.innerHTML = res.goods_name
                if (res.is_winning == 1) {
                    showToast({
                        text: '该商品已领取'
                    });
                    goodHint.innerHTML = '该商品已领取'
                }
            },
            Error(code) {
                let text = '';
                switch (parseInt(code)) {
                    case 3001:
                        text = '未查询到获奖记录';
                        break;
                    default:
                        text = '查询失败';
                }
                showToast({
                    text: text
                });
            }
        })
    }

    function getWinning() {
        if (docking) return
        docking = true
        app.requests({
            url: 'OfflineActivities/getWinning',
            data: {
                pid: pid,
                winning_id: wid
            },
            success(res) {
                showToast({
                    type: 'success',
                    text: '发放成功'
                });
                goodHint.innerHTML = '该商品已领取'
            },
            complete() {
                docking = false
            },
            Error(code) {
                let text = '';
                switch (parseInt(code)) {
                    case 3001:
                        text = '未查询到获奖记录';
                        break;
                    case 3002:
                        text = '该商品已领取';
                        break;
                        break;
                    default:
                        text = '查询失败';
                }
                showToast({
                    text: text
                });
            },
            failed() {
                docking = false
            }
        })
    }
})()