
var vAppBlocks = new Vue({
    el: '#blocks',
    data: {
        last_height: last_height,
        last_cuttime: 66,
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
                this.queryNewDatas(last, 10)
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
vAppBlocks.queryNewDatas(last_height, 10)

