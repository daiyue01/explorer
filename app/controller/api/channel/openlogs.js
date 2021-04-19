/**
 * 查看转账记录
 */

const api = appload('tool/apiRespond')
const model_channelopenlog = appload('model/channelopenlog')


module.exports = async function(req, res)
{
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 20
    if (limit > 200){ limit = 200 }
    let start = (page - 1) * limit
    let rets = await model_channelopenlog.getList(req.query.address, null, start, limit, true)
    let logs = []
    for (let k in rets.results) {
        const v = rets.results[k]
        // console.log(v)
        logs.push([
            v.blockheight,
            v.channelid,
            v.leftaddr,
            v.leftamt,
            v.rightaddr,
            v.rightamt,
            v.timestamp,
        ])
    }
    api.success(res, logs)
}
