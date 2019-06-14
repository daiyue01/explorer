

var vAppDfcts = new Vue({
    el: '#dfcts',
    data: {
        hashpower: '0 H/s',
    },
    methods:{
    }
})


var vAppBlocks = new Vue({
    el: '#blocks',
    data: {
        last_height: last_height,
        last_cuttime: 66,
        hashpower: '0 H/s',
        blocks: [],

        showMoreBtn: false,
    },
    methods:{
        updateLastHeight: function(newhei){
            if(newhei > this.last_height){
                // 请求最新的数据
                this.queryNewDatas(newhei, newhei-this.last_height, true)
                this.last_height = newhei
            }
        },
        queryNewDatas: function(last, limit, addfront){
            var that = this
            apiget("/api/block/list", {
                last: last,
                limit: limit,
            }, function(data){
                that.showMoreBtn = true
                if(addfront){
                    that.blocks = data.datas.concat(that.blocks)
                }else{
                    that.blocks = that.blocks.concat(data.datas)
                }
            })
        },
        queryMoreDatas: function(){
            if(this.blocks[0]){
                this.showMoreBtn = false
                var last = this.blocks[this.blocks.length-1].height - 1
                this.queryNewDatas(last, 20)
            }
        }
    },
})



// 定时更新 last heigth
setInterval(function(){
    if( vAppBlocks.last_cuttime <= 1 ){
        return
    }
    vAppBlocks.last_cuttime -= 1
    if( vAppBlocks.last_cuttime == 1 ){
        apiget("/api/block/last", {}, function(data){
            vAppBlocks.last_cuttime = 66
            vAppBlocks.updateLastHeight(data.height) // 更新数据
        })
    }
}, 1000)

// 默认加载数据
vAppBlocks.queryNewDatas(last_height, 20)




////////////////////////////////////////////////



function drawDifficultyCharts(data){
    // 绘制算力曲线
    //获取Canvas对象(画布)
    var cvs = document.getElementById("dfcts_canvas");
    //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
    if(cvs.getContext){  
        //获取对应的CanvasRenderingContext2D对象(画笔)
        cvs.width = parseInt(getStyle(cvs, "width"))
        var ctx = cvs.getContext("2d")
        ctx.lineWidth = 1;
        // 坐标轴距离画布上右下左的边距
        var padding = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        }
        // 求坐标轴原点的坐标
        var origin = {
            x: padding.left,
            y: cvs.height - padding.bottom
        }
        // 求坐标轴默认可显示数据的范围
        var coordMaxX = cvs.width - padding.left - padding.right;
        var coordMaxY = cvs.height - padding.top - padding.bottom ;

        // var data = [ 100, 200, 400, 600, 1200, 1800, 1000, 500, 20 ];
 
        // 求数据缩放的比例
        var ratioX = coordMaxX / data.length;
        var ratioY = coordMaxY / Math.max.apply( null, data );
 
        // 根据比例，对元数据进行缩放
        var ratioData = data.map( function( val, index ) {
            return val * ratioY;
        });
 
        // 画折线
        ctx.beginPath();
        ratioData.forEach( function( val, index ) {
            ctx.lineTo( origin.x + ( index * ratioX), origin.y - val );
        });
        ctx.stroke();
        

    }
}

// 加载算力难度值
apiget("/api/difficulty/charts", {}, function(data){
    // console.log(data)
    vAppDfcts.hashpower = data.hashpower
    drawDifficultyCharts(data.nums)
})



setTimeout(function(){
    // drawDifficultyCharts([1,3,5,7,9,6,3,1])
}, 1000)

