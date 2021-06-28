const mongoose = require('mongoose');
const fs = require('fs');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
mongoose.set('useFindAndModify', false);
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', () => {
    console.log('mongodb is well');
});

module.exports = getFormFolder(db);

function getFormFolder(mongo) {
    const db = {};
    fs.readdirSync('./app/model').forEach((file) => {
        if (file !== 'index.js' && file.split('.').pop() === 'js') {
            const schema = require('../app/model/' + file);
            if (schema.modelName)
                db[schema.modelName] = schema;
        }
    });
    return db;
}