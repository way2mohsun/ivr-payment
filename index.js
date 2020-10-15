var ari = require('ari-client'),
        util = require('util'),
        playback = require('./playback.js'),
        originate = require('./originate.js'),
        HashMap = require('hashmap').HashMap;
var stack = new HashMap();
ari.connect('http://172.16.36.188:8088', 'asterisk', 'asterisk', clientLoaded);
function clientLoaded(err, client) {
    if (err) {
        throw err;
        return;
    }
    function stasisStart(event, channel) {
        channel.answer(function(err) {
            playback.play(channel, client, 'me-pay-welcome');
            if (err) {
                throw err;
                return;
            }
            if (!stack.has(channel.id)) {
                stack.set(channel.id, {dtmf: '', level: 0});
            }
            channel.on('ChannelDtmfReceived', function(event, channel) {
                //console.log(event.digit);
                switch (event.digit) {
                    case '#' :
                        if(stack.get(channel.id).dtmf.length < 1){
                            break;
                        }
                        clearInterval(stack.get(channel.id).timer);
                        checkLevel(client, channel);
                        break;
                    default :
                        var tmp = stack.get(channel.id);
                        if (stack.get(channel.id).timer) {
                            clearInterval(stack.get(channel.id).timer);
                        }
                        stack.remove(channel.id);
                        stack.set(channel.id, {
                            dtmf: tmp.dtmf + event.digit,
                            level: tmp.level,
                            timer: setInterval(function() {
                                checkLevel(channel);
                                clearInterval(this);
                            }, 20000)
                        });
                }
            });
        });
    }

    function stasisEnd(event, channel) {
        if (stack.has(channel.id)) {
            clearInterval(stack.get(channel.id).timer);
        }
        stack.remove(channel.id);
    }
    client.on('StasisStart', stasisStart);
    client.on('StasisEnd', stasisEnd);
    client.start('bridge-dial');
}

function checkLevel(client, channel) {
    var mock = stack.get(channel.id);
    switch (mock.level) {
        case 0 :
            require('./dao/object.js').hasObject(mock.dtmf, function(data) {
                console.log('has checkLevel :', data);
                if (data) {// object is fine
                    playback.play(channel, client, 'me-pay-entermobile');
                    console.log('Fine:' + 0);
                    stack.set(channel.id, {dtmf: '', level: 1});
                } else {
                    console.log('Wrong:' + 0);
                    stack.set(channel.id, {dtmf: '', level: 0});
                }
            });
            break;
        case 1:
            if (mock.dtmf.length === 10) {
                console.log('Fine:' + 1);
                playback.play(channel, client, 'me-pay-cardno');
                require('./dao/subscriber.js')
                        .setSubsctiber(mock.dtmf, channel.caller.number, function() {
                            stack.set(channel.id, {dtmf: '', level: 2});
                        });
            } else {
                console.log('wrong:' + 1);
                stack.set(channel.id, {dtmf: '', level: 1});
            }
            break;
        case 2:
            //originate.originate(channel, client);
            break;
    }
}