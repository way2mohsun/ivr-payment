var CronJob = require('cron').CronJob;
var log4js = require("log4js");
log4js.configure( "./log4js.json" );
var logger = log4js.getLogger("proxy");
var job = new CronJob({
  cronTime: '*/5 * * * * *',
  onTick: function() {
    var exec = require('child_process').exec;
    var run = require('child_process').exec;
    exec('pgrep -fl ivr-payment.js', function(error, stdout, stderr) {
      stdout = stdout.replace(/(\r\n|\n|\r)/gm,"");
      if(stdout.length === 0) {
        logger.error('IVR-Payment was down.');
        run('node ivr-payment.js sip/1001*8@188.75.112.123:8090');
      }
    });
  },
  start: false
});
job.start();