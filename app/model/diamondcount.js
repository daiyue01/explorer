/**
 * 地址上的钻石数量统计
 */

const config = appload('config')
const http_tool = appload('tool/http')
const model_initmysql = appload('model/initmysql')






// 查询数量
exports.getCount = async function(address)
{
    let pool = model_initmysql.pool()
    let sql = `SELECT count FROM diamondcount WHERE address=${pool.escape(address)} LIMIT 1`
    // console.log(sql)
    let res = await model_initmysql.sql_execute(sql)
    if(res.results.length > 0) {
        return res.results[0].count
    }else{
        return 0
    }
}





// 开始钻石序号
async function startScanDiamondCount() {
    const scankey = "diamondcount_scan_diamond_number"
    // 读取本地的 setting 状态
    let scannumberstr = await model_initmysql.getSetting(scankey)
    let scannumber = parseInt( scannumberstr )
    scannumber ++
    // console.log("diamondcount_scan_diamond_number - number = " + scannumber)
    if ( scannumber > 0 ) {
        // 读取钻石详情
        try{
            // console.log("await http_tool.json(config.miner_api_url", "end_height:", last, "start_height:", start_height, "limit:", last-start_height+1)
            let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
                action: "diamond",
                name: scannumber,
            })
            // console.log(jsonobj)
            if ( ! jsonobj.miner_address){
                // 表示等待，钻石还未挖出
                setTimeout(startScanDiamondCount, 1000*60*3)
                return
            }
            // 挖出
            let addr = jsonobj.miner_address
            // 写入数据
            await model_initmysql.sql_execute(`INSERT INTO  diamondcount(address,count) VALUES ("${addr}",1) ON DUPLICATE KEY UPDATE count=count+1`)
            // 保存状态，扫描下一个区块
            await model_initmysql.saveSetting(scankey, scannumber)
            // throw "insert one"
            console.log(scankey + " - " + scannumber)
            setTimeout(startScanDiamondCount, 1234)
        }catch(e){
            console.log(e)
            return
        }
    }
}


// 开始扫描钻石
startScanDiamondCount()




