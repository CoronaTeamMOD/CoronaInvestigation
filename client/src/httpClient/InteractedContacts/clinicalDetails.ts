import axios from "axios";
import { initialClinicalDetails } from "components/App/Content/InvestigationForm/TabManagement/ClinicalDetails/useClinicalDetails";
import logger from 'logger/logger';
import ClinicalDetailsData from "models/Contexts/ClinicalDetailsContextData";
import FlattenedDBAddress from "models/DBAddress";
import { Severity } from "models/Logger";
import { useDateUtils } from "Utils/DateUtils/useDateUtils";

const { convertDate } = useDateUtils();

export const fetchClinicalDetails = async (address: FlattenedDBAddress): Promise<ClinicalDetailsData | null> => {
    const fetchClinicalDetailsLogger = logger.setup('Fetching Clinical Details');
    fetchClinicalDetailsLogger.info('launching clinical data request', Severity.LOW);
    try {
        const result = await axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields`);

        if (result?.data) {
            fetchClinicalDetailsLogger.info('got results back from the server', Severity.LOW);
            const patientClinicalDetails = result.data;
            let patientAddress = patientClinicalDetails.isolationAddress;
            if (!patientAddress?.cityByCity && !patientAddress?.streetByStreet && !patientAddress?.houseNum && !patientAddress?.apartment) {
                patientAddress = address;
            }
            else {
                patientAddress = {
                    city: patientAddress.cityByCity?.id,
                    street: patientAddress.streetByStreet?.id,
                    apartment: patientAddress.apartment,
                    houseNum: patientAddress.houseNum,
                }
            }
            const initialDBClinicalDetailsToSet = {
                ...initialClinicalDetails,
                isPregnant: patientClinicalDetails.isPregnant !== null ? Boolean(patientClinicalDetails.isPregnant) : null,
                backgroundDeseases: patientClinicalDetails.backgroundDiseases,
                doesHaveBackgroundDiseases: patientClinicalDetails.doesHaveBackgroundDiseases,
                hospital: patientClinicalDetails.hospital !== null ? patientClinicalDetails.hospital : '',
                hospitalizationStartDate: convertDate(patientClinicalDetails.hospitalizationStartTime),
                hospitalizationEndDate: convertDate(patientClinicalDetails.hospitalizationEndTime),
                isInIsolation: patientClinicalDetails.isInIsolation,
                isIsolationProblem: patientClinicalDetails.isIsolationProblem,
                isIsolationProblemMoreInfo: patientClinicalDetails.isIsolationProblemMoreInfo !== null ?
                    patientClinicalDetails.isIsolationProblemMoreInfo : '',
                isolationStartDate: convertDate(patientClinicalDetails.isolationStartTime),
                isolationEndDate: convertDate(patientClinicalDetails.isolationEndTime),
                isolationSource: patientClinicalDetails.isolationSource,
                isolationSourceDesc: patientClinicalDetails.isolationSourceDesc,
                symptoms: patientClinicalDetails.symptoms,
                symptomsStartDate: convertDate(patientClinicalDetails.symptomsStartDate),
                isSymptomsStartDateUnknown: patientClinicalDetails.symptomsStartTime === null,
                doesHaveSymptoms: patientClinicalDetails.doesHaveSymptoms,
                wasHospitalized: Boolean(patientClinicalDetails.wasHospitalized),
                isolationAddress: patientAddress,
                otherSymptomsMoreInfo: patientClinicalDetails.otherSymptomsMoreInfo !== null ?
                    patientClinicalDetails.otherSymptomsMoreInfo : '',
                otherBackgroundDiseasesMoreInfo: patientClinicalDetails.otherBackgroundDiseasesMoreInfo !== null ?
                    patientClinicalDetails.otherBackgroundDiseasesMoreInfo : '',
            }
            console.log('in fetch',initialDBClinicalDetailsToSet)
            return initialDBClinicalDetailsToSet;
        } else {
            fetchClinicalDetailsLogger.warn('got status 200 but got invalid outcome', Severity.HIGH);
            return null;

        }
    }
    catch (err) {
        return err;
    }
};