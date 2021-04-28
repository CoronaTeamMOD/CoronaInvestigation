import { Request , Response } from 'express';

import flushCache from '../../../../Cache/flushCache';

const getFlush = (req: Request, res: Response) => {
   flushCache();
   res.status(200).send('🎉');
};

export default getFlush;