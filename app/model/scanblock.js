
const config = appload('config')
const http_tool = appload('tool/http')
const model_initmysql = appload('model/initmysql')




async function startScanOneBlockOfTransferLog(scanheight) {
    let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
        action: "getalltransferlogbyblockheight",
        include_btc_hacd: "true",
        block_height: scanheight,
    })
    // console.log(jsonobj)
    if (!jsonobj){
        return "http error"
    }
    if(parseInt(jsonobj.ret) > 0 || jsonobj.err){
        // 表示等待最新的出块
        return jsonobj.err || "error"
    }
    let datas = jsonobj.datas
    // 插入数据
    for (let i in datas) {
        const one = datas[i].split("|")
        const arys = `blockheight = ${scanheight},`
            + `fromaddr = "${one[0]}",`
            + `toaddr = "${one[1]}",`
            + `amountstr = "${one[2]}",`
            + `timestamp = ${jsonobj.timestamp}`
        await model_initmysql.sql_execute(`INSERT INTO transferlog SET ` + arys)
    }
}

async function startScanOneBlockOfChannelOpenLog(scanheight) {

    let jsonobj = await http_tool.json(config.miner_api_url+"/query", {
        action: "getallchannelopenlogbyblockheight",
        block_height: scanheight,
    })
    if(jsonobj && jsonobj.datas) {
        let datas = jsonobj.datas
        // 插入数据
        for (let i in datas) {
            const one = datas[i].split("|")
            const arys = `blockheight = ${scanheight},`
                + `channelid = "${one[0]}",`
                + `leftaddr = "${one[1]}",`
                + `leftamt = "${one[2]}",`
                + `rightaddr = "${one[3]}",`
                + `rightamt = "${one[4]}",`
                + `timestamp = ${jsonobj.timestamp}`
            await model_initmysql.sql_execute(`INSERT INTO channelopenlog SET ` + arys)
        }
    }

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

            /**************************** 扫描交易记录 ****************************/
            // console.log("await http_tool.json(config.miner_api_url", "end_height:", last, "start_height:", start_height, "limit:", last-start_height+1)
            let errmsg = await startScanOneBlockOfTransferLog(scanheight)
            // console.log(jsonobj)
            if (errmsg){
                // 表示等待最新的出块
                setTimeout(startScanLog, 1000*13)
                return
            }

            /**************************** 扫描通道开启记录 ****************************/

            await startScanOneBlockOfChannelOpenLog(scanheight)

            // 保存状态，扫描下一个区块
            await model_initmysql.saveSetting(scankey, scanheight)
            if (scanheight % 100 == 0) {
                // throw "insert one"
                console.log("scan_block_height - " + scanheight)
            }
            setTimeout(startScanLog, 11)
        }catch(e){
            console.log(e)
            // 5 分钟之后重启扫描
            setTimeout(startScanLog, 1000 * 60 * 5 )
            return
        }
    }
}


// scan all
async function scanAllTest(start, maxhei) {
    for(let i=start; i<maxhei; i++){
        await startScanOneBlockOfChannelOpenLog(i)
        if(i%100 == 0){
            console.log("scan_block_height - " + i)
        }
    }
}
// scanAllTest(1, 233164)
// scanAllTest(36370, 45000)



// 扫描区块记录
setTimeout(startScanLog, 1000)


