import levels from './levels';
//import IP from '../LogUtils/ipAddress';
import { writeToStream } from './writeStream';
import getLogDateTime from '../LogUtils/getLogDateTime';

const success = (message : string) => {
    writeToStream([getLogDateTime(), levels.SUCCESS, message])
}

const info = (message : string) => {
    writeToStream([getLogDateTime(), levels.INFO, message])
}

const warn = (message : string) => {
    writeToStream([getLogDateTime(), levels.WARN, message])
}

const error = (message : string) => {
    writeToStream([getLogDateTime(), levels.ERROR, message])
}


export default {
    success,
    info,
    warn,
    error
};