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
    let trshx = req.params.trshx.toLocaleLowerCase()
    let trsinfo = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "trsintro",
            id: trshx,
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
        pagetitle: "Hacash Transaction " + trshx,
        trshx: trshx,
        trsinfo: trsinfo,
    }, req, res)
}



