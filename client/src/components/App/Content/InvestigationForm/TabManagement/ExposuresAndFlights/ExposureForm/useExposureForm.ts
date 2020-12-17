import React from 'react'
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import CovidPatient from 'models/CovidPatient';
import StoreStateType from 'redux/storeStateType';
import CovidPatientFields from 'models/CovidPatientFields';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import {Exposure} from 'commons/Contexts/ExposuresAndFlights';

export const displayPatientFields: CovidPatientFields = {
    fullName: 'שם',
    age: 'גיל',
    address: 'כתובת',
}
  

const minFullNameLengthToSearch = 2;
const minNumbersLengthToSearch = 4;
const phoneAndIdentityNumberRegex = /^([\da-zA-Z]+)$/;

const useExposureForm = (props : Props) => {
    const { alertError } = useCustomSwal();

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const validationDate = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const {exposureAndFlightsData , exposureSourceSearchString} = props;

    const minSourceSearchLengthToSearch: number = React.useMemo(
        () => phoneAndIdentityNumberRegex.test(exposureSourceSearchString) ? minNumbersLengthToSearch : minFullNameLengthToSearch,
        [exposureSourceSearchString]);

    const fetchOptionalCovidPatients = async (props : getOptionalCovidPatientsProps) : Promise<CovidPatient[]> => {
        const {setIsLoading} = props;
        if (
            exposureAndFlightsData.exposureSource ||
            exposureSourceSearchString.length < minSourceSearchLengthToSearch
        ) {
            return [];
            //setOptionalCovidPatients([]); 
        } else {
            const confirmedExposuresLogger = logger.setup({
                workflow: "Fetching list of confirmed exposures",
                investigation: epidemiologyNumber,
                user: userId,
            });
            setIsLoading(true);
            confirmedExposuresLogger.info(
                `launching request with parameters ${exposureSourceSearchString} and ${validationDate}`,
                Severity.LOW
            );
            const optionalCovidPatients = await axios
                .get(
                    `/exposure/optionalExposureSources/${exposureSourceSearchString}/${validationDate}`
                )
                .then((result) => {
                    if (
                        result?.data &&
                        result.headers["content-type"].includes(
                            "application/json"
                        )
                    ) {
                        confirmedExposuresLogger.info(
                            "got results back from the server",
                            Severity.LOW
                        );
                        return result.data;
                        // setOptionalCovidPatients(result.data); 
                    } else {
                        confirmedExposuresLogger.warn(
                            "got status 200 but wrong data",
                            Severity.HIGH
                        );
                        alertError("לא הצלחנו לטעון את רשימת המאומתים", {
                            text: "שימו לב שהזנתם נתונים תקינים",
                        });
                        return [];
                    }
                })
                .catch((error) => {
                    confirmedExposuresLogger.error(
                        `got error from server: ${error}`,
                        Severity.HIGH
                    );
                    alertError("לא הצלחנו לטעון את רשימת המאומתים", {
                        text: "שימו לב שהזנתם נתונים תקינים",
                    });
                    return [];
                })
                .finally(() => setIsLoading(false));
            return optionalCovidPatients;
        }
    }
    
    const selectedExposureSourceDisplay = (exposureSource: CovidPatient): string => {
        const fields: string[] = [];
        exposureSource.fullName && fields.push(displayPatientFields.fullName + ': ' + exposureSource.fullName);
        (exposureSource.age && exposureSource.age !== -1) && fields.push(displayPatientFields.age + ': ' + exposureSource.age);
        exposureSource.address && fields.push(displayPatientFields.address + ': ' + exposureSource.address);
        return fields.join(', ');
    }

    return {
        fetchOptionalCovidPatients,
        selectedExposureSourceDisplay
    }
}

export default useExposureForm;

interface Props {
    exposureAndFlightsData : Exposure;
    exposureSourceSearchString : string;
}

interface getOptionalCovidPatientsProps {
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>
}