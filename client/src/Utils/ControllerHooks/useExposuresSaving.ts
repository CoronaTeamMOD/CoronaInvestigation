import {useSelector} from "react-redux";
import StoreStateType from "redux/storeStateType";
import axios from "../axios";
import {useInvestigationFormParameters} from "components/App/Content/InvestigationForm/InvestigationFormInterfaces";
import {ExposureAndFlightsDetails, fieldsNames} from "commons/Contexts/ExposuresAndFlights";
import useDBParser from "../vendor/useDBParsing";

const useExposuresSaving = (exposuresAndFlightsVariables: useInvestigationFormParameters['exposuresAndFlightsVariables']) => {
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const {parseLocation} = useDBParser();

    const saveExposureAndFlightData = async () : Promise<void> => {
        const exposureData = await extractExposuresAndFlightData(exposuresAndFlightsVariables.exposureAndFlightsData);

        if (exposuresAndFlightsVariables.exposureAndFlightsData.id) {
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
        saveExposureAndFlightData
    }
};

export default useExposuresSaving;