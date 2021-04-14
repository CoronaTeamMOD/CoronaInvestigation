const SUCCESS_ICON = '✔️';
const INFO_ICON = '💬';
const WARN_ICON = '⚠️';
const ERROR_ICON = '❌';

import getLogDateTime from '../LogUtils/getLogDateTime';

const logger = () => {
    const success = (message : string) => {
        return `${SUCCESS_ICON}  ${getLogDateTime()} ${message}`
    }

    const info = (message : string) => {
        return `${INFO_ICON}  ${getLogDateTime()} ${message}`
    }

    const warn = (message : string) => {
        return `${WARN_ICON}  ${getLogDateTime()} ${message}`
    }

    const error = (message : string) => {
        return `${ERROR_ICON}  ${getLogDateTime()} ${message}`
    }

    return {
        success,
        info,
        warn,
        error
    }
}

export default logger;