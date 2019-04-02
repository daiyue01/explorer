const http_tool = appload('tool/http')
const config = appload('config')


///////////////////////////////////////////////


let lastblockdata = {}

// 定时获取 last block 信息
async function queryLastBlock(){
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query?action=lastblock")
        // console.log(jsonobj)
        // ok
        lastblockdata = jsonobj
    }catch(e){
        console.log(e)
    }
}
setInterval(queryLastBlock, 1000 * 13)
queryLastBlock()


////////////////////////////////////////////////


let blockdatas = []
let blocklastheight = 0

async function getBlocks(last, limit) {
    if( !last || !limit ){
        return []
    }
    if( last > lastblockdata.height ){
        limit -= last - lastblockdata.height
        last = lastblockdata.height
    }
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "blocks",
            start_height: parseInt(last) - parseInt(limit) + 1,
            end_height: last,
        })
        // ok
        return jsonobj
    }catch(e){
        return []
    }
}


////////////////////////////////////////////////


exports.getLastBlock = async function()
{
    return lastblockdata
}


exports.getBlocks = getBlocks



