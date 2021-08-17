;(function(){

    var diaimg = document.getElementById("diaimg")
    var sbp = document.getElementById("showbigimg")
    var vgstr = diaimg.getAttribute("visual_gene")
    var svgtag = CreateDiamondImageTagSVG(1, vgstr, 500, "diaitem")

    diaimg.innerHTML = svgtag

    // 查看高清大图
    function showbigpic(){
        sbp.getElementsByTagName("div")[0].innerHTML = CreateDiamondImageTagSVGFullShow(vgstr, "diaitem big")
    }
    sbp.onclick = showbigpic
    // showbigpic();


})();
