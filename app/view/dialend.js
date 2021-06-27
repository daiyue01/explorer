/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'dialend',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    // 查询通道
    let dialend = null
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "dialend",
            id: req.params.id,
        })
        // let datas = jsonobj.datas
        // console.log(jsonobj)
        if( jsonobj.loan_amount ) {
            dialend = jsonobj
        }
    }catch(e){
        console.log(e)
        dialend = "[error]" + e.toString()
    }
    // 返回
    callback(null, {
        pagetitle: "Hacash diamond system lending " + req.params.id,
        id: req.params.id,
        dialend: dialend,
    }, req, res)
}



