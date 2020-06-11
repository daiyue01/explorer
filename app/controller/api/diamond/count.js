

/**
 * 
 */
const config = appload('config')
const http_tool = appload('tool/http')
const api = appload('tool/apiRespond')


module.exports = async function(req, res)
{
    req.query.address

    try{
        api.success(res, {amount: "ㄜ3270:248"});
    }catch(e){
        api.error(res, e.toString())
    }
}