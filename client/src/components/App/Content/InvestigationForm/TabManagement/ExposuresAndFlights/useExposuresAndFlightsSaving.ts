import { useSelector } from "react-redux";
import StoreStateType from "redux/storeStateType";

import { ExposureAndFlightsDetails, fieldsNames } from "commons/Contexts/ExposuresAndFlights";
import axios from "Utils/axios";
import useDBParser from "Utils/vendor/useDBParsing";

const useExposuresAndFlightsSaving = () => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const {parseLocation} = useDBParser();

    const saveExposuresAndFlightsData = async (exposureAndFlightsData : any | ExposureAndFlightsDetails) : Promise<void> => {
        const exposureData = await extractExposuresAndFlightData(exposureAndFlightsData);

        if (exposureAndFlightsData.id) {
            return axios.put('/exposure', {
                exposureDetails:  exposureData
            });
        } else {
            return axios.post('/exposure', {
                exposureDetails: {
                    ...exposureData,
                    investigationId: epidemiologyNumber
                }
            });
        }
    }

    const extractExposuresAndFlightData = async (exposuresAndFlightsData : ExposureAndFlightsDetails ) => {
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
                exposureAddress: await parseLocation(exposuresAndFlightsData.exposureAddress)
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
    }

    return {
        saveExposuresAndFlightsData
    }
};

export default useExposuresAndFlightsSaving;