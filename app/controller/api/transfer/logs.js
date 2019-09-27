/**
 * 查看转账记录
 */

const api = appload('tool/apiRespond')
const model_transferlog = appload('model/transferlog')


module.exports = async function(req, res)
{
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 20
    if (limit > 200){ limit = 200 }
    let start = (page - 1) * limit
    let rets = await model_transferlog.getList(req.query.address, req.query.type, start, limit, true)
    let logs = []
    for (let k in rets.results) {
        const v = rets.results[k]
        // console.log(v)
        logs.push([
            v.blockheight,
            v.fromaddr,
            v.toaddr,
            v.amountstr,
            v.timestamp,
        ])
    }
    api.success(res, logs)
}
