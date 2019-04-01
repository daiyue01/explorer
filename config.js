const config = {
    http_port: 8000,
    watch_restart_timeout: 7,
    lang: 'zh', // 默认语言

    ///////////////////////////////

    miner_api_url: "http://127.0.0.1:3338",
}




//////////////////////////////////




try{
    let dev = require('./config.use.js')
    for(let i in dev){
        config[i] = dev[i]
    }
}catch(e){}


module.exports = config
