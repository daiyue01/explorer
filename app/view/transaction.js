/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'transaction',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // 查询交易
    let trsinfo = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "trsintro",
            id: req.params.trshx,
        })
        // console.log(jsonobj)
        if(jsonobj.block){
            trsinfo = jsonobj 
        }
    }catch(e){
        console.log(e)
        // amount = "[error]"
    }
    // 返回
    callback(null, {
        pagetitle: "Hacash 交易 " + req.params.trshx,
        trshx: req.params.trshx,
        trsinfo: trsinfo,
    }, req, res)
}



