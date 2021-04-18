import fs from 'fs';
import path from 'path';
import { Pool } from "pg";
import { Request , Response } from 'express';

import logger from '../../../../ScriptRunner/src/Logger';
import runScript from "../../../../ScriptRunner/src/runScript";

const { DBConnectionsObject } = require('../../../../DBService/config');

const postLog = async (req: Request , res: Response) => {
    const { direcrory, name } = req.body;

    const connection : Pool = DBConnectionsObject.coronai.connection;

    await connection.connect()
        .then(async (client) => {
            // clean
            const pathToScript = path.resolve(__dirname , `../../../../ScriptRunner/Scripts/${direcrory}/${name}`);
            
            try {
                const query = fs.readFileSync(pathToScript).toString();
                
                await runScript(client, query, name);

                return res.status(200).send('🎉');
            } catch (e) {
                return res.status(404).send(`Read error , ${e}`);
            }
        }).catch(err => {
            logger.error(`Error connecting to server. message: ${err.message}`);
            return res.status(500).send(`Error connecting to server. message: ${err.message}`);
        });
}

export default postLog;

// TODO: method to run all contents of a folder

// TODO: find a way to add how much time it took to run a query (at the server)