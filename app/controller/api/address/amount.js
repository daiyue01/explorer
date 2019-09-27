


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