const createEvent = require('./app/controller/event/create');
const createVoucher = require('./app/controller/voucher/create');


module.exports = [{
    method: 'POST',
    path: '/event',
    options: createEvent.options,
    handler: createEvent.handler
}, {
    method: 'POST',
    path: '/voucher',
    options: createVoucher.options,
    handler: createVoucher.handler
}]
