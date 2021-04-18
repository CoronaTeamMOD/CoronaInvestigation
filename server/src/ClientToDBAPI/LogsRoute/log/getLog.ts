import path from 'path';
import { Request , Response } from 'express';

const PATH_TO_LOG_FILE = path.resolve(__dirname , '../../../ScriptRunner/Logs/log.csv');

const getLog = (req : Request , res : Response) => {
    console.log(PATH_TO_LOG_FILE);
    res.download(PATH_TO_LOG_FILE);
}

export default getLog;