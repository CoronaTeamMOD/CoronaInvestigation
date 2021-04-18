import runScripts from './src/runScripts';
import getAllScriptsNames from './src/getAllScriptsNames';

const initScriptRunner = async () => {
    console.info('🏃💨 SCRIPT RUNNER 🏃💨');
    const scriptsNames = await getAllScriptsNames();

    await runScripts(scriptsNames);
}

export default initScriptRunner;