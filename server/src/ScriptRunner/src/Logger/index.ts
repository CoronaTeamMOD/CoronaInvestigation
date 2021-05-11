import levels from './levels';
import IP from '../LogUtils/ipAddress';
import { writeToStream } from './writeStream';
import getLogDateTime from '../LogUtils/getLogDateTime';

const success = (message : string) => {
    writeToStream([getLogDateTime(), IP, levels.SUCCESS, message])
}

const info = (message : string) => {
    writeToStream([getLogDateTime(), IP, levels.INFO, message])
}

const warn = (message : string) => {
    writeToStream([getLogDateTime(), IP, levels.WARN, message])
}

const error = (message : string) => {
    writeToStream([getLogDateTime(), IP, levels.ERROR, message])
}


export default {
    success,
    info,
    warn,
    error
};