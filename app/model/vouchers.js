const mongoose = require('mongoose');

const DOCUMENT_NAME = 'vouchers';
const COLLECTION_NAME = 'vouchers';

const schema = mongoose.Schema({
    event_id: mongoose.Types.ObjectId,
    code: String
}, {
    timestamps: {
        createdAt: 'createdAt'
    },
    versionKey: false
});

const category_news = mongoose.model(DOCUMENT_NAME, schema, COLLECTION_NAME);

module.exports = category_news;