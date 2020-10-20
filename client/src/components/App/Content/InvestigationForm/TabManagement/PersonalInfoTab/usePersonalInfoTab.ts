import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { initDBAddress } from 'models/DBAddress';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import Occupations from 'models/enums/Occupations';
import { setInvestigatedPatientId } from 'redux/Investigation/investigationActionCreators';

import useStyles from './PersonalInfoTabStyles';
import { usePersoanlInfoTabParameters, usePersonalInfoTabOutcome } from './PersonalInfoTabInterfaces'; 

const usePersonalInfoTab = (parameters: usePersoanlInfoTabParameters): usePersonalInfoTabOutcome => {

    const classes = useStyles({});

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const { setInsuranceCompanies, setPersonalInfoData, setSubOccupations, setSubOccupationName, setInvestigatedPatientRoles,
            setCityName, setStreetName, setStreets, occupationsStateContext, setInsuranceCompany,
    } = parameters;

    const fetchPersonalInfo = (reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
                               trigger: (payload?: string | string[]) => Promise<boolean>
                              ) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Occupations',
            step: 'launching occupations request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/personalDetails/occupations').then((res: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Fetching Occupations',
                step: 'got results back from the server',
                user: userId,
                investigation: epidemiologyNumber
            });
            occupationsStateContext.occupations = res?.data?.data?.allOccupations?.nodes?.map((node: any) => node.displayName);
        });
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching HMOs',
            step: 'launching HMOs request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/personalDetails/hmos').then((res: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Fetching HMOs',
                step: 'got results back from the server',
                user: userId,
                investigation: epidemiologyNumber
            });
            res && res.data && res.data.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName));
        });
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching investigated patient roles',
            step: 'launching HMOs request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/personalDetails/investigatedPatientRoles').then((res: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Fetching investigated patient roles',
                step: 'got results back from the server',
                user: userId,
                investigation: epidemiologyNumber
            });
            res && res.data && res.data.data && setInvestigatedPatientRoles(res.data.data.allInvestigatedPatientRoles.nodes);
        });
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Personal Details',
            step: 'launching personal data request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/personalDetails/investigatedPatientPersonalInfoFields?epidemioligyNumber=' + epidemiologyNumber).then((res: any) => {
            if (res && res.data && res.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Personal Details',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
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
                    educationOccupationCity: investigatedPatient.occupation === Occupations.EDUCATION_SYSTEM && investigatedPatient.subOccupationBySubOccupation ?
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
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Personal Details',
                    step: `got errors in server result: ${JSON.stringify(res)}`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
            }
        }).catch((error) => {
            if (epidemiologyNumber !== -1) {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Personal Details',
                    step: `got errors in server request ${error}`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
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
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Sub Occupation by Parent Occupation',
            step: `launching sub occupations request with parameter: ${parentOccupation}`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/personalDetails/subOccupations?parentOccupation=' + parentOccupation).then((res: any) => {
            if (res && res.data && res.data.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Sub Occupation by Parent Occupation',
                    step: 'got result from the DB',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setSubOccupations(res.data.data.allSubOccupations.nodes.map((node: any) => {
                    return {
                        id: node.id,
                        subOccupation: node.displayName
                    }
                }));
            } else {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Sub Occupation by Parent Occupation',
                    step: `got error in query result ${JSON.stringify(res)}`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
            }
        });
    }

    const getEducationSubOccupations = (city: string) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Education Sub Occupation by City',
            step: `launching education sub occupations request with parameter: ${city}`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/personalDetails/educationSubOccupations?city=' + city).then((res: any) => {
            if (res && res.data && res.data.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Education Sub Occupation by City',
                    step: `got results from the server`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setSubOccupations(res.data.data.allSubOccupations.nodes.map((node: any) => {
                    return {
                        id: node.id,
                        subOccupation: node.displayName,
                        street: node.street
                    }
                }));
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Education Sub Occupation by City',
                    step: 'got status 200 but got invalid outcome'
                })
            }
        });
    }

    const getStreetsByCity = (cityId: string) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting streets of city',
            step: `launching request to server with parameter ${cityId}`,
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/addressDetails/city/' + cityId + '/streets').then((res: any) => {
            if (res && res.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting streets of city',
                    step: 'got data from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                })
                setStreets(res.data.map((node: any) => (
                    {
                        displayName: node.displayName,
                        id: node.id
                    }
                )));
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Getting streets of city',
                    step: 'got status 200 but wrong data'
                });
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
