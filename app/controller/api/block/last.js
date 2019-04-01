/**
 * 
 */

const api = appload('tool/apiRespond')
const model_block = appload('model/block')

module.exports = async function(req, res)
{
    // ok
    api.success(res, await model_block.getLastBlock())
}
