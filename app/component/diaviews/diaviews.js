

var svgs = document.getElementsByClassName("svg")
for(var i=0; i<svgs.length; i++){
    var li = svgs[i]
    , gene = li.getAttribute("gene")
    if(dvhip==5){
        li.innerHTML = CreateDiamondImageTagSVG(i, gene, 200, "")
    }
    if(dvhip==8){
        var backcl = theme == 2 ? 'black' : 'white';
        li.innerHTML = CreateDiamondBrillianceSVG(gene, backcl)
    }
        
}


