/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'btclend',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    // 查询通道
    let btclend = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "btclend",
            id: req.params.id,
        })
        // let datas = jsonobj.datas
        // console.log(jsonobj)
        if( jsonobj.loan_amount ) {
            btclend = jsonobj
        }
    }catch(e){
        console.log(e)
        btclend = "[error]" + e.toString()
    }
    // 返回
    callback(null, {
        pagetitle: "Hacash bitcoin system lending " + req.params.id,
        id: req.params.id,
        btclend: btclend,
    }, req, res)
}



