/**
 * 
 * 
 */
const fs = require("fs")


const model_block = appload('model/block')

let DIFFICULTY_BUFFER = Buffer.from("")

function loadDifficultyDatas(){
    // 从磁盘加载数据
    let buffilepath = appabs("datas/difficulty_charts.dat")
    fs.open(buffilepath, "r+", async function(err, fd){
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
        let step = (DIFFICULTY_BUFFER/4)
        , bufappend = []
        while(true){
            step++
            let bits = await loaddfct(step)
            if(!bits){
                break
            }
            // console.log(bits)
            let buf = Buffer.alloc(4)
            buf.writeUInt32BE(bits)
            // console.log(buf)
            bufappend.push(buf)
        }
        bufappend = Buffer.concat(bufappend)
        // 写入文件
        fs.appendFileSync(fd, bufappend)
        DIFFICULTY_BUFFER = Buffer.concat([DIFFICULTY_BUFFER, bufappend])
        // console.log(DIFFICULTY_BUFFER)
        // 加载难度
        async function loaddfct(step){
            let realhei = step*288
            let blks = await model_block.getBlocks(realhei, 1)
            if( blks && blks[0] ){
                return blks[0].bits
            }else{
                return null
            }
        }
    })
}
loadDifficultyDatas()
setInterval(loadDifficultyDatas, 1000*60*60*3)


//////////////////////////////////////



let difficulty_charts_nums_cache = null
exports.charts = async function()
{
    if(!difficulty_charts_nums_cache){
        difficulty_charts_nums_cache = []
        let len = parseInt(DIFFICULTY_BUFFER.length/4)
        for(let i=0; i<len; i++){
            let num = DIFFICULTY_BUFFER.readUInt32BE( i*4 )
            difficulty_charts_nums_cache.push(parseInt((4294967294-num)/10000000))
        }
        setTimeout(() => {
            difficulty_charts_nums_cache = null
        }, 1000*33);
    }
    return {
        step: 1,
        start: 1,
        nums: difficulty_charts_nums_cache,
    }
}










