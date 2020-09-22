import {useSelector} from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import {fieldsNames, ExposureAndFlightsDetails} from 'commons/Contexts/ExposuresAndFlights';
import {useInvestigationFormParameters} from 'components/App/Content/InvestigationForm/InvestigationFormInterfaces';

import axios from '../axios';
import useDBParser from '../vendor/useDBParsing';

const useExposuresSaving = (exposuresAndFlightsVariables: useInvestigationFormParameters['exposuresAndFlightsVariables']) => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const {parseLocation} = useDBParser();

    const saveExposureAndFlightData = async () : Promise<void> => {
        const exposureData = await extractExposureData(exposuresAndFlightsVariables.exposureAndFlightsData);

        return axios.post('/exposure/updateExposures', {
            exposures: exposuresAndFlightsVariables.exposureAndFlightsData.exposures,
            investigationId: epidemiologyNumber
        });
    }

    const extractExposureData = async (exposuresAndFlights : ExposureAndFlightsDetails ) => {
        exposuresAndFlights.exposures.map(exposuresAndFlightsData => {
            let exposureAndDataToReturn = exposuresAndFlightsData;
            if (!exposuresAndFlightsData.wasConfirmedExposure) {
                exposureAndDataToReturn = {
                    ...exposureAndDataToReturn,
                    [fieldsNames.firstName]: '',
                    [fieldsNames.lastName]: '',
                    [fieldsNames.date]: undefined,
                    [fieldsNames.address]: null,
                    [fieldsNames.placeType]: null,
                    [fieldsNames.placeSubType] : null,
                }
            } else {
                exposureAndDataToReturn = {
                    ...exposureAndDataToReturn,
                    // @ts-ignore
                    exposureAddress: parseLocation(exposuresAndFlightsData.exposureAddress)
                }
            }
            if (!exposuresAndFlightsData.wasAbroad) {
                exposureAndDataToReturn = {
                    ...exposureAndDataToReturn,
                    [fieldsNames.destinationCountry]: null,
                    [fieldsNames.destinationCity]: '',
                    [fieldsNames.destinationAirport]: '',
                    [fieldsNames.originCountry]: null,
                    [fieldsNames.originCity]: '',
                    [fieldsNames.originAirport]: '',
                    [fieldsNames.flightStartDate]: undefined,
                    [fieldsNames.flightEndDate]: undefined,
                    [fieldsNames.airline]: '',
                    [fieldsNames.flightNumber]: ''
                }
            }
            return exposureAndDataToReturn;
        })
    }

    return {
        saveExposureAndFlightData
    }
};

export default useExposuresSaving;