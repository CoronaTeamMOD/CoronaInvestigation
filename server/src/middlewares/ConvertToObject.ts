import { Request, Response, NextFunction } from 'express';

const convertToJson = (req: Request, res: Response, next: NextFunction) => {
    if (req.body && Object.keys(req.body).length > 0) {
        req.body = JSON.parse(req.body);
        console.log(req.body)
    }
    next();
}

export default convertToJson;