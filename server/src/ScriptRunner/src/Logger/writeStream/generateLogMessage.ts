import chalk from 'chalk';

const generateLogMessage = (row: string[]) => {
    const rowObj = logRowToObject(row);
    
    return `[${rowObj.dateTime}] ${getTypeMessage(rowObj.type)} ${rowObj.message}` 
}

const logRowToObject = (logRow: string[]) => {
    return {
        dateTime : logRow[0],
        type : logRow[1],
        message : logRow[2],
    }
}

const getTypeMessage = (type: string) => {
    switch (type) {
        case 'SUCCESS':
            return chalk.green(type)
        case 'INFO': 
            return chalk.blue(type)
        case 'ERROR': 
            return chalk.red(type)
        default:
            return type
    }
}

export default generateLogMessage;