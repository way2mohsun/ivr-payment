var jdate = require('jdate').JDate(),
        now = new Date();
var year = now.getFullYear(),
        month = now.getMonth() + 1,
        day = now.getDate();
now = now.getFullYear()
        + "/" +
        (month < 10 ? "0" + month : month)
        + "/" +
        (day < 10 ? "0" + day : day);
var EndPoint = 'sip/1001*8@188.75.112.123:8090';
function originate(channel, client) {
    var dialed = client.Channel();

    channel.on('StasisEnd', function(event, channel) {
        hangupDialed(channel, dialed);
    });

    dialed.on('ChannelDestroyed', function(event, dialed) {
        hangupOriginal(channel, dialed);
    });

    dialed.on('StasisStart', function(event, dialed) {
        joinMixingBridge(channel, dialed, client);
    });
    var info = '{' +
            '"MerchCode":"597211971",' +
            '"TermCode":"683855208",' +
            '"InvNum":"' + channel.id + '",' +
            '"InvDate":"' + jdate.toString('yyyy/MM/dd HH:mm:ss') + '",' +
            '"Amount":"1000",' +
            '"TimeStamp":"' + now + '",' +
            '"Action":"1001",' +
            '"CustNum":"' + channel.caller.number + '"}';
    var crypto = require('crypto');
    var signer = crypto.createSign('sha1');
    signer.update(info);
    var sign = signer.sign(privateKey, 'base64');
    dialed.originate({
        //endpoint: process.argv[2],
        endpoint: EndPoint,
        app: 'bridge-dial',
        appArgs: 'dialed',
        callerId: 'Amir<533>',
        variables: {
            'SIPADDHEADER1': 'x-info: ' + info,
            'SIPADDHEADER2': 'x-sign: ' + sign
        }},
    function(err, dialed) {
        if (err) {
            throw err;
            //process.exit(1);
        }
    });
}
exports.originate = originate;
// handler for dialed channel entering Stasis
function joinMixingBridge(channel, dialed, client) {
    var bridge = client.Bridge();

    dialed.on('StasisEnd', function(event, dialed) {
        dialedExit(dialed, bridge);
    });

    dialed.answer(function(err) {
        if (err) {
            throw err;
            //process.exit(1);
        }
    });
    bridge.create({type: 'mixing'}, function(err, bridge) {
        if (err) {
            throw err;
            //process.exit(1);
        }
        console.log('Created bridge %s', bridge.id);
        addChannelsToBridge(channel, dialed, bridge);
    });
}
// handler for original channel hanging up so we can gracefully hangup the
// other end
function hangupDialed(channel, dialed) {
    console.log(
            'Channel %s left our application, hanging up dialed channel %s',
            channel.name, dialed.name);
    // hangup the other end
    dialed.hangup(function(err) {
        // ignore error since dialed channel could have hung up, causing the
        // original channel to exit Stasis
    });
}
// handler for the dialed channel hanging up so we can gracefully hangup the
// other end
function hangupOriginal(channel, dialed) {
    console.log('Dialed channel %s has been hung up, hanging up channel %s',
            dialed.name, channel.name);
    // hangup the other end
    channel.hangup(function(err) {
        // ignore error since original channel could have hung up, causing the
        // dialed channel to exit Stasis
    });
}
// handler for the dialed channel leaving Stasis
function dialedExit(dialed, bridge) {
    console.log(
            'Dialed channel %s has left our application, destroying bridge %s',
            dialed.name, bridge.id);

    bridge.destroy(function(err) {
        if (err) {
            throw err;
            //process.exit(1);
        }
    });
}
// handler for new mixing bridge ready for channels to be added to it
function addChannelsToBridge(channel, dialed, bridge) {
    console.log('Adding channel %s and dialed channel %s to bridge %s',
            channel.name, dialed.name, bridge.id);
    bridge.addChannel({channel: [channel.id, dialed.id]}, function(err) {
        if (err) {
            throw err;
            //process.exit(1);
        }
    });
}

var privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIICXQIBAAKBgQCDsNLPax9bnEBLKujgxhq01dkx53QldEQKuk+FvpiG3FQrzTVd\n' +
        'i4f9N6y43XIa0G3wdjL8llvFS6XYoqCpkRuyjhDd8eqeRZja73O+h1ssd66uKqlW\n' +
        'gQS8SX+g31IbHcOBjNHXk6BiZtw8eV0ZmMM1N2jKFe8+VRcaTJuXbgUVOQIDAQAB\n' +
        'AoGASL2bNEcPgyLDwMFq8P18MvcMiaw3U5jtHJ/c3RtyVMvPEoK/P3SbIRtnpJVt\n' +
        'ObJ3h6NCdpL3DfvDF+58oC0vBpqq0+goXFZvtfmSBa6VaoBBABKGBbl9MqZqvTUd\n' +
        'Y/ijIXfw5Oo6CstuqZYYDhaJDDblHzK8jbcj7ydQTZ37SyECQQDhPrBxXu6y0q/9\n' +
        '5He9kaLmEzIYFbYKrAL9TbcKNEGtl0tJ2FfirMRGP9X9GuYfFP7QHAckvZ9zrGgc\n' +
        'YWg83eRfAkEAlav//ru+EJ+4785OTvEhxVktS7sAPxvu9hte/95dcM0m2gMVBqtk\n' +
        'm+Bsj9JhT4nfR3BcQqJ71bG1j1U/qtatZwJBAIVAo/t98PLDp7ApIBl69gbspj8P\n' +
        'YRGxL1eRSU71GUHL9pNqNJv6H2d7zmmdJzSOJC0T17oJoDI7daAMlDEmCDsCQDPZ\n' +
        '0mW9RKsdqkPphNd0Ue68ZiTGM9+pHa/E67RYpKZfbAY66x3UYpZduT5Z87xKVz+4\n' +
        'fT3YbG4rkmqFbfkRRiECQQDLhiVWDVHwxyv4GIVBxVagFBf1YpsBwfr/g9dVj4jt\n' +
        '0tNIGBH9dcBQjlCe4eaKEQ6bWr3gaUKU465EHtwDMc1a\n' +
        '-----END RSA PRIVATE KEY-----';
var publicKey = '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDsNLPax9bnEBLKujgxhq01dkx\n' +
        '53QldEQKuk+FvpiG3FQrzTVdi4f9N6y43XIa0G3wdjL8llvFS6XYoqCpkRuyjhDd\n' +
        '8eqeRZja73O+h1ssd66uKqlWgQS8SX+g31IbHcOBjNHXk6BiZtw8eV0ZmMM1N2jK\n' +
        'Fe8+VRcaTJuXbgUVOQIDAQAB\n' +
        '-----END PUBLIC KEY-----';