const Joi = require('joi');
const randomstring = require("randomstring");
const getDataQueue = require('../../queue/sendMail')

Joi.objectId = require('joi-objectid')(Joi)

module.exports.options = {
    tags: ['api'],
    validate: {
        payload: Joi.object({
            event_id: Joi.objectId().required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
        })
    }
}
module.exports.handler = async function (request, reply) {
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
            event_id: request.payload.event_id,
            name: request.payload.name,
            email: request.payload.email
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
        await getDataQueue({
            to: `"${request.payload.name}" <${request.payload.email}>`,
            subject: "Notification voucher",
            text: "Your voucher code is " + voucher,
            html: "Your voucher code is " + voucher
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