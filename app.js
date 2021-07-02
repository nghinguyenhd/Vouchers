require('dotenv').config();
const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const route = require('./route');
require('./config/agenda');
require('./config/queue');

global.DB = require('./config/db');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    server.route(route)
    await server.register([
        Inert,
        Vision, {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Test API Documentation',
                    version: process.env.VERSION,
                }
            }
        }]);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
init();