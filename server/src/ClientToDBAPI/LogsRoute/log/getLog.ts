import path from 'path';
import { Request , Response } from 'express';

const PATH_TO_LOG_FILE = path.resolve(__dirname , '../../../ScriptRunner/Logs/log.txt');

const getLog = (req : Request , res : Response) => {
    res.sendFile(PATH_TO_LOG_FILE);
}

export default getLog;