import fs from 'fs';
import path from 'path';
import { Pool } from "pg";
import { Request , Response } from 'express';

import runScript from "../../../../ScriptRunner/src/runScript";

const { DBConnectionsObject } = require('../../../../DBService/config');

const postLog = async (req: Request , res: Response) => {
    const { direcrory, name } = req.body;

    const connection : Pool = DBConnectionsObject.coronai.connection;

    await connection.connect()
        .then(async (client) => {
            const pathToScript = path.resolve(__dirname , `../../../../ScriptRunner/Scripts/${direcrory}/${name}`);
            
            try {
                const query = fs.readFileSync(pathToScript).toString();
                
                await runScript(client, query, name);

                connection.end();
                return res.status(200).send('🎉');
            } catch (e) {
                connection.end();
                return res.status(404).send(`Read error , ${e}`);
            }
        }).catch(err => {
            connection.end();
            return res.status(500).send(`Error connecting to server. message: ${err.message}`);
        });
}

export default postLog;

// TODO: find a way to add how much time it took to run a query (at the server)