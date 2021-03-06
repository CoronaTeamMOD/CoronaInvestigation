import fs from 'fs';
import path from 'path';
import { Pool } from "pg";
import { Request , Response } from 'express';

import runScript from "../../../../ScriptRunner/src/runScript";

const { DBConnectionsObject } = require('../../../../DBService/config');

const postLog = async (req: Request , res: Response) => {
    const { directory, name } = req.body;

    const connection : Pool = DBConnectionsObject.coronai.connection;

    await connection.connect()
        .then(async (client) => {
            const pathToScript = path.resolve(__dirname , `../../../../ScriptRunner/Scripts/${directory}/${name}`);
            
            try {
                const query = fs.readFileSync(pathToScript).toString();
                
                await runScript(client, query, name);
                client.release();

                return res.status(200).send('🎉');
            } catch (e) {
                client.release();

                return res.status(404).send(`❌ Read error , ${e}`);
            }
            
        }).catch(err => {
            return res.status(500).send(`Error connecting to server. message: ${err.message}`);
        });
}

export default postLog;