/**
 * 
 */

const http_tool = appload('tool/http')
const config = appload('config')


exports.components = [
    'header',

    'diaviews',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    // console.log(query)
    // console.log(req.params)
    // 查询钻石可视化列表
    let page = parseInt(req.params.page)
    , limit = 50
    , curdianum = parseInt(req.query.curdianum)
    , maxpage =  parseInt(curdianum / 50) + 1
    ;
    if(isNaN(page)){
        page = maxpage
    }
    let start = (page - 1) * limit + 1
    ;
    if(start > curdianum - limit + 1){
        start = curdianum - limit + 1
    }
    let diamond_view_gene_list = []
    try{
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "getdiamondvisualgenelist",
            start_number: start,
            limit: limit,
        })
        let datas = jsonobj.list
        , len = datas.length
        , datalist = new Array(len)
        // 倒序
        for(let i=0, k=len-1; i<len; i++, k--){
            datalist[k] = datas[i]
        }
        // console.log(jsonobj)
        diamond_view_gene_list = datalist
        
    }catch(e){
        console.log(e)
        diamond = "[error]" + e.toString()
    }
    // 返回
    callback(null, {
        pagetitle: "Hacash Diamond Pictures - page " + page,
        page: page,
        limit: limit,
        maxpage: maxpage,
        curdianum: curdianum,
        diamonds: diamond_view_gene_list,
    }, req, res)
}



