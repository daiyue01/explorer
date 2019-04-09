/**
 * 
 */



const api = appload('tool/apiRespond')
const model_block = appload('model/block')

module.exports = async function(req, res)
{
    try{
        let datas = await model_block.getBlocks( req.query.last, req.query.limit, req.query.clean_cache)
        api.success(res, {
            datas
        })
    }catch(e){
        api.error(res, e.toString())
    }
}
