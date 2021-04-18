import fs from 'fs';
import path from 'path';
import { Pool } from "pg";

import logger from './Logger';
import generateLoadingBar from './loadingBar';
import SCRIPTS_DIRECTORY from '../common/SCRIPTS_DIRECTORY'; 

const { DBConnectionsObject } = require('../../DBService/config');

const runScripts = async (scriptNames : string[]) => {
    const connection : Pool = DBConnectionsObject.coronai.connection;
    
    await connection.connect()
        .then( async (client) => {
            if(client) {
                for(const [index , name] of scriptNames.entries()) {
                    const pathToScript = path.resolve(__dirname , `../Scripts/${SCRIPTS_DIRECTORY}/${name}`);
                    const query = fs.readFileSync(pathToScript).toString(); 
                    console.log(`${generateLoadingBar((index + 1) / scriptNames.length)} ${index+1}/${scriptNames.length} - ${name}`);
                    await client.query(query)
                        .then(result => {
                            logger.success(`ran ${name} successfully.`);
                        })
                        .catch(err => {
                            logger.error(`Received error running ${name}. message: ${err.message}`);
                        });
                };
            }        
        }).catch(err => {
            logger.error(`Error connecting to server. message: ${err.message}`);
        });
}

export default runScripts;
