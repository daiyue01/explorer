/**
 * 转账记录
 */

const config = appload('config')
const http_tool = appload('tool/http')
const model_initmysql = appload('model/initmysql')






// 按条件查询
exports.getList = async function(address, type, start, limit, id_desc)
{
    let pool = model_initmysql.pool()
    let wheres = []
    if (address) {
        if (type=='all') {
            wheres.push('fromaddr='+pool.escape(address)+' OR toaddr='+pool.escape(address))  
        }else if (type=='in') {
            wheres.push('toaddr='+pool.escape(address))  
        }else if (type=='out') {
            wheres.push('fromaddr='+pool.escape(address))  
        }
    }
    if (wheres.length) {
        wheres = ' WHERE ' + wheres.join(' AND ')
    }
    let sql = `SELECT * FROM transferlog ` + wheres +(id_desc?' ORDER BY id DESC ':'')+ ` LIMIT ` + start + `,` + limit
    // console.log(sql)
    let ret = await model_initmysql.sql_execute(sql)
    return ret
}





