/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'diamond',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    // 查询钻石
    let diamond = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "diamond",
            name: req.params.name,
        })
        // let datas = jsonobj.datas
        // console.log(jsonobj)
        if( jsonobj.name ) {
            diamond = jsonobj
        }
    }catch(e){
        console.log(e)
        diamond = "[error]" + e.toString()
    }
    // 返回
    callback(null, {
        pagetitle: "Hacash 钻石 " + req.params.name,
        name: req.params.name,
        diamond: diamond,
    }, req, res)
}



