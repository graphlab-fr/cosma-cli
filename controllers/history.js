/**
 * @file Create folders for save the export.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs')
    , path = require('path');

const envPaths = require('env-paths');
const { data } = envPaths('cosma-cli', { suffix: '' });

/**
 * Get path to store cosmscope file in history
 * @param {string} projectName
 * @param {'global'|'local'} projectScope
 * @returns {Promise<string>}
 */

module.exports = async function(projectName, projectScope) {
    let pathDir;
    switch (projectScope) {
        case 'global':
            pathDir = path.join(data, projectName);
            break;
        case 'local':
            pathDir = path.join(process.env.PWD, 'history');
            break;
        default:
            throw new Error('Unknown project scope');
    }
    const pathFile = path.join(pathDir, `${getTimestamp()}.html`);

    return new Promise(async (resolve, reject) => {
        if (fs.existsSync(pathDir) === false) {
            fs.mkdir(pathDir, { recursive: true }, (err) => {
                if (err) { reject(err.message); }
                resolve(pathFile);
            });
        }
        resolve(pathFile);
    });
}

function getTimestamp() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().padStart(4, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hour = currentDate.getHours().toString().padStart(2, "0");
    const minute = currentDate.getMinutes().toString().padStart(2, "0");
    const second = currentDate.getSeconds().toString().padStart(2, "0");
    return [year, month, day, hour, minute, second].join('');
}