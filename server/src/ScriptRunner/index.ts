import runScripts from './src/runScripts';
import getAllScriptsNames from './src/getAllScriptsNames';

const initScriptRunner = async () => {
    console.info('🏃💨 SCRIPT RUNNER 🏃💨')
    const scriptsNames = await getAllScriptsNames();

    runScripts(scriptsNames);
}

export default initScriptRunner;