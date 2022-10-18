const { expect } = require('chai');
const sinon = require('sinon')

const { bin } = require('../package.json');
const { exec } = require("child_process");
const commander = require('commander');

// nodemoh test --exec "npm run test"
// https://javascript.plainenglish.io/how-to-test-a-node-js-command-line-tool-2735ea7dc041

describe.only('Commands', () => {
    const commands = [
        // 'modelize',
        // 'modelize --citeproc',
        // 'modelize --custom-css',
        // 'record',
        'autorecord',
    ];

    commands.forEach((cmd) => {
        cmd = `node ${bin.cosma} ${cmd}`;
        it(`should exec command "${cmd}"`, (done) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) { done(error); }
                console.log(stdout, stderr);
                done();
            })
        })
    })

})