import React from 'react';
import axios  from 'axios';
import { addDays } from 'date-fns';
import { useSelector } from 'react-redux';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import CovidPatient from 'models/CovidPatient';
import StoreStateType from 'redux/storeStateType';
import CovidPatientFields from 'models/CovidPatientFields';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import PersonalDetailsQueryParams from 'models/ExposureForm/PersonalDetailsQueryParams';

export const displayPatientFields: CovidPatientFields = {
    fullName: 'שם',
    age: 'גיל',
    address: 'כתובת',
};

const useExposureForm = (props: Props) => {
    const { alertError } = useCustomSwal();

    const validationDate = useSelector<StoreStateType, Date>((state) => state.investigation.validationDate);
    const formattedValidationDate = addDays(validationDate , 1).toISOString() // the date is rounded down so we need to ceil it 
    const { exposureAndFlightsData, exposureSourceSearchString , setOptionalPatientsLoading} = props;

    const minSourceSearchLengthToSearch: number = 2;

    const fetchOptionalCovidPatients = async (): Promise<CovidPatient[]> => {
        if (exposureAndFlightsData.exposureSource || exposureSourceSearchString.length < minSourceSearchLengthToSearch) {
            return [];
        } else {
            const confirmedExposuresLogger = logger.setup('Fetching list of confirmed exposures');
            setOptionalPatientsLoading(true);
            confirmedExposuresLogger.info(
                `launching request with parameters ${exposureSourceSearchString} and ${formattedValidationDate}`,
                Severity.LOW
            );
            const optionalCovidPatients = await axios
                .get(`/exposure/optionalExposureSources/${exposureSourceSearchString}/${formattedValidationDate}`)
                .then((result) => {
                    if (result?.data && result.headers['content-type'].includes('application/json')) {
                        confirmedExposuresLogger.info('got results back from the server', Severity.LOW);
                        return result.data;
                    } else {
                        confirmedExposuresLogger.warn('got status 200 but wrong data', Severity.HIGH);
                        alertError('לא הצלחנו לטעון את רשימת המאומתים', {
                            text: 'שימו לב שהזנתם נתונים תקינים',
                        });
                        return [];
                    }
                })
                .catch((error) => {
                    confirmedExposuresLogger.error(`got error from server: ${error}`, Severity.HIGH);
                    alertError('לא הצלחנו לטעון את רשימת המאומתים', {
                        text: 'שימו לב שהזנתם נתונים תקינים',
                    });
                    return [];
                })
                .finally(() => setOptionalPatientsLoading(false));
            return optionalCovidPatients;
        }
    }

    const fetchCovidPatientsByPersonalDetails = async (params : PersonalDetailsQueryParams) => {
        const patientsByPersonalDetailsLogger = logger.setup('Fetch confirmed exposures by personal details');

        const { phoneNumber, name } = params;
        const query = `name=${name}&phoneNum=${phoneNumber}`;
        const optionalCovidPatients = await axios
            .get<CovidPatient[]>(`/exposure/exposuresByPersonalDetails/${formattedValidationDate}?${query}`)
            .then(result => {
                patientsByPersonalDetailsLogger.info('got results back from the server', Severity.LOW);
                return result.data;
            })
            .catch(err => {
                patientsByPersonalDetailsLogger.warn(`got error from server: ${err}`, Severity.HIGH);
                return [];
            })
        return optionalCovidPatients;
    }

    const fetchCovidPatientsByEpidemiologyNumber = async (epidemiologyNumber: string) => {
        const patientsByEpidemiologyNumberLogger = logger.setup('Fetch confirmed exposures by personal details');

        const query = `epidemiologyNumber=${epidemiologyNumber}`;
        const optionalCovidPatients = await axios
            .get<CovidPatient[]>(`/exposure/exposuresByEpidemiologyNumber/${formattedValidationDate}?${query}`)
            .then(result => {
                patientsByEpidemiologyNumberLogger.info('got results back from the server', Severity.LOW);

                const { data } = result;
                return data;
            })
            .catch(err => {
                patientsByEpidemiologyNumberLogger.warn(`got error from server: ${err}`, Severity.HIGH);
                return [];
            })
        return optionalCovidPatients;
    }
    
    const selectedExposureSourceDisplay = (exposureSource: CovidPatient): string => {
        const fields: string[] = [];
        exposureSource.fullName && fields.push(displayPatientFields.fullName + ': ' + exposureSource.fullName);
        exposureSource.age && fields.push(displayPatientFields.age + ': ' + exposureSource.age);
        exposureSource.address && fields.push(displayPatientFields.address + ': ' + exposureSource.address);
        return fields.join(', ');
    }

    return {
        fetchOptionalCovidPatients,
        selectedExposureSourceDisplay,
        fetchCovidPatientsByPersonalDetails,
        fetchCovidPatientsByEpidemiologyNumber
    }
}

export default useExposureForm;

interface Props {
    exposureAndFlightsData : Exposure;
    exposureSourceSearchString : string;
    setOptionalPatientsLoading: React.Dispatch<React.SetStateAction<boolean>> 
}
