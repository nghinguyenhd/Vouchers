const Queue = require('bull');

const sendMailQueue = new Queue('send email', process.env.REDIS_CONNECT);

module.exports.sendMail = sendMailQueue;