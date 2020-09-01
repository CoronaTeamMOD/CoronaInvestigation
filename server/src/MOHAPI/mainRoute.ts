import { Router, Request, Response } from 'express';
import axios from 'axios';
const mohRouter = Router();

const countriespi = 'https://www.iaa.gov.il/he-IL/airports/BenGurion/_layouts/15/IAAWebSite/WS/FlightsUtils.asmx/GetCountries';
const citiesApi = 'https://www.iaa.gov.il/he-IL/airports/BenGurion/_layouts/15/IAAWebSite/WS/FlightsUtils.asmx/GetCitiesByCountry';
const airportsApi = 'https://www.iaa.gov.il/he-IL/airports/BenGurion/_layouts/15/IAAWebSite/WS/FlightsUtils.asmx/GetAirportsByCity';
const Cookie = 'visid_incap_1276841=9wOiQO2YTtuyQk3ZpKrAVQ73TV8AAAAAQUIPAAAAAAC//+Ysd2snduf7MpNY6PnW; incap_ses_7213_1276841=/D32UROtyV55QZlGabkZZC8YTl8AAAAAVse+ADyz0ak/E4FtXnze7g==; incap_ses_1052_1276841=LU3SWHPQsHGuXP6tonSZDh8jTl8AAAAAMmNZAbc9Hm7RRndYud1nRA==; TS01512257=010f83961d1d6243f0ba9d76da47875109b65083e6c4e679f4df34fb54b9c8dedfe0ebcdf7c03ca01943f3f2569e36dbf019d92905; incap_ses_820_1276841=UJ6mKj+Uqzz24AFe1jlhC/6YTl8AAAAAoswc0nuqdHE5q+EU0rwIKg==';

mohRouter.post('/airports', async (request: Request, response: Response) => {
    if(!request.body)
        return response.sendStatus(400);

    const {
        currentAirport,
        cityId,
        prefix
    } = request.body;

    return await axios.post( airportsApi, {
        currentAirport,
        cityId,
        prefix
    }, {headers:{Cookie}})
        .then(result => {
            return result ? response.json(result.data) : response.sendStatus(404)
        })
        .catch(error => {
            console.log(error);
            response.sendStatus(500)
        })
});

mohRouter.post('/cities', async (request: Request, response: Response) => {
    if(!request.body)
        return response.sendStatus(400);

    const {
            currentAirport,
            countryId,
            prefix
        } = request.body;



    return await axios.post( citiesApi, {
        currentAirport,
        countryId,
        prefix
    }, {headers:{Cookie}})
        .then(result => {
            return result ? response.json(result.data) : response.sendStatus(404)
        })
        .catch(error => {
            console.log(error);
            response.sendStatus(500)
        })
});

mohRouter.get('/', (request: Request, response: Response) => {
    response.send('Hello from MOH Api');
})

export default mohRouter;