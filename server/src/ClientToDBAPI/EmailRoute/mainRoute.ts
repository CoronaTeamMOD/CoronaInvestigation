import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog } from '../../Logger/Logger';

const emailRoute = Router();

const nodemailer = require('nodemailer');

emailRoute.post('/sendEmail/', (req: Request, res: Response) => {
    const parameters = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };

    const sendEmailLogger = logger.setup({
        workflow: 'send email',
    });

    sendEmailLogger.info(launchingAPIRequestLog(), Severity.LOW);
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'moh.automatic.mail@gmail.com',
          pass: 'moh.automatic.mail@gmail.com123'
        }
    });

    var mailOptions = {
        from: parameters.from,
        to: parameters.to,
        subject: parameters.subject,
        text: parameters.text,
    };

    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
        if (error) {
          sendEmailLogger.error(invalidAPIResponseLog(error), Severity.HIGH);

        } else {
          sendEmailLogger.info(launchingAPIRequestLog(info.response), Severity.LOW);
        }
      });
});

export default emailRoute;