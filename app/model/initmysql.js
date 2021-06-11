/**
 * mysql 数据库
 */

const AllMysqlTableSchema = {
    // 数据配置与状态记录
    "settings": `
        CREATE TABLE settings (
            name  VARCHAR(255) NOT NULL,
            value VARCHAR(255) NOT NULL,
                PRIMARY KEY (name, value)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `,
    // 转账记录
    "transferlog": `
        CREATE TABLE transferlog (
            id          INT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
            blockheight INT(4) UNSIGNED DEFAULT 0 NOT NULL,
            fromaddr    VARCHAR(255) NOT NULL,
            toaddr      VARCHAR(255) NOT NULL,
            amountstr   VARCHAR(255) NOT NULL,
            timestamp   INT(4) UNSIGNED DEFAULT 0 NOT NULL,
                PRIMARY KEY (id),
                KEY (blockheight, fromaddr, toaddr)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `,
    // 操作记录
    "operateactionlog": `
        CREATE TABLE operateactionlog (
            id          INT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
            blockheight INT(4) UNSIGNED DEFAULT 0 NOT NULL,
            kid      SMALLINT(4) UNSIGNED DEFAULT 0  NOT NULL,
            tystr    VARCHAR(255) NOT NULL,
            dataid    VARCHAR(255) NOT NULL,
            addr1    VARCHAR(255) NOT NULL,
            addr2    VARCHAR(255) NOT NULL,
            notes    VARCHAR(255) NOT NULL,
            timestamp   INT(4) UNSIGNED DEFAULT 0 NOT NULL,
                PRIMARY KEY (id),
                KEY (blockheight, addr1, addr2)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `,
    // 钻石数量统计
    "diamondcount": `
        CREATE TABLE diamondcount (
            address char(34) NOT NULL,
            count int(4) unsigned NOT NULL DEFAULT 0,
                PRIMARY KEY (address)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `,
}

// 配置默认值初始化
const DefaultSettingsValue = {
    "transferlog_scan_block_height": "0", // 扫描已完成的区块高度
    "diamondcount_scan_diamond_number": "0", // 扫描已完成的钻石序号
}



// 初始化
function initMysqlDB(){
    const pool = MysqlPool();
    // 建表
    for(let tbname in AllMysqlTableSchema){
        (function(tbname, sqlstr){
            pool.query("SHOW TABLES LIKE '"+tbname+"';", function (error, results, fields) {
                if (error) throw error;
                // console.log(results, fields);
                if (results.length == 0) {
                     // 不存在则创建表
                    pool.query(sqlstr, function (error, results, fields) {
                        if (error) throw error;

                        // 插入配置默认值
                        if (tbname == "settings") {
                            let sqls = []
                            for(let name in DefaultSettingsValue){
                                let value = DefaultSettingsValue[name]
                                sqls.push("INSERT INTO settings(name, value) SELECT '"+name+"','"+value+"' FROM DUAL WHERE NOT EXISTS(SELECT name FROM settings WHERE name = '"+value+"')")
                            }
                            pool.query(sqls.join(";"), function (error, results, fields) {
                                if (error) throw error;
                            })
                        }

                    })
                }
            });
        })(tbname, AllMysqlTableSchema[tbname])
    }
    return pool;
}

// 数据库
const pool = initMysqlDB()



//////////////////////////// 方法 ////////////////////////////



function sql_execute(sqlString) {
    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (error, results, fields) {
            // console.log(results)
            if (error) {
                return reject(error);
            } else {
                resolve({results, fields});
            }
        })
    })
}




//////////////////////////// 查询数据 ////////////////////////////

exports.pool = function()
{
    return pool
}

exports.sql_execute = sql_execute



exports.getSetting = async function(name)
{
    if ( DefaultSettingsValue[name] == undefined ){
        throw new Error("settings name <"+name+"> not find in DefaultSettingsValue{}.")
    }
    var res = await sql_execute('SELECT value FROM settings WHERE name=' + pool.escape(name) + ' LIMIT 1')
    if(res.results.length > 0) {
        return res.results[0].value
    }
    return null
}



exports.saveSetting = async function(name, value)
{
    if ( DefaultSettingsValue[name] == undefined ){
        throw new Error("settings name <"+name+"> not find in DefaultSettingsValue{}.")
    }
    value = value.toString()
    await sql_execute('UPDATE settings SET value='+pool.escape(value)+' WHERE name=' + pool.escape(name) + ' LIMIT 1')
    return
}






