function doSaveFile(value, type, name) {
    var blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
}

// HIP-5
;(function(){

    var diaimg = document.getElementById("diaimg")
    var sbp = document.getElementById("showbigimg")
    var dlsvg = document.getElementById("downloadsvg")
    
    var vgstr = diaimg.getAttribute("visual_gene")
    var svgtag = CreateDiamondImageTagSVG(1, vgstr, 600, "diaitem")

    diaimg.innerHTML = svgtag

    // 查看高清大图
    function showbigpic(){
        sbp.getElementsByTagName("div")[0].innerHTML = CreateDiamondImageTagSVGFullShow(vgstr, "diaitem big")
    }
    sbp.onclick = showbigpic
    // showbigpic();

    // 下载SVG格式图片
    function downloadsvg(){
        var fn = diaimg.getAttribute("savefilename")
        , svgcon = diaimg.getElementsByTagName("svg")[0].innerHTML
        , filecon = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 25.4.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="125 100 500 500" xml:space="preserve"> <style type="text/css"> .st16 { fill: none; stroke: #F5E1DA; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 10; } </style>' + svgcon + '</svg>';
        doSaveFile(filecon, "image/svg+xml", fn+".svg")
    }
    dlsvg.onclick = downloadsvg
})();


// HIP-8
;(function(){

    var diaimg = document.getElementById("hip8img")
    , vgstr = diaimg.getAttribute("visual_gene")
    , backcl = theme == 2 ? 'black' : 'white'
    , svgtag = CreateDiamondBrillianceSVG(vgstr, backcl)
    ;

    var showbighip8 = document.getElementById("showbighip8")

    diaimg.innerHTML = svgtag;

    showbighip8.onclick = function(){
        // console.log(svgtag)
        // window.history.pushState({}, 'Big picture')
        var bd = document.body
        bd.innerHTML = '<div style="width: 1200px; margin: auto">'+CreateDiamondBrillianceSVG(vgstr, "black")+'</div>'
        bd.style.backgroundColor = "black"
    }


})();
