(function(win, doc) {
    if (!win.addEventListener) return;
    var html = document.documentElement;
    console.log(html.clientWidth)

    function setFont() {
        var cliWidth = html.clientWidth;
        if (cliWidth > 750) {
            cliWidth = 750;
        }
        html.style.fontSize = 100 * (cliWidth / 750) + 'px';
    }
    win.addEventListener('resize', setFont, false)
    doc.addEventListener('DOMContentLoaded', setFont, false)
})(window, document);