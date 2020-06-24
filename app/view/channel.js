/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'channel',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    // 查询通道
    let channel = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "channel",
            ids: req.params.id,
        })
        // let datas = jsonobj.datas
        // console.log(jsonobj)
        if( jsonobj.belong_height ) {
            channel = jsonobj
        }
    }catch(e){
        console.log(e)
        channel = "[error]" + e.toString()
    }
    // 返回
    callback(null, {
        pagetitle: "Hacash 结算通道 " + req.params.id,
        id: req.params.id,
        channel: channel,
    }, req, res)
}



