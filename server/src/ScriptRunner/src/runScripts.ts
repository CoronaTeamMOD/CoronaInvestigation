import fs from 'fs';
import path from 'path';
import { Pool } from "pg";

import SCRIPTS_DIRECTORY from '../common/SCRIPTS_DIRECTORY'; 
const { DBConnectionsObject } = require('../../DBService/config');

const runScripts = (scriptNames : string[]) => {
    const connection : Pool = DBConnectionsObject.coronai.connection;

    connection.connect(async (err , client , release) => {
        if(err) {
            console.error('❌ Error connecting to server. stack:' , err.message);
        } else {
            await scriptNames.forEach((name) => {
                const query = fs.readFileSync(path.resolve(__dirname , `../Scripts/${SCRIPTS_DIRECTORY}/${name}`)).toString();
                console.log(`⌛ Running script ${name}`);
                client.query(query , (err , result) => {
                    if(err) {
                        console.error(`❌ Received error running ${name}. message:`, err.message);
                    } else {
                        console.info(`✔️  ${name} ran successfully.`);
                    }
                });
            });
        }

        release();
    });
}

export default runScripts;
