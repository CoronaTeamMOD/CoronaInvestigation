import axios  from 'axios';
import { useState } from 'react';

import logger from 'logger/logger';
import Airline from 'models/Airline';
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setAirlines } from 'redux/Airlines/airlineActionCreators';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const useAdminDBAction = (props: Props) => {

    const [flightCompany, setFlightCompany] = useState<Airline | null>(null);
    const [newFlightCompany, setNewFlightCompany] = useState<string>('');
    const [newFlightNumber, setNewFlightNumber] = useState<string>('');
    
    const { alertError } = useCustomSwal();

    const saveNewFlightCompany = (newFlightCompany: string) : Promise<any> => {
        const setSaveFlightCompanyLogger = logger.setup('Saving new flight company');
        setSaveFlightCompanyLogger.info('send request to server for saving new flight company', Severity.LOW);
        setIsLoading(true);
        return axios.post('/airlines/airline', {
            newFlightCompany
        }).then((result) => {
            if(result.data){            
                setSaveFlightCompanyLogger.info('Saved new flight company successfully', Severity.LOW);
                fetchAirlines();
            }
        }).catch((error) => {
            alertError('לא הצלחנו לשמור את חברת התעופה');
            setSaveFlightCompanyLogger.error(`error in saving new flight company: ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    };
    
    const saveNewFlightNumber = (flightCompany: Airline | null, newFlightNumber: string) : Promise<any> => {
        const setSaveFlightNumberLogger = logger.setup('Saving new flight number');
        setSaveFlightNumberLogger.info('send request to server for saving new flight number', Severity.LOW);
        setIsLoading(true);
        return axios.post('/airlines/flights/flight', {
            flightCompanyId: flightCompany?.id,
            newFlightNumber
        }).then((result) => {
            setSaveFlightNumberLogger.info('Saved new flight number successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לשמור את מספר הטיסה');
            setSaveFlightNumberLogger.error(`error in saving new flight number: ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    };

    
    const fetchAirlines = () => {
        const airlineLogger = logger.setup('Fetching Airlines');

        airlineLogger.info('launching DB request', Severity.LOW);
        axios.get<Airline[]>('/airlines')
            .then(result => {
                airlineLogger.info('request was successful', Severity.LOW);

                const airlinesMap = airlineListToMap(result.data);
                setAirlines(airlinesMap);
            })
            .catch(err => {
                airlineLogger.error(`recived error during request, err: ${err}`, Severity.HIGH);
            });
    };

    const airlineListToMap = (airlines : Airline[]) => {
        return new Map(airlines.map(airline => [airline.id, airline.displayName]));
    };

    return {
        flightCompany, setFlightCompany,
        newFlightCompany, setNewFlightCompany,
        newFlightNumber, setNewFlightNumber,
        saveNewFlightNumber, saveNewFlightCompany
    };
};

interface Props {

};

export default useAdminDBAction;