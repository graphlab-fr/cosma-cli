/**
 * @file Export time (year, month, day, hour, minutes, seconds) for the current process.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const moment = require('moment')
    , time = moment().format('YYYY-MM-DD_HH-mm-ss');

module.exports = time;