/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'lockbls',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    // 查询通道
    let lockbls = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "lockbls",
            lockbls_id: req.params.id,
        })
        // let datas = jsonobj.datas
        // console.log(jsonobj)
        if( jsonobj.total_lock_amount ) {
            lockbls = jsonobj
        }
    }catch(e){
        console.log(e)
        lockbls = "[error]" + e.toString()
    }
    // 返回
    callback(null, {
        pagetitle: "Hacash lock contract " + req.params.id,
        id: req.params.id,
        lockbls: lockbls,
    }, req, res)
}



