import axios from 'axios';
import {Severity} from '../../models/Logger';
import Street from '../../models/Street';
import logger from '../../logger/logger';

type Streets = Map<string, Street>;

export const getStreetByCity = (cityId: string, callback: (streets: Streets) => void) => {
    const getStreetByCityLogger = logger.setup('Getting streets of city');
    getStreetByCityLogger.info(`launching request to server with parameter ${cityId}`, Severity.LOW);
    axios.get('/addressDetails/city/' + cityId + '/streets').then(result => {
            if (result?.data) {
                getStreetByCityLogger.info('got data from the server', Severity.LOW);
                const streets: Streets = new Map();
                result.data.forEach((street: Street) => {
                    streets.set(street.id, street)
                });
                callback(streets);
            } else {
                getStreetByCityLogger.error(`got errors in server result: ${JSON.stringify(result)}`, Severity.HIGH);
            }
        }
    )
};