module.exports = {

    '/': 'main',
    '/address/:address': 'address',
    '/block/:blockid': 'block',
    '/tx/:trshx': 'transaction',
    '/diamond/:name': 'diamond',
    '/channel/:id': 'channel',

    '/api/lang': 'api/lang',
    'POST/api/lang': 'api/lang',

    '/api/block/last': 'api/block/last',
    '/api/block/list': 'api/block/list',

    '/api/diamond/createtxs': 'api/diamond/createtxs',
    
    '/api/channel/openlogs': 'api/channel/openlogs',

    '/api/transfer/logs': 'api/transfer/logs',
    '/api/transfer/last': 'api/transfer/last',

    '/api/ranking/top': 'api/ranking/top',
    '/api/ranking/diamonds': 'api/ranking/diamonds',

    '/api/difficulty/charts': 'api/difficulty/charts',
    '/api/difficulty/chartsv2': 'api/difficulty/chartsv2',
    '/api/difficulty/chartsv3': 'api/difficulty/chartsv3',
    '/api/difficulty/powpower': 'api/difficulty/powpower',

    '/api/address/amount': 'api/address/amount',

    '/api/total/supply': 'api/total/supply',
    '/api/total/current_circulation_number': 'api/total/current_circulation_number',
    

}
