/**
 * 转账记录
 */

const config = appload('config')
const http_tool = appload('tool/http')
const model_initmysql = appload('model/initmysql')







exports.getLasts = async function(limit)
{
    let ret = await model_initmysql.sql_execute(`SELECT * FROM transferlog ORDER BY id DESC LIMIT ` + limit)
    return ret
}











// 开始扫描转账记录
async function startScanLog() {
    const scankey = "transferlog_scan_block_height"
    // 读取本地的 setting 状态
    let scanheightstr = await model_initmysql.getSetting(scankey)
    let scanheight = parseInt( scanheightstr )
    scanheight ++
    // console.log("transferlog_scan_block_height - height = " + scanheight)
    if ( scanheight > 0 ) {
        // 读取区块内转账
        try{
            // console.log("await http_tool.json(config.miner_api_url", "end_height:", last, "start_height:", start_height, "limit:", last-start_height+1)
            let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
                action: "getalltransferlogbyblockheight",
                block_height: scanheight,
            })
            // console.log(jsonobj)
            if (jsonobj.ret == "1"){
                // 表示等待最新的出块
                setTimeout(startScanLog, 1000*13)
                return
            }
            let datas = jsonobj.datas
            // 插入数据
            for (let i in datas) {
                const one = datas[i].split(",")
                const arys = `blockheight = ${scanheight},`
                    + `fromaddr = "${one[0]}",`
                    + `toaddr = "${one[1]}",`
                    + `amountstr = "${one[2]}",`
                    + `timestamp = ${jsonobj.timestamp}`
                await model_initmysql.sql_execute(`INSERT INTO transferlog SET ` + arys)
            }
            // 保存状态，扫描下一个区块
            await model_initmysql.saveSetting(scankey, scanheight)
            if (datas.length > 0) {
                // throw "insert one"
                console.log("transferlog_scan_block_height - " + scanheight + " - got data length = " + datas.length)
            }
            setTimeout(startScanLog, 11)
        }catch(e){
            console.log(e)
            return
        }
    }
}




// 测试
startScanLog()



