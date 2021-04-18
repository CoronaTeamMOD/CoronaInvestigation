import fs from 'fs';
import path from 'path';
const BLACKLIST_FILE_PATH = path.resolve(__dirname , '../Logs/blacklist.txt') 

const blacklistFile = (filename : string) => {
    fs.appendFileSync(BLACKLIST_FILE_PATH , `${filename},`);
}

export default blacklistFile;