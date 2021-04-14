import fs from 'fs';
import path from 'path';
import { Pool } from "pg";

import generateLoadingBar from './loadingBar';
import SCRIPTS_DIRECTORY from '../common/SCRIPTS_DIRECTORY'; 
import StringToFormattedLog from './LogUtils/StringToFormattedLog';

const { DBConnectionsObject } = require('../../DBService/config');

const runScripts = async (scriptNames : string[]) => {
    const connection : Pool = DBConnectionsObject.coronai.connection;
    
    const newlogs = await connection.connect()
        .then( async (client) => {
            let logs : string[] = [];
            if(client) {
                for(const [index , name] of scriptNames.entries()) {
                    const pathToScript = path.resolve(__dirname , `../Scripts/${SCRIPTS_DIRECTORY}/${name}`);
                    const query = fs.readFileSync(pathToScript).toString(); 
                    console.log(`${generateLoadingBar((index + 1) / scriptNames.length)} ${index+1}/${scriptNames.length} - ${name}`);
                    const response = await client.query(query)
                        .then(result => {
                            return StringToFormattedLog(`✔️  ran ${name} successfully.`);
                        })
                        .catch(err => {
                            return StringToFormattedLog(`❌  Received error running ${name}. message: ${err.message}`);
                        });
                    logs.push(response);
                };
                }        
            return logs;
        }).catch(err => {
            return [StringToFormattedLog(`❌ Error connecting to server. message: ${err.message}`)];
        });

    return newlogs;
}

export default runScripts;
