module.exports = {

    '/': 'main',
    '/address/:address': 'address',
    '/block/:blockid': 'block',
    '/tx/:trshx': 'transaction',
    '/diamond/:name': 'diamond',
    '/channel/:id': 'id',

    '/api/lang': 'api/lang',
    'POST/api/lang': 'api/lang',

    '/api/block/last': 'api/block/last',
    '/api/block/list': 'api/block/list',

    '/api/diamond/createtxs': 'api/diamond/createtxs',
    
    '/api/transfer/logs': 'api/transfer/logs',
    '/api/transfer/last': 'api/transfer/last',

    '/api/difficulty/charts': 'api/difficulty/charts',
    '/api/difficulty/powpower': 'api/difficulty/powpower',

    '/api/address/amount': 'api/address/amount',

}
