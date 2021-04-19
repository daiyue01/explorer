/**
 * 转账记录
 */

const config = appload('config')
const http_tool = appload('tool/http')
const model_initmysql = appload('model/initmysql')






// 按条件查询
exports.getList = async function(address, channel_id, start, limit, orderby_id_desc)
{
    let pool = model_initmysql.pool()
    let wheres = []
    if (address) {
        wheres.push('leftaddr='+pool.escape(address)+' OR rightaddr='+pool.escape(address)) 
    }
    if (channel_id) {
        wheres.push('channel_id='+pool.escape(channel_id))
    }
    if (wheres.length) {
        wheres = ' WHERE ' + wheres.join(' AND ')
    }
    let sql = `SELECT * FROM channelopenlog ` + wheres +(orderby_id_desc?' ORDER BY id DESC ':'')+ ` LIMIT ` + start + `,` + limit
    // console.log(sql)
    let ret = await model_initmysql.sql_execute(sql)
    return ret
}








