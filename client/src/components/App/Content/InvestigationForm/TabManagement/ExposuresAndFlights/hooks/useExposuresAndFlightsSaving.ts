import { useSelector } from "react-redux";
import StoreStateType from "redux/storeStateType";

import useDBParser from 'Utils/vendor/useDBParsing';
import axios from 'Utils/axios';
import ExposureData from 'models/ExposureData';
import FlightData from 'models/FlightData';

export type ExposureAndFlightsDetails = ExposureData & FlightData;

export const fieldsNames = {
    wasConfirmedExposure: "wasConfirmedExposure",
    firstName: "exposureFirstName",
    lastName: "exposureLastName",
    date: "exposureDate",
    address: "exposureAddress",
    placeType: "exposurePlaceType",
    placeSubType: "exposurePlaceSubType",
    wasAbroad: "wasAbroad",
    destinationCountry: "flightDestinationCountry",
    destinationCity: "flightDestinationCity",
    destinationAirport: "flightDestinationAirport",
    originCountry: "flightOriginCountry",
    originCity: "flightOriginCity",
    originAirport: "flightOriginAirport",
    flightStartDate: "flightStartDate",
    flightEndDate: "flightEndDate",
    airline: "airline",
    flightNumber: "flightNum",
  };

export const useExposuresAndFlightsSaving = (exposuresAndFlightsData : ExposureAndFlightsDetails) => {

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const { parseLocation } = useDBParser();

    const saveExposuresAndFlightsData = async () : Promise<void> => {
        const exposuresAndFlightsDataToSave = await extractExposuresAndFlightData(exposuresAndFlightsData);

        if (exposuresAndFlightsData.id) {
            return axios.put('/exposure', {
                exposureDetails:  exposuresAndFlightsDataToSave
            });
        } else {
            return axios.post('/exposure', {
                exposureDetails: {
                    ...exposuresAndFlightsDataToSave,
                    investigationId: epidemiologyNumber
                }
            });
        }
    }

    const extractExposuresAndFlightData = async (exposuresAndFlightsData : ExposureAndFlightsDetails ) => {
        let exposureAndDataToReturn = exposuresAndFlightsData;
        if (exposureAndDataToReturn.exposureAddress) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                // @ts-ignore
                exposureAddress: await parseLocation(exposureAndDataToReturn.exposureAddress)
            }
        }
        if (!exposureAndDataToReturn.wasConfirmedExposure) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.firstName]: null,
                [fieldsNames.lastName]: null,
                [fieldsNames.date]: null,
                [fieldsNames.address]: null,
                [fieldsNames.placeType]: null,
                [fieldsNames.placeSubType] : null,
            }
        }
        if (!exposureAndDataToReturn.wasAbroad) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.destinationCountry]: null,
                [fieldsNames.destinationCity]: null,
                [fieldsNames.destinationAirport]: null,
                [fieldsNames.originCountry]: null,
                [fieldsNames.originCity]: null,
                [fieldsNames.originAirport]: null,
                [fieldsNames.flightStartDate]: undefined,
                [fieldsNames.flightEndDate]: undefined,
                [fieldsNames.airline]: null,
                [fieldsNames.flightNumber]: null
            }
        }
        return exposureAndDataToReturn;
    }

    return {
        saveExposuresAndFlightsData
    }
};

