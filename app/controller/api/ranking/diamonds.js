

/**
 * 
 */
const config = appload('config')
const http_tool = appload('tool/http')
const api = appload('tool/apiRespond')

module.exports = async function(req, res)
{
    try{
        let jsonobj = await http_tool.json(config.ranking_api_url+"/query", {
            action: "account_diamonds",
            address: req.query.address,
        })
        // ok
        api.success(res, jsonobj)
    }catch(e){
        api.error(res,  e)
    }
}
