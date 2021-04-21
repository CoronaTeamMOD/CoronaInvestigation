import { PoolClient } from 'pg';

import logger from './Logger';

const runScript = async (client : PoolClient, query: string, scriptName: string) => {
    await client.query(query)
        .then(result => {
            logger.success(`ran ${scriptName} successfully.`);
        })
        .catch(err => {
            logger.error(`Received error running ${scriptName}. message: ${err.message}`);
        });
} 

export default runScript; 