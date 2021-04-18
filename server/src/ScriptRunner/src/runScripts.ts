import fs from 'fs';
import path from 'path';
import { Pool } from "pg";

import logger from './Logger';
import runScript from './runScript';
import blacklistFile from './blacklistFile';
import generateLoadingBar from './loadingBar';
import shouldRunScript from './shouldRunScript';
import BLACKLIST_AFFIX from '../common/BLACKLIST_AFFIX';
import SCRIPTS_DIRECTORY from '../common/SCRIPTS_DIRECTORY'; 

const { DBConnectionsObject } = require('../../DBService/config');

const runScripts = async (scriptNames : string[]) => {
    const connection : Pool = DBConnectionsObject.coronai.connection;
    
    await connection.connect()
        .then( async (client) => {
            if(client) {
                for(const [index , name] of scriptNames.entries()) {
                    const pathToScript = path.resolve(__dirname , `../Scripts/${SCRIPTS_DIRECTORY}/${name}`);
                    
                    console.log(`${generateLoadingBar((index + 1) / scriptNames.length)} ${index+1}/${scriptNames.length} - ${name}`);

                    const query = fs.readFileSync(pathToScript).toString(); 
                    if(shouldRunScript(name)) {
                        const shouldBlacklist = name.startsWith(BLACKLIST_AFFIX);
                        shouldBlacklist && blacklistFile(name);
                        
                        runScript(client, query, name);
                    } else {
                        logger.info(`${name} is blacklisted, skipping...`);
                    }
                };
            }        
        }).catch(err => {
            logger.error(`Error connecting to server. message: ${err.message}`);
        });
}

export default runScripts;
