const { expect } = require('chai');
const sinon = require('sinon')

const { bin } = require('../package.json');
const { exec } = require("child_process");
const commander = require('commander');

// nodemoh test --exec "npm run test"
// https://javascript.plainenglish.io/how-to-test-a-node-js-command-line-tool-2735ea7dc041

describe.only('Commands', () => {
    it('should', (done) => {
        const spyCommander = sinon.spy(commander, 'Command');
        exec(`node ${bin.cosma}`, (error, stdout, stderr) => {
            if (error) { done(error); }
            sinon.assert.calledOnce(spyCommander);
            done();
        })
    })
})