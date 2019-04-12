/**
 * 
 */

const api = appload('tool/apiRespond')
const model_difficulty = appload('model/difficulty')

module.exports = async function(req, res)
{
    // ok
    api.success(res, await model_difficulty.charts() )
}
