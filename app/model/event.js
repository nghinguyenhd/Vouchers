const mongoose = require('mongoose');

const DOCUMENT_NAME = 'events';
const COLLECTION_NAME = 'events';

const schema = mongoose.Schema({
    name: String,
    max_quantity: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true,
    optimisticConcurrency: true
});

const event = mongoose.model(DOCUMENT_NAME, schema, COLLECTION_NAME);

module.exports = event;