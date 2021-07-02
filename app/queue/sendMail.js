const nodemailer = require("nodemailer");
const queueConfig = require('../../config/queue').sendMail;

queueConfig.process(async function (job) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: process.env.MAIL_SECURE === 'true',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
        });
        await transporter.sendMail({
            from: process.env.FORM,
            to: job.data.to,
            subject: job.data.subject,
            text: job.data.text,
            html: job.data.html
        });
        console.info('Done send to email ' + job.data.to)
    } catch (e) {
        console.error(e);
    }
});

module.exports = async function (data) {
    return await queueConfig.add(data);
}