const Joi = require('joi');
const randomstring = require("randomstring");

Joi.objectId = require('joi-objectid')(Joi)

module.exports.options = {
    tags: ['api'],
    validate: {
        payload: Joi.object({
            event_id: Joi.objectId().required()
        })
    }
}
module.exports.handler = async function (request, reply) {
    let session;
    try {
        const event = await DB.events.findOne({
            _id: request.payload.event_id
        });
        if (!event)
            return {
                "statusCode": 404,
                "error": "Not found event id",
                "message": "Not found event id"
            }
        session = await DB.vouchers.startSession();
        session.startTransaction();
        const countVoucher = await DB.vouchers.countDocuments({
            event_id: request.payload.event_id
        })
        if (countVoucher >= event.max_quantity)
            return {
                "statusCode": 456,
                "error": "Event is end of slot",
                "message": "Event is end of slot"
            }
        const voucher = randomstring.generate(8);
        await DB.vouchers.create([{
            event_id: request.payload.event_id,
            code: voucher
        }], {
            session: session
        });
        await session.commitTransaction();
        return {
            "statusCode": 200,
            "data": {
                voucher: voucher
            },
            "message": "Success"
        }
    } catch (e) {
        if (session)
            session.abortTransaction();
        throw e;
    } finally {
        if (session)
            session.endSession();
    }
}