import fs from 'fs'
import path from 'path';

const PATH_TO_BLACKLIST = path.resolve(__dirname , '../Logs/blacklist.txt');

const shouldRunScript = (name : string) => {
    let blacklist: string[];
    try {
        blacklist = fs.readFileSync(PATH_TO_BLACKLIST).toString().split(',')
    } catch {
        return false;
    }

    return !blacklist.includes(name);
}

export default shouldRunScript;