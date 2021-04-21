import fs from 'fs';
import path from 'path';

const getScriptsNamesByFolder = async (direcrory: string) => {
    const dir = await fs.promises.opendir(path.resolve(__dirname , `../Scripts/${direcrory}`));
    
    let names = [];
    for await (const dirent of dir) {
        const {name} = dirent;
        if(name.split('.')[name.split('.').length - 1] === 'sql') {
            names.push(name);
        }
    }

    return names;
}

export default getScriptsNamesByFolder;
