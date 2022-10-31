/**
 * 
 */


const config = appload('config')
const module_block = appload('model/block')


exports.components = [
    'header',

    'main',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    callback(null, {
        dvhip: req.cookies?parseInt(req.cookies.dvhip):undefined,
        pagetitle: "Hacash Block Explorer",
        last_height: (await module_block.getLastBlock()).height,
        ranking_api_url: config.ranking_api_url,
    }, req, res)
}



