import { Router, Request, Response } from 'express';
import axios from 'axios';
const mohRouter = Router();

const countriespi = 'https://www.iaa.gov.il/he-IL/airports/BenGurion/_layouts/15/IAAWebSite/WS/FlightsUtils.asmx/GetCountries';
const citiesApi = 'https://www.iaa.gov.il/he-IL/airports/BenGurion/_layouts/15/IAAWebSite/WS/FlightsUtils.asmx/GetCitiesByCountry';
const airportsApi = 'https://www.iaa.gov.il/he-IL/airports/BenGurion/_layouts/15/IAAWebSite/WS/FlightsUtils.asmx/GetAirportsByCity';
const Cookie = '';

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