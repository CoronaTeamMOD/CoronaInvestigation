import runScripts from './src/runScripts';
import getAllScriptsNames from './src/getAllScriptsNames';
import { endStream } from './src/Logger/writeStream';

const initScriptRunner = async () => {
    console.info('🏃💨 SCRIPT RUNNER 🏃💨');
    const scriptsNames = await getAllScriptsNames();

    await runScripts(scriptsNames);
    endStream();
}

export default initScriptRunner;