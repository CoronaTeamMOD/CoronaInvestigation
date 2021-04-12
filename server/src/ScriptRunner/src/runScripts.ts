import e from 'express';
import fs from 'fs';
import path from 'path';
import { Pool } from "pg";

import SCRIPTS_DIRECTORY from '../common/SCRIPTS_DIRECTORY'; 
const { DBConnectionsObject } = require('../../DBService/config');

const runScripts = (scriptNames : string[]) => {
    const connection : Pool = DBConnectionsObject.coronai.connection;

   

    connection.connect(async (err , client , release) => {
        if(err) {
            console.error('error connecting to server weeoooweeeoooo error add emoji here' , err.stack);
        }
        await scriptNames.forEach((name) => {
            const query = fs.readFileSync(path.resolve(__dirname , `../Scripts/${SCRIPTS_DIRECTORY}/${name}`)).toString();

            client.query(query , (err , result) => {
            
                if(err) {
                    console.error('aaa', err.stack);
                } else {
                    console.log(result.rows);
                }
            });
        });

        release();
    })
}

export default runScripts;
