/**
 * @file Generate or check the config file. Contains function to modif the config file.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const Config = require('../core/models/config')
    , config = new Config(newConfig);

exports.config = config.opts;