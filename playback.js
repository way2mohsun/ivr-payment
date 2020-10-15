function play(channel, client, sound) {
    var playback = client.Playback();
    channel.play({media: 'sound:/root/media/ivr-payment/' + sound},
    playback, function(err, playback) {
        if (err) {
            throw err;
            //process.exit(1);
        }
    });
}
exports.play = play;