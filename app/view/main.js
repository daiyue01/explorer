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
        pagetitle: "Hacash 区块浏览器 BLOCK.hacash.org",
        last_height: (await module_block.getLastBlock()).height,
    }, req, res)
}



