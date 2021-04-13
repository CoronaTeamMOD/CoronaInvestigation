import runScripts from './src/runScripts';
import getAllScriptsNames from './src/getAllScriptsNames';
import exportRunLogs from './src/exportRunLogs';

const initScriptRunner = async () => {
    console.info('🏃💨 SCRIPT RUNNER 🏃💨');
    const scriptsNames = await getAllScriptsNames();

    const runLogs = await runScripts(scriptsNames);
    exportRunLogs(runLogs);
}

export default initScriptRunner;