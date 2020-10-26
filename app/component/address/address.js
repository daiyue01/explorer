
var vAppAddress = new Vue({
    el: '#address',
    data: {
        hacash_amount: '-',
        satoshi_amount: '-',
        diamond_amount: '-',
        diamond_mined: '-',
        address: '',
        trstype: 'all',
        transfers: [],
        trspage: 1, // 翻页
        trslimit: 15, //
        ifmore: false, // 是否显示更多 
    },
    methods:{
        // 加载余额
        queryAmount: function(){
            var that = this
            // apiget("/api/address/amount", {}, function(data){
            //     that.amount = data.amount
            // })
        },
        // 加载更多转账
        domoretrs: function(){
            var that = this
            // that.transfers
            // alert(that.trstype)
            // 加载
            apiget("/api/transfer/logs", {
                address: that.address,
                type: that.trstype,
                page: that.trspage,
                limit: that.trslimit,
            }, function(data){
                let myaddr = that.address.substr(0,7) + '…'
                let my =  '<u class="my" title="'+that.address+'">'+myaddr+'</u>'
                for(let i in data){
                    if(data[i][1] == that.address){
                        data[i][1] =my
                    }
                    if(data[i][2] == that.address){
                        data[i][2] = my
                    }
                }
                that.transfers = that.transfers.concat(data)
                // page ++ 
                that.trspage ++ 
                if (data.length == that.trslimit) {
                    that.ifmore = true
                }else{
                    that.ifmore = false
                }
            })
        },
        // 选择转账种类
        dotrstype: function(){
            var that = this
            , oldtt = that.trstype
            that.address = that.$refs.address.dataset.address // 赋值
            setTimeout(function(){
                if (oldtt != that.trstype) {
                    that.transfers = [] // 清空
                    that.trspage = 1
                }
            },11)
            // 加载数据
            setTimeout(that.domoretrs, 500)
        }
    }
})

// 请求数据
vAppAddress.dotrstype()

// 请求转账数据






