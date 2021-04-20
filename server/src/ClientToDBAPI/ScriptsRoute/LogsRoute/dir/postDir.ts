import { Request , Response } from 'express';
import runScripts from '../../../../ScriptRunner/src/runScripts';

import { validStatusCode } from '../../../../GraphqlHTTPRequest';
import getScriptsNamesByFolder from '../../../../ScriptRunner/src/getScriptsNamesByFolder';

const postDir = async (req : Request , res : Response) => {
    const { directory } = req.body;

    try {
        const allScriptsNames = await getScriptsNamesByFolder(directory)
        
        await runScripts(allScriptsNames, directory);

        return res.status(validStatusCode).send('🎉');
    } catch(e) {
        return res.status(404).send(`Recived Error: ${e}`);
    }
}

export default postDir;