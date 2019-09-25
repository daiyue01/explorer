/**
 * 查看转账记录
 */

const api = appload('tool/apiRespond')
const model_transferlog = appload('model/transferlog')


var logs_cache = null
module.exports = async function(req, res)
{
    if (logs_cache == null ) {
        let rets = await model_transferlog.getLasts(40)
        logs_cache = []
        for (let k in rets.results) {
            const v = rets.results[k]
            // console.log(v)
            logs_cache.push([
                v.blockheight,
                v.fromaddr,
                v.toaddr,
                v.amountstr,
                v.timestamp,
            ])
        }
        setTimeout(function(){
            logs_cache = null
        }, 1000 * 13)
    }
    api.success(res, logs_cache)
}
