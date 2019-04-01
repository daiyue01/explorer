
var vAppBlocks = new Vue({
    el: '#blocks',
    data: {
        last_height: last_height,
        last_cuttime: 30,
        blocks: [],
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
            apiget("/api/block/list", {
                last: last,
                limit: limit,
            }, function(data){
                if(addfront){
                    vAppBlocks.blocks = data.datas.concat(vAppBlocks.blocks)
                }else{
                    vAppBlocks.blocks = vAppBlocks.blocks.concat(data.datas)
                }
            })
        },
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
            vAppBlocks.last_cuttime = 30
            vAppBlocks.updateLastHeight(data.height) // 更新数据
        })
    }
}, 1000)

// 默认加载数据
vAppBlocks.queryNewDatas(last_height, 20)

