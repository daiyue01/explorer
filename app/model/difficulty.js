/**
 * 
 * 
 */
const fs = require("fs")
const model_block = appload('model/block')



let DIFFICULTY_BUFFER = Buffer.from("")

let difficulty_charts_nums_cache = null

function loadDifficultyDatas(){
    // 从磁盘加载数据
    let buffilepath = appabs("datas/difficulty_charts.dat")
    fs.open(buffilepath, "r+", async function(err, fd){
        // console.log("fs.open")
        if(err){
            console.log(err)
            console.log("[ Cannot read difficulty charts data file. ]")
            return
        }
        // 读取文件
        DIFFICULTY_BUFFER = fs.readFileSync(fd)
        // console.log(DIFFICULTY_BUFFER)
        if(DIFFICULTY_BUFFER.length % 4 != 0){
            return console.log("difficulty charts file data error.")
        }
        // 循环请求难度变动的区块信息
        let step = (DIFFICULTY_BUFFER.length/4)
        , bufappend = []
        while(true){
            step++
            let bits = await loaddfct(step)
            if(!bits){
                break
            }
            // console.log(bits)
            let buf = Buffer.alloc(4)
            buf.writeUInt32BE(bits, 0)
            // console.log(buf)
            bufappend.push(buf)
        }
        if(bufappend.length > 0){
            difficulty_charts_nums_cache = null // 删除缓存
            bufappend = Buffer.concat(bufappend)
            // 写入文件
            fs.appendFileSync(fd, bufappend)
            DIFFICULTY_BUFFER = Buffer.concat([DIFFICULTY_BUFFER, bufappend])
            // console.log(DIFFICULTY_BUFFER)
        }
        // 加载难度
        async function loaddfct(step){
            let realhei = step*288
            let lasthei = (await model_block.getLastBlock()).height
            if(realhei > lasthei){
                return null
            }
            let blks = await model_block.getBlocks(realhei, 1)
            // console.log(step, blks)
            if( blks && blks[0] ){
                return blks[0].bits
            }else{
                return null
            }
        }
    })
}
setTimeout(loadDifficultyDatas, 1000)
setInterval(loadDifficultyDatas, 1000*60*60*1)


//////////////////////////////////////

/*

1 kH / s =每秒1,000哈希
1 MH / s =每秒1,000,000次哈希。
1 GH / s =每秒1,000,000,000次哈希。
1 TH / s =每秒1,000,000,000,000次哈希。
1 PH / s =每秒1,000,000,000,000,000次哈希。
1 EH / s =每秒1,000,000,000,000,000,000次哈希。

*/


var hashpower = null
exports.charts = async function()
{
    if(!difficulty_charts_nums_cache){

        difficulty_charts_nums_cache = []
        let len = parseInt(DIFFICULTY_BUFFER.length/4)
        let last_value = 0
        for(let i=40; i<len; i++){
            let base = 256 - DIFFICULTY_BUFFER.readUInt8(i*4)
            let num = 16777215 - (DIFFICULTY_BUFFER.readUInt8(i*4+1)*256*256 + DIFFICULTY_BUFFER.readUInt8(i*4+2)*256 + DIFFICULTY_BUFFER.readUInt8(i*4+3) )
            last_value = Math.pow(2, base) * num
            let value = parseInt( last_value / 10000 / 10000 )
            // console.log(base, num)
            difficulty_charts_nums_cache.push( value )
            
            // let num = DIFFICULTY_BUFFER.readUInt32BE( i*4 )
            // difficulty_charts_nums_cache.push(parseInt((4294967294-num)/10000000))
        }
        setTimeout(() => {
            difficulty_charts_nums_cache = null
        }, 1000*60*29);

        // 计算总哈希率
        last_value = parseInt( last_value )
        let p4 = parseInt( last_value / 1000000000000 )
        let p3 = parseInt( last_value / 1000000000 )
        let p2 = parseInt( last_value / 1000000 )
        let p1 = parseInt( last_value / 1000 )
        if( p4 > 0){ hashpower = p4 + ' TH/s' }
        else if ( p3 > 0){ hashpower = p3 + ' GH/s' }
        else if ( p2 > 0){ hashpower = p2 + ' MH/s' }
        else if ( p1 > 0){ hashpower = p1 + ' KH/s' }
        else { hashpower = last_value + ' H/s' }

    }
    // console.log(difficulty_charts_nums_cache)
    return {
        step: 1,
        start: 1,
        hashpower: hashpower,
        nums: difficulty_charts_nums_cache,
    }
}










