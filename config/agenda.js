const Agenda = require('agenda');
const agenda = new Agenda({
    db: {
        address: process.env.DB_CONNECT
    }
});

(async function () {
    agenda.processEvery("1 minutes");
})();