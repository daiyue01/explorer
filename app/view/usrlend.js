/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'usrlend',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    // 查询通道
    let usrlend = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "usrlend",
            id: req.params.id,
        })
        // let datas = jsonobj.datas
        // console.log(jsonobj)
        if( jsonobj.loan_amount ) {
            usrlend = jsonobj
        }
    }catch(e){
        console.log(e)
        usrlend = "[error]" + e.toString()
    }
    // 返回
    callback(null, {
        pagetitle: "Hacash user lending " + req.params.id,
        id: req.params.id,
        usrlend: usrlend,
    }, req, res)
}



