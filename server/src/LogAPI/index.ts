import path from 'path';
import { Router } from 'express';

const LogAPI = Router();

const PATH_TO_LOG_FILE = path.resolve(__dirname , '../ScriptRunner/Logs/log.txt');

LogAPI.get('' , ( _ , response) => {
    response.sendFile(PATH_TO_LOG_FILE);
})

export default LogAPI;