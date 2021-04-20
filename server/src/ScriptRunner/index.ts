import runScripts from './src/runScripts';
import getScriptsNamesByFolder from './src/getScriptsNamesByFolder';

import CURRENT_DIRECTORY from './common/SCRIPTS_DIRECTORY';

const initScriptRunner = async () => {
    console.info('🏃💨 SCRIPT RUNNER 🏃💨');
    const scriptsNames = await getScriptsNamesByFolder(CURRENT_DIRECTORY);

    await runScripts(scriptsNames, CURRENT_DIRECTORY);
}

export default initScriptRunner;