import axios from 'axios';
import { PersonalInfoTabState } from 'components/App/Content/InvestigationForm/TabManagement/PersonalInfoTab/PersonalInfoTabInterfaces';
import { initDBAddress } from 'models/DBAddress';
import Occupations from 'models/enums/Occupations';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { throwError } from 'rxjs';
import logger from '../../logger/logger';
import { Severity } from '../../models/Logger';

const personalDetailsLogger = logger.setup('Fetching Personal Details');

export const getPersonalInfoData = async (epidemiologyNumber: number)
: Promise<any> => {
    try {
        const res = await axios.get('/personalDetails/investigatedPatientPersonalInfoFields?epidemioligyNumber=' + epidemiologyNumber);

        if (res?.data) {
            const personalDetailsLogger = logger.setup('Fetching Personal Details');
            personalDetailsLogger.info('got results back from the server', Severity.LOW);
            const investigatedPatient = res.data;
            const patientAddress = investigatedPatient.addressByAddress;
            let convertedPatientAddress = null;
            if (patientAddress) {
                let city = null;
                let street = null;
                if (patientAddress.cityByCity !== null) {
                    city = patientAddress.cityByCity.id;
                }
                if (patientAddress.streetByStreet !== null) {
                    street = patientAddress.streetByStreet.id;
                }
                convertedPatientAddress = {
                    city,
                    street,
                    apartment: patientAddress.apartment,
                    houseNum: patientAddress.houseNum,
                }
            } else {
                convertedPatientAddress = initDBAddress;
            }
            const personalInfo: PersonalInfoTabState = {
                phoneNumber: investigatedPatient.primaryPhone,
                additionalPhoneNumber: investigatedPatient.additionalPhoneNumber,
                contactPhoneNumber: investigatedPatient.patientContactPhoneNumber,
                insuranceCompany: investigatedPatient.hmo,
                address: convertedPatientAddress,
                relevantOccupation: investigatedPatient.occupation,
                educationOccupationCity: (investigatedPatient.occupation === Occupations.EDUCATION_SYSTEM && investigatedPatient.subOccupationBySubOccupation) ?
                    investigatedPatient.subOccupationBySubOccupation.city : '',
                institutionName: investigatedPatient.subOccupation !== null ? investigatedPatient.subOccupation : '',
                otherOccupationExtraInfo: investigatedPatient.otherOccupationExtraInfo !== null ? investigatedPatient.otherOccupationExtraInfo : '',
                contactInfo: investigatedPatient.patientContactInfo,
                role: investigatedPatient.role,
                educationGrade: investigatedPatient.educationGrade,
                educationClassNumber: investigatedPatient.educationClassNumber,
            }
            setIsLoading(false);
            return personalInfo;
        } else {
            personalDetailsLogger.error(`got errors in server result: ${JSON.stringify(res)}`, Severity.HIGH);
            setIsLoading(false);
        }
    } catch (err) {
        setIsLoading(false);
        if (epidemiologyNumber !== -1) {
            personalDetailsLogger.error(`got errors in server request ${err}`, Severity.HIGH);
            throwError('הייתה שגיאה בטעינת הפרטים האישיים');
        }
    }
}