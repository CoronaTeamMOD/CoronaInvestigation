import { Request , Response } from 'express';

const getLog = (req : Request , res : Response) => {
    res.sendStatus(200);
}

export default getLog;