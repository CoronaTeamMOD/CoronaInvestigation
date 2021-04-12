import fs from 'fs';
import path from 'path';
import CURRENT_DIRECTORY from '../common/SCRIPTS_DIRECTORY';

const getAllScriptsNames = async () => {
    const dir = await fs.promises.opendir(path.resolve(__dirname , `../Scripts/${CURRENT_DIRECTORY}`));
    
    let names = [];
    for await (const dirent of dir) {
        const {name} = dirent;
        if(name.split('.')[-1] !== 'sql') {
            names.push(name);
        }
    }

    return names;
}

export default getAllScriptsNames;
