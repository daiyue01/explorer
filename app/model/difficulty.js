/**
 * 
 * 
 */

const fs = require("fs")

const BN = require('bn.js')



const model_block = appload('model/block')



let DIFFICULTY_BUFFER = Buffer.from("")

let difficulty_charts_nums_cache = null
let difficulty_charts_apidata_cache = null

// 判断文件是否存在
let buffilepath = appabs("datas/difficulty_charts.dat")
if( ! fs.existsSync(buffilepath) ){
    // 不存在则创建文件
    // fs.writeFileSync(buffilepath, new Uint8Array(Buffer.from("")))
}

function loadDifficultyDatas(){
    // 从磁盘加载数据
    fs.open(buffilepath, "r+", async function(err, fd){
        // console.log("fs.open")
        if(err){
            console.log(err)
            console.log("[ Cannot read difficulty charts data file. ]")
            return
        }
        // 读取文件
        DIFFICULTY_BUFFER = fs.readFileSync(fd)
        // console.log(DIFFICULTY_BUFFER)
        if(DIFFICULTY_BUFFER.length % 4 != 0){
            return console.log("difficulty charts file data error.")
        }
        // 循环请求难度变动的区块信息
        let step = (DIFFICULTY_BUFFER.length/4)
        , bufappend = []
        while(true){
            step++
            let bits = await loaddfct(step)
            if(!bits){
                break
            }
            // console.log(bits)
            let buf = Buffer.alloc(4)
            buf.writeUInt32BE(bits, 0)
            // console.log(buf)
            bufappend.push(buf)
        }
        if(bufappend.length > 0){
            difficulty_charts_nums_cache = null // 删除缓存
            bufappend = Buffer.concat(bufappend)
            // 写入文件
            fs.appendFileSync(fd, bufappend)
            DIFFICULTY_BUFFER = Buffer.concat([DIFFICULTY_BUFFER, bufappend])
            // console.log(DIFFICULTY_BUFFER)
        }
        // 加载难度
        async function loaddfct(step){
            let realhei = step*288
            let lasthei = (await model_block.getLastBlock()).height
            // console.log(lasthei)
            if(realhei > lasthei){
                return null
            }
            let blks = await model_block.getBlocks(realhei, 1)
            // console.log(blks)
            // console.log(step, blks)
            if( blks && blks[0] ){
                return blks[0].bits
            }else{
                return null
            }
        }
    })
}
// setTimeout(loadDifficultyDatas, 1000)
// setInterval(loadDifficultyDatas, 1000*60*60*1)


//////////////////////////////////////

/*

1 kH / s =每秒1,000哈希
1 MH / s =每秒1,000,000次哈希。
1 GH / s =每秒1,000,000,000次哈希。
1 TH / s =每秒1,000,000,000,000次哈希。
1 PH / s =每秒1,000,000,000,000,000次哈希。
1 EH / s =每秒1,000,000,000,000,000,000次哈希。

*/


exports.charts = async function()
{
    function rdi8(idx){
        return DIFFICULTY_BUFFER.readUInt8(idx)
    }


    if( ! difficulty_charts_nums_cache ){
        difficulty_charts_nums_cache = []
        let len = parseInt(DIFFICULTY_BUFFER.length/4)
        let last_value = 0

        let difficulty_charts = []

            let jjj = 0;
            let kkk = 0
            let i=len-180
            if (i < 0) {
                i = 0;
            }
        for(; i<len; i++){
            let nnn = diffToBignumber(rdi8(i*4+0), rdi8(i*4+1), rdi8(i*4+2), rdi8(i*4+3))
            // console.log( nnn.toString() )
            // 判断 哈希次数增长 1 ～ 16 次
            kkk++
            for(let k=16; k>0; k--){
                if( i > (50000.0/288) *k ){
                    jjj++
                    // console.log(kkk, jjj, i,k, (new BN(1+k)).toString() )
                    // console.log( nnn.toString() )
                    nnn = nnn.div(new BN(1+k)) // 哈希次数加权计算
                    // console.log( nnn.toString() )
                    break
                }
            }
            difficulty_charts.push( parseInt(nnn.toString()) )
            
            // let fff = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            // let bignumff = new BigNumber(fff, 16) 
            // let nnn = diffToBignumber(rdi8(i*4+0), rdi8(i*4+1), rdi8(i*4+2), rdi8(i*4+3))
            // let oknum = nnn // bignumff.minus( nnn )
            // console.log(oknum.toString())
            // let value = parseInt( oknum.div( new BigNumber('1.1e+66')  ) )
            // console.log(value)

            // let mmmstr = bignumff.minus( nnn ).toString(16)
            // let okstr = mmmstr.substr(0, 8) + '0'.repeat(fff.length-mmmstr.length)
            // let oknum = new BigNumber(okstr, 16) 
            // console.log( bignumff.toString(16) )
            // console.log( nnn.toString(16) )
            // console.log( oknum.toString(16) )
            // console.log( oknum.toString(10) )

            /*
            let base = 255 - rdi8(i*4)
            let num =  (rdi8(i*4+1)*256*256 + rdi8(i*4+2)*256 + rdi8(i*4+3) )
            last_value = Math.pow(2, base) * num
            let value = parseInt( last_value / 10000 / 10000 )
            difficulty_charts_nums_cache.push( value )
            */

            // console.log(value)
            // console.log(base, num)
            // difficulty_charts_nums_cache.push( rdi8(i*4+0)*256*256*256 + rdi8(i*4+1)*256*256 + rdi8(i*4+2)*256 + rdi8(i*4+3) )
            
            // let num = DIFFICULTY_BUFFER.readUInt32BE( i*4 )
            // difficulty_charts_nums_cache.push(parseInt((4294967294-num)/10000000))
        }

        // 倒置
        const max_value = Math.max.apply(null, difficulty_charts)
        const min_value = Math.min.apply(null, difficulty_charts)
        for(let i=0; i<difficulty_charts.length; i++){
            let value = max_value - difficulty_charts[i] // + min_value
            difficulty_charts_nums_cache.push( value )
            last_value = value
        }
        // console.log(maxnnn, minnnn, maxnnn-minnnn )
        // 计算波动率
        // let aaa = (parseFloat(maxnnn) - parseFloat(minnnn)) / parseFloat(minnnn)


        setTimeout(() => {
            difficulty_charts_nums_cache = null
        }, 1000*60*29);

        // 计算哈希率
        function HandlerPower( value ) {
            let hashpower = '-'
            hx_value = parseFloat( value )
            let p4 = parseFloat( hx_value / 1000000000000 )
            let p3 = parseFloat( hx_value / 1000000000 )
            let p2 = parseFloat( hx_value / 1000000 )
            let p1 = parseFloat( hx_value / 1000 )
            if( p4 > 1){ hashpower = p4.toFixed(2) + ' T' }
            else if ( p3 > 1){ hashpower = p3.toFixed(2) + ' G' }
            else if ( p2 > 1){ hashpower = p2.toFixed(2) + ' M' }
            else if ( p1 > 1){ hashpower = p1.toFixed(2) + ' K' }
            else { hashpower = hx_value + ' ' }
            return hashpower
        }

        difficulty_charts_apidata_cache = {
            step: 1,
            start: 1,
            // min_power: HandlerPower(min_value),
            // max_power: HandlerPower(max_value),
            // last_power: HandlerPower(last_value),
            nums: difficulty_charts_nums_cache,
        }

    }
    // console.log(difficulty_charts_nums_cache)
    return difficulty_charts_apidata_cache
}


function diffToBignumber(n1, n2, n3, n4) {
    // console.log(n1, n2, n3, n4)
    let bits = []
    let prezero = 255 - n1
    while(prezero>0){
        bits.push(0)
        prezero--
    }
    bits = bits.concat( ByteToBits(n2) )
    bits = bits.concat( ByteToBits(n3) )
    bits = bits.concat( ByteToBits(n4) )
    let subend = 256 - bits.length
    while(subend>0){
        bits.push(0)
        subend--
    }
    let seglen = 256 / 8
    let resbytes = Buffer.alloc(seglen)
    for(let i=0; i<seglen; i++){
        resbytes[i] = BitsToByte( bits.slice(i*8, i*8+8) ) 
    }
    // console.log(resbytes.join(','))
    // console.log(resbytes.toString('hex'))
    // console.log('ff'.repeat(32))

    let bn_ffff = new BN('ff'.repeat(32), 16)
    let bn_diff = new BN(resbytes.toString('hex'), 16)
    let bn_valueshow  = bn_diff.div( new BN( 'ff'.repeat(24) , 16)) 

    // console.log((new BN( '1' , 10)).toString(10))

    // console.log(bn_ffff.toString(16))
    // console.log(bn_valueshow.toString(10))
    // console.log(bn_val.toString(16))

    return bn_valueshow // BigNumber
    // return resbytes
}


// 256进制变2进制
function BitsToByte(bits) {
	let b = 0
	b += (1) * bits[7]
	b += (2) * bits[6]
	b += (4) * bits[5]
	b += (8) * bits[4]
	b += (16) * bits[3]
	b += (32) * bits[2]
	b += (64) * bits[1]
	b += (128) * bits[0]
	return b
}




function ByteToBits(b) {
	return [
		((b >> 7) & 0x1),
		((b >> 6) & 0x1),
		((b >> 5) & 0x1),
		((b >> 4) & 0x1),
		((b >> 3) & 0x1),
		((b >> 2) & 0x1),
		((b >> 1) & 0x1),
		((b >> 0) & 0x1),
    ]
}












