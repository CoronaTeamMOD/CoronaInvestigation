const SUCCESS = 'SUCCESS';
const INFO = 'INFO';
const WARN = 'WARN';
const ERROR = 'ERROR';

import { writeToStream } from './writeStream';
import getLogDateTime from '../LogUtils/getLogDateTime';

const success = (message : string) => {
    writeToStream([getLogDateTime(), SUCCESS, message])
}

const info = (message : string) => {
    writeToStream([getLogDateTime(), INFO, message])
}

const warn = (message : string) => {
    writeToStream([getLogDateTime(), WARN, message])
}

const error = (message : string) => {
    writeToStream([getLogDateTime(), ERROR, message])
}


export default {
    success,
    info,
    warn,
    error
};