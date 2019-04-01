/**
 * 
 */



const api = appload('tool/apiRespond')
const model_block = appload('model/block')

module.exports = async function(req, res)
{
    try{
        api.success(res, await model_block.getBlocks( req.query.last, req.query.limit))
    }catch(e){
        api.error(res, e.toString())
    }
}
