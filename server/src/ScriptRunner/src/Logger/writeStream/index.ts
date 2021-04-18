import fs from 'fs';
import path from 'path';
import { format } from 'fast-csv';

import CSV_HEADERS from './csv-headers';

const PATH_TO_LOG_FILE = path.resolve(__dirname , '../../../Logs/log.csv');

const stream = format({ headers : true });
const ws = fs.createWriteStream(PATH_TO_LOG_FILE);

stream.pipe(ws);
stream.write(CSV_HEADERS);

const writeToStream = (row : string[]) => {
    console.log(row.join(','));
    stream.write(row);
}

const endStream = () => {
    stream.end();
}

export {
    writeToStream,
    endStream
}