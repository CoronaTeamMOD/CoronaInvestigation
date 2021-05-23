import axios  from 'axios';
import { useState } from 'react';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const useAdminDBAction = (props: Props) => {

    const [flightCompany, setFlightCompany] = useState<string>('');
    const [flightNumber, setFlightNumber] = useState<string>('');
    
    const { alertError } = useCustomSwal();

    const saveFlightCompany = (flightCompany: string) : Promise<any> => {
        const setSaveFlightCompanyLogger = logger.setup('Saving new flight company');
        setSaveFlightCompanyLogger.info('send request to server for saving new flight company', Severity.LOW);
        setIsLoading(true);
        return axios.post('/airlines/airline', {
            flightCompany
        }).then((result) => {
            if(result.data)
            setSaveFlightCompanyLogger.info('Saved new flight company successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לשמור חברת תעופה');
            setSaveFlightCompanyLogger.error(`error in saving new flight company: ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    };
    
    const saveFlightNumber = (flightNumber: string) : Promise<any> => {
        const setSaveFlightNumberLogger = logger.setup('Saving new flight number');
        setSaveFlightNumberLogger.info('send request to server for saving new flight number', Severity.LOW);
        setIsLoading(true);
        return axios.post('/airlines/flights/flight', {
            flightNumber
        }).then((result) => {
            if(result.data)
            setSaveFlightNumberLogger.info('Saved new flight number successfully', Severity.LOW);
        }).catch((error) => {
            alertError('לא הצלחנו לשמור מספר טיסה');
            setSaveFlightNumberLogger.error(`error in saving new flight number: ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    };

    return {
        flightCompany, setFlightCompany,
        flightNumber, setFlightNumber,
        saveFlightNumber, saveFlightCompany
    };
};

interface Props {

};

export default useAdminDBAction;