/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')



exports.components = [
    'header',

    'block',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // 查询区块
    let blockinfo = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "blockintro",
            gettrshxs: true,
            id: req.params.blockid,
        })
        if(jsonobj.height > 0){
            blockinfo = jsonobj 
        }
    }catch(e){
        console.log(e)
        // amount = "[error]"
    }

    // 返回
    callback(null, {
        pagetitle: "Hacash 区块 " + req.params.blockid,
        blockid: req.params.blockid,
        blockinfo: blockinfo,
    }, req, res)
}



