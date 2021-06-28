const Joi = require('joi');

module.exports.options = {
    tags: ['api'],
    validate: {
        payload: Joi.object({
            name: Joi.string().required(),
            slot: Joi.number().required()
        })
    }
}
module.exports.handler = async function (request, reply) {
    const createEvent = await DB.events.create({
        name: request.payload.name,
        max_quantity: request.payload.slot,
    });
    return {
        "statusCode": 200,
        "data": {
            id: createEvent._id,
            slot: request.payload.slot
        },
        "message": "Success"
    }
}