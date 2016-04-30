'use strict';

const SoundSync = require('sound-sync');
const fs = require('fs');

module.exports = robot => {
    const configPath = process.env.HUBOT_SOUNDCLOUD_CONFIG;
    if(!configPath) {
        return;
    }
    const config = fs.readFileSync(configPath, {
        encoding: 'utf-8'
    });
    const soundSync = new SoundSync(config);
    let inProgress = false;

    robot.respond(/soundcloud backup/, msg => {
        if(inProgress) {
            msg.send('Patience is a virtue!');
        } else {
            inProgress = true;
            soundSync.sync().progress(track => {
                msg.send(`[FINISHED] ${track.title}`);
            }).then(() => {
                msg.send('All tracks have been backed up!');
            }).catch(error => {
                msg.send(`Oh no, something went wrong: ${error}`);
            }).finally(() => {
                inProgress = false;
            });
        }
    });
};
