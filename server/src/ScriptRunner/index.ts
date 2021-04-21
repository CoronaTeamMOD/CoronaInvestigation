import runScripts from './src/runScripts';
import CURRENT_DIRECTORY from './common/SCRIPTS_DIRECTORY';
import getScriptsNamesByFolder from './src/getScriptsNamesByFolder';

const initScriptRunner = async () => {
    console.info('🏃💨 SCRIPT RUNNER 🏃💨');
    const scriptsNames = await getScriptsNamesByFolder(CURRENT_DIRECTORY);

    await runScripts(scriptsNames, CURRENT_DIRECTORY);
}

export default initScriptRunner;