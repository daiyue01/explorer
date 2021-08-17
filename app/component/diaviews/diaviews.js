

var svgs = document.getElementsByClassName("svg")
for(var i=0; i<svgs.length; i++){
    var li = svgs[i]
    , gene = li.getAttribute("gene")
    li.innerHTML = CreateDiamondImageTagSVG(i, gene, 200, "")
}


