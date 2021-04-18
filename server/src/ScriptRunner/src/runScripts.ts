import fs from 'fs';
import path from 'path';
import { Pool } from "pg";

import logger from './Logger';
import generateLoadingBar from './loadingBar';
import BLACKLIST_AFFIX from '../common/BLACKLIST_AFFIX';
import SCRIPTS_DIRECTORY from '../common/SCRIPTS_DIRECTORY'; 
import blacklistFile from './blacklistFile';
import shouldRunScript from './shouldRunScript';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

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
                        
                        await client.query(query)
                            .then(result => {
                                logger.success(`ran ${name} successfully.`);
                            })
                            .catch(err => {
                                logger.error(`Received error running ${name}. message: ${err.message}`);
                            });
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
