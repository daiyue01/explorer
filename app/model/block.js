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


let blockdatacache_maps = {} // 数据缓存

// 从缓存里取数据
function getBlocksFromCache(last, limit) {
    // console.log(blockdatacache_maps)
    let start = last - limit + 1
    let results = []
    for(let i=start; i<=last; i++){
        let one = blockdatacache_maps[''+i]
        // console.log(one)
        if( ! one ){
            return i // ret start_height
        }
        results.unshift( one )
    }
    // console.log("results", results.length)
    return results
}

async function getBlocks(last, limit) {
    if( !last || !limit ){
        return []
    }
    if( last > lastblockdata.height ){
        limit -= last - lastblockdata.height
        last = lastblockdata.height
    }
    // 从缓存取数据
    let caches = getBlocksFromCache(last, limit)
    if( typeof caches == "object" ){
        // console.log("getBlocksFromCache", last, limit)
        return caches
    }
    let start_height = parseInt(last) - parseInt(limit) + 1
    if( typeof caches == "number" ){
        start_height = caches
    }
    try{
        // console.log("await http_tool.json(config.miner_api_url", "end_height:", last, "start_height:", start_height, "limit:", last-start_height+1)
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "blocks",
            start_height: start_height,
            end_height: last,
        })
        let datas = jsonobj.datas
        // ok 保存数据至缓存
        let delete_keys = []
        for(let i in datas){
            let k = datas[i].height+''
            delete_keys.push(k)
            blockdatacache_maps[k] = datas[i]
        }
        // 定时清除缓存
        setTimeout(function(){
            for(let k in delete_keys){
                delete blockdatacache_maps[k]
            }
            // console.log("delete blocks cache key", delete_keys.join(','))
        }, 1000*60*24*3) // 保存三天内的数据 288*3
        // 再次从缓存取数据
        return getBlocksFromCache(last, limit)
    }catch(e){
        return []
    }
}


////////////////////////////////////////////////


exports.getLastBlock = async function()
{
    return lastblockdata
}


exports.getBlocks = async function(last, limit, clean_cache){
    if(clean_cache){
        blockdatacache_maps = {} // 清除缓存
    }
    return getBlocks(last, limit)
}



