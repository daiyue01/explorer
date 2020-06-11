/**
 * 
 */
const config = appload('config')
const http_tool = appload('tool/http')
const api = appload('tool/apiRespond')

module.exports = async function(req, res)
{
    try{
        // console.log("await http_tool.json(config.miner_api_url", "end_height:", last, "start_height:", start_height, "limit:", last-start_height+1)
        let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
            action: "diamondcreate",
        })
        // ok
        api.success(res, jsonobj)
    }catch(e){
        api.error(res,  e)
    }
}
