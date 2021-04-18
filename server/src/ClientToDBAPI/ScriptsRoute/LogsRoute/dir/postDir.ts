import { Request , Response } from 'express';
import runScripts from '../../../../ScriptRunner/src/runScripts';

import getAllScriptsNames from '../../../../ScriptRunner/src/getAllScriptsNames';

const postDir = async (req : Request , res : Response) => {
    const { directory } = req.body;
    
    console.log('hello!');

    try {
        const allScriptsNames = await getAllScriptsNames(directory)
        
        await runScripts(allScriptsNames, directory);

        return res.sendStatus(200);
    } catch(e) {
        return res.status(404).send(`Recived Error: ${e}`);
    }
}

export default postDir;