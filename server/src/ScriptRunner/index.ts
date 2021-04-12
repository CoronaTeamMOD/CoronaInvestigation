import fs from 'fs';
import path from 'path';
import { Pool } from "pg";

import runScripts from './src/runScripts';
import getAllScriptsNames from './src/getAllScriptsNames';

const runScriptsOnRemote = async () => {
    const scriptsNames = await getAllScriptsNames();

    runScripts(scriptsNames)
}

export default runScriptsOnRemote;