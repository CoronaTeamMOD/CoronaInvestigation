import flushCache from '../../../../Cache/flushCache';
import { Request , Response } from 'express';

const getFlush = (req: Request, res: Response) => {
   flushCache();
   res.status(200).send('🎉');
}

export default getFlush;