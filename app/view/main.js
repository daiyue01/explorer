/**
 * 
 */


const module_block = appload('model/block')


exports.components = [
    'header',

    'main',

    'footer',
]



exports.datas = async function(query, callback, req, res)
{
    callback(null, {
        pagetitle: "Hacash Block Explorer",
        last_height: (await module_block.getLastBlock()).height,
    }, req, res)
}



