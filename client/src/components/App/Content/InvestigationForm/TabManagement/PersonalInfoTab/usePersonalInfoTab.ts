import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { initDBAddress } from 'models/DBAddress';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import Occupations from 'models/enums/Occupations';
import { setInvestigatedPatientId } from 'redux/Investigation/investigationActionCreators';

import useStyles from './PersonalInfoTabStyles';
import { usePersonalInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 

const usePersonalInfoTab = (parameters: usePersonalInfoTabParameters): usePersonalInfoTabOutcome => {

    const classes = useStyles({});

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const { setInsuranceCompanies, setPersonalInfoData, setSubOccupations, setSubOccupationName, setInvestigatedPatientRoles,
            setCityName, setStreetName, setStreets, occupationsStateContext, setInsuranceCompany,
    } = parameters;

    const fetchPersonalInfo = (reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
                               trigger: (payload?: string | string[]) => Promise<boolean>
                              ) => {
        const occupationsLogger = logger.setup({
            workflow: 'Fetching Occupations',
            user: userId,
            investigation: epidemiologyNumber
        });
        occupationsLogger.info('launching occupations request', Severity.LOW);
        axios.get('/personalDetails/occupations').then((res: any) => {
            occupationsLogger.info('got results back from the server', Severity.LOW);
            occupationsStateContext.occupations = res?.data?.data?.allOccupations?.nodes?.map((node: any) => node.displayName);
        });
        const hmosLogger = logger.setup({
            workflow: 'Fetching HMOs',
            user: userId,
            investigation: epidemiologyNumber
        });
        hmosLogger.info('launching HMOs request', Severity.LOW);
        axios.get('/personalDetails/hmos').then((res: any) => {
            hmosLogger.info('got results back from the server', Severity.LOW);
            res && res.data && res.data.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName));
        });

        const investigatedPatientRolesLogger = logger.setup({
            workflow: 'Fetching investigated patient roles',
            user: userId,
            investigation: epidemiologyNumber
        });
        investigatedPatientRolesLogger.info('launching investigated patient roles request', Severity.LOW);
        axios.get('/personalDetails/investigatedPatientRoles').then((res: any) => {
            investigatedPatientRolesLogger.info('got results back from the server', Severity.LOW);
            setInvestigatedPatientRoles(res?.data);
        });

        const personalDetailsLogger = logger.setup({
            workflow: 'Fetching Personal Details',
            user: userId,
            investigation: epidemiologyNumber
        });
        personalDetailsLogger.info('launching personal data request', Severity.LOW);
        axios.get('/personalDetails/investigatedPatientPersonalInfoFields?epidemioligyNumber=' + epidemiologyNumber).then((res: any) => {
            if (res && res.data && res.data) {
                personalDetailsLogger.info('got results back from the server', Severity.LOW);
                const investigatedPatient = res.data;
                setInvestigatedPatientId(investigatedPatient.id);
                const patientAddress = investigatedPatient.addressByAddress;
                let convertedPatientAddress = null;
                if (patientAddress) {
                    let city = null;
                    let street = null;
                    if (patientAddress.cityByCity !== null) {
                        city = patientAddress.cityByCity.id;
                        setCityName(patientAddress.cityByCity.displayName);
                    }
                    if (patientAddress.streetByStreet !== null) {
                        street = patientAddress.streetByStreet.id;
                        setStreetName(patientAddress.streetByStreet.displayName);
                    }
                    convertedPatientAddress = {
                        city,
                        street,
                        floor: patientAddress.floor,
                        houseNum: patientAddress.houseNum,
                    }
                } else {
                    convertedPatientAddress = initDBAddress;
                }
                const PersonalInfoData = {
                    phoneNumber: investigatedPatient.primaryPhone,
                    additionalPhoneNumber:  investigatedPatient.additionalPhoneNumber,
                    contactPhoneNumber: investigatedPatient.patientContactPhoneNumber,
                    insuranceCompany: investigatedPatient.hmo,
                    ...convertedPatientAddress,
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
                setPersonalInfoData(PersonalInfoData);
                reset(PersonalInfoData);
                trigger();
                investigatedPatient.subOccupationBySubOccupation && setSubOccupationName(investigatedPatient.subOccupationBySubOccupation.displayName);
                if (investigatedPatient.hmo !== null) {
                    setInsuranceCompany(investigatedPatient.hmo);
                }
            } else {
                personalDetailsLogger.error(`got errors in server result: ${JSON.stringify(res)}`, Severity.HIGH);
            }
        }).catch((error) => {
            if (epidemiologyNumber !== -1) {
                personalDetailsLogger.error(`got errors in server request ${error}`, Severity.HIGH);
                Swal.fire({
                    title: 'הייתה שגיאה בטעינת הפרטים האישיים',
                    icon: 'error',
                    customClass: {
                        title: classes.swalTitle
                    },
                });
            } 
        })
    }

    const getSubOccupations = (parentOccupation: string) => {
        const subOccupationsLogger = logger.setup({
            workflow: 'Fetching Sub Occupation by Parent Occupation',
            user: userId,
            investigation: epidemiologyNumber
        });
        subOccupationsLogger.info(`launching sub occupations request with parameter: ${parentOccupation}`, Severity.LOW);
        axios.get('/personalDetails/subOccupations?parentOccupation=' + parentOccupation).then((res: any) => {
            if (res && res.data && res.data.data) {
                subOccupationsLogger.info('got result from the DB', Severity.LOW);
                setSubOccupations(res.data.data.allSubOccupations.nodes.map((node: any) => {
                    return {
                        id: node.id,
                        subOccupation: node.displayName
                    }
                }));
            } else {
                subOccupationsLogger.error(`got error in query result ${JSON.stringify(res)}`, Severity.HIGH);
            }
        });
    }

    const getEducationSubOccupations = (city: string) => {
        const educationSubOccupationsLogger = logger.setup({
            workflow: 'Fetching Education Sub Occupation by City',
            user: userId,
            investigation: epidemiologyNumber
        });
        educationSubOccupationsLogger.info(`launching education sub occupations request with parameter: ${city}`, Severity.LOW);
        axios.get('/personalDetails/educationSubOccupations?city=' + city).then((res: any) => {
            if (res && res.data && res.data.data) {
                educationSubOccupationsLogger.info(`got results from the server`, Severity.LOW);
                setSubOccupations(res.data.data.allSubOccupations.nodes.map((node: any) => {
                    return {
                        id: node.id,
                        subOccupation: node.displayName,
                        street: node.street
                    }
                }));
            } else {
                educationSubOccupationsLogger.warn('got status 200 but got invalid outcome', Severity.HIGH);
            }
        });
    }

    const getStreetsByCity = (cityId: string) => {
        const streetsByCityLogger = logger.setup({
            workflow: 'Getting streets of city',
            user: userId,
            investigation: epidemiologyNumber
        });
        streetsByCityLogger.info(`launching request to server with parameter ${cityId}`, Severity.LOW);
        axios.get('/addressDetails/city/' + cityId + '/streets').then((res: any) => {
            if (res && res.data) {
                streetsByCityLogger.info('got data from the server', Severity.LOW);
                setStreets(res.data.map((node: any) => (
                    {
                        displayName: node.displayName,
                        id: node.id
                    }
                )));
            } else {
                streetsByCityLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        });
    }

    return {
        fetchPersonalInfo,
        getSubOccupations,
        getEducationSubOccupations,
        getStreetsByCity
    }
}

export default usePersonalInfoTab;
