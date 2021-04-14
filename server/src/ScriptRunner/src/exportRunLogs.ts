import fs from 'fs';
import path from 'path';

const PATH_TO_LOGS_DIR = path.resolve(__dirname , `../Logs`);
const LOG_FILE_NAME = 'log';

const exportRunLogs = (logs : string[]) => {
    
    logs.forEach(log => {
        console.log(log);
    });
    writeLogsToFile(logs);
}

const writeLogsToFile = (logs : string[]) => {
    const joinedLogs = logs.join('\n');
    fs.writeFile(`${PATH_TO_LOGS_DIR}/${LOG_FILE_NAME}.txt`, joinedLogs, (err) => {
        if(err) {
            return console.log(err);
        }
        console.log('saved succssesfully');
    });
}

export default exportRunLogs;