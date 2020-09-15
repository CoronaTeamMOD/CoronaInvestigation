import cors from 'cors';
import express from 'express';
import {NextFunction, Request, Response} from "express";
import bodyParser from 'body-parser';
// @ts-ignore
import passport from "passport";
// @ts-ignore
import passportAzureAd from "passport-azure-ad";
import MOHApi from './MOHAPI/mainRoute';
import ClientToDBApi from './ClientToDBAPI/mainRoute';
import postgraphileServices from './DBService/postgraphile';

require('dotenv').config();

const app = express();
app.use(
    cors({
        origin: JSON.parse(`${process.env.CORS_ALLOWED_ORIGINS}`),
    })
);

const BearerStrategy = passportAzureAd.BearerStrategy;
const options = {
    identityMetadata:
        `https://login.microsoftonline.com/${process.env.TENANT}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.clientID,
    issuer: `https://sts.windows.net/${process.env.TENANT}/`,
    loggingLevel: "info",
    passReqToCallback: false
};

const authenticationStrategy = new BearerStrategy(options, (token:any, done:any) => {
    return done(null, {}, token);
});
passport.use(authenticationStrategy);
app.use(passport);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/mohApi', MOHApi);
app.use('/clientToDBApi', passport.authenticate("oauth-bearer", { session: false }), ClientToDBApi);


postgraphileServices.forEach(postgraphileService => {
    app.use(postgraphileService);
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});
