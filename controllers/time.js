/**
 * @file Export time (year, month, day, hour, minutes, seconds) for the current process.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const currentDate = new Date();
const year = currentDate.getFullYear().toString().padStart(4, "0");;
const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const day = currentDate.getDate().toString().padStart(2, "0");
const hour = currentDate.getHours().toString().padStart(2, "0");
const minute = currentDate.getMinutes().toString().padStart(2, "0");
const second = currentDate.getSeconds().toString().padStart(2, "0");

const time = `${year}-${month}-${day}_${hour}-${minute}-${second}`;
module.exports = time;