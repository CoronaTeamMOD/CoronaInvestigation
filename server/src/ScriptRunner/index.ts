import runScripts from './src/runScripts';
import getAllScriptsNames from './src/getAllScriptsNames';

import CURRENT_DIRECTORY from './common/SCRIPTS_DIRECTORY';

const initScriptRunner = async () => {
    console.info('🏃💨 SCRIPT RUNNER 🏃💨');
    const scriptsNames = await getAllScriptsNames(CURRENT_DIRECTORY);

    await runScripts(scriptsNames, CURRENT_DIRECTORY);
}

export default initScriptRunner;