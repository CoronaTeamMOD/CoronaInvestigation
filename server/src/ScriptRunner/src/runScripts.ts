import fs from 'fs';
import path from 'path';
import { Pool } from "pg";

import SCRIPTS_DIRECTORY from '../common/SCRIPTS_DIRECTORY'; 
const { DBConnectionsObject } = require('../../DBService/config');

const runScripts = (scriptNames : string[]) => {
    const connection : Pool = DBConnectionsObject.coronai.connection;

    connection.connect(async (err , client , release) => {
        if(err) {
            console.error('❌ Error connecting to server. message:' , err.message);
        } else {
            for(const [index , name] of scriptNames.entries()) {
                const pathToScript = path.resolve(__dirname , `../Scripts/${SCRIPTS_DIRECTORY}/${name}`);
                const query = fs.readFileSync(pathToScript).toString(); 
                console.log(`${index + 1}\\${scriptNames.length} ⌛ Running script ${name}`);
                const response = await client.query(query)
                    .then(result => {
                        return `✔️  ${name} ran successfully.`;
                    })
                    .catch(err => {
                        return `❌ Received error running ${name}. message: ${err.message}`;
                    });
                console.log(response);
            };
        }

        release();
    });
}

export default runScripts;
