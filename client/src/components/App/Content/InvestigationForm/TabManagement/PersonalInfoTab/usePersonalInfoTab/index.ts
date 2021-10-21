import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UseFormMethods } from 'react-hook-form';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import { initDBAddress } from 'models/DBAddress';
import StoreStateType from 'redux/storeStateType';
import Occupations from 'models/enums/Occupations';
import { setFormState } from 'redux/Form/formActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { InvestigationStatus } from 'models/InvestigationStatus';
import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import investigatedPatientRole from 'models/investigatedPatientRole';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { PersonalInfoDbData } from 'models/Contexts/PersonalInfoContextData';
import { setOccupations } from 'redux/Occupations/occupationsActionCreators';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import useComplexitySwal from 'commons/InvestigationComplexity/ComplexityUtils/ComplexitySwal';
import {checkUpdateInvestigationPersonalReasonId} from 'Utils/ComplexityReasons/ComplexityReasonsFunctions';

import { PersonalInfoTabState } from '../PersonalInfoTabInterfaces';
import { usePersonalInfoTabOutcome } from './usePersonalInfoTabInterfaces';
import personalInfoTabValidationSchema from '../PersonalInfoTabValidationSchema';
import { getPersonalInfo } from 'redux/PersonalInfo/personalInfoActionCreators';

const usePersonalInfoTab = (): usePersonalInfoTabOutcome => {
    
    const [insuranceCompanies, setInsuranceCompanies] = useState<string[]>([]);
    const [subOccupations, setSubOccupations] = useState<SubOccupationAndStreet[]>([]);
    const [investigatedPatientRoles, setInvestigatedPatientRoles] = useState<investigatedPatientRole[]>([]);

    const { alertError } = useCustomSwal();
    const { complexityErrorAlert } = useComplexitySwal();
    const dispatch = useDispatch();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>((state) => state.investigation.investigationStatus);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);
    const complexityReasonsId = useSelector<StoreStateType,(number|null)[]>((state) => state.investigation.complexReasonsId);

    const getSubOccupations = (parentOccupation: string) => {
        const subOccupationsLogger = logger.setup('Fetching Sub Occupation by Parent Occupation');
        subOccupationsLogger.info(`launching sub occupations request with parameter: ${parentOccupation}`, Severity.LOW);
        axios.get('/personalDetails/subOccupations?parentOccupation=' + parentOccupation).then((res: any) => {
            if (res?.data?.subOccupations) {
                subOccupationsLogger.info('got result from the DB', Severity.LOW);
                setSubOccupations(res.data.subOccupations.map((node: any) => {
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
        const educationSubOccupationsLogger = logger.setup('Fetching Education Sub Occupation by City');
        educationSubOccupationsLogger.info(`launching education sub occupations request with parameter: ${city}`, Severity.LOW);
        axios.get('/personalDetails/educationSubOccupations?city=' + city).then((res: any) => {
            if (res?.data?.data) {
                educationSubOccupationsLogger.info('got results from the server', Severity.LOW);
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

    const fetchPersonalInfo = (reset: UseFormMethods<PersonalInfoTabState>['reset'], trigger: UseFormMethods<PersonalInfoTabState>['trigger']) => {
        const occupationsLogger = logger.setup('Fetching Occupations');
        occupationsLogger.info('launching occupations request', Severity.LOW);
        axios.get('/personalDetails/occupations').then((res: any) => {
            occupationsLogger.info('got results back from the server', Severity.LOW);
            setOccupations(res?.data?.data?.allOccupations?.nodes?.map((node: any) => node.displayName));
        });
        const hmosLogger = logger.setup('Fetching HMOs');
        hmosLogger.info('launching HMOs request', Severity.LOW);
        axios.get('/personalDetails/hmos').then((res: any) => {
            hmosLogger.info('got results back from the server', Severity.LOW);
            res?.data?.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName));
        });

        const investigatedPatientRolesLogger = logger.setup('Fetching investigated patient roles');
        investigatedPatientRolesLogger.info('launching investigated patient roles request', Severity.LOW);
        axios.get('/personalDetails/investigatedPatientRoles').then((res: any) => {
            investigatedPatientRolesLogger.info('got results back from the server', Severity.LOW);
            setInvestigatedPatientRoles(res?.data);
        });

        const personalDetailsLogger = logger.setup('Fetching Personal Details');
        personalDetailsLogger.info('launching personal data request', Severity.LOW);
        setIsLoading(true);
        
        dispatch(getPersonalInfo(epidemiologyNumber,reset,trigger));

        // axios.get('/personalDetails/investigatedPatientPersonalInfoFields?epidemioligyNumber=' + epidemiologyNumber).then((res: any) => {
        //     if (res?.data) {
        //         personalDetailsLogger.info('got results back from the server', Severity.LOW);
        //         const investigatedPatient = res.data;
        //         const patientAddress = investigatedPatient.addressByAddress;
        //         let convertedPatientAddress = null;
        //         if (patientAddress) {
        //             let city = null;
        //             let street = null;
        //             if (patientAddress.cityByCity !== null) {
        //                 city = patientAddress.cityByCity.id;
        //             }
        //             if (patientAddress.streetByStreet !== null) {
        //                 street = patientAddress.streetByStreet.id;
        //             }
        //             convertedPatientAddress = {
        //                 city,
        //                 street,
        //                 apartment: patientAddress.apartment,
        //                 houseNum: patientAddress.houseNum,
        //             }
        //         } else {
        //             convertedPatientAddress = initDBAddress;
        //         }
        //         const personalInfo: PersonalInfoTabState = {
        //             phoneNumber: investigatedPatient.primaryPhone,
        //             additionalPhoneNumber: investigatedPatient.additionalPhoneNumber,
        //             contactPhoneNumber: investigatedPatient.patientContactPhoneNumber,
        //             insuranceCompany: investigatedPatient.hmo,
        //             address: convertedPatientAddress,
        //             relevantOccupation: investigatedPatient.occupation,
        //             educationOccupationCity: (investigatedPatient.occupation === Occupations.EDUCATION_SYSTEM && investigatedPatient.subOccupationBySubOccupation) ?
        //                 investigatedPatient.subOccupationBySubOccupation.city : '',
        //             institutionName: investigatedPatient.subOccupation !== null ? investigatedPatient.subOccupation : '',
        //             otherOccupationExtraInfo: investigatedPatient.otherOccupationExtraInfo !== null ? investigatedPatient.otherOccupationExtraInfo : '',
        //             contactInfo: investigatedPatient.patientContactInfo,
        //             role: investigatedPatient.role,
        //             educationGrade: investigatedPatient.educationGrade,
        //             educationClassNumber: investigatedPatient.educationClassNumber,
        //         }
        //         reset(personalInfo);
        //         trigger();
        //         setIsLoading(false);
        //     } else {
        //         personalDetailsLogger.error(`got errors in server result: ${JSON.stringify(res)}`, Severity.HIGH);
        //         setIsLoading(false);
        //     }
        // }).catch((error) => {
        //     setIsLoading(false);

        //     if (epidemiologyNumber !== -1) {
        //         personalDetailsLogger.error(`got errors in server request ${error}`, Severity.HIGH);
        //         alertError('הייתה שגיאה בטעינת הפרטים האישיים');
        //     }
        // })
    }

    const clearSubOccupations = () => setSubOccupations([]);

    const savePersonalData = (personalInfoData: PersonalInfoDbData, data: { [x: string]: any }, id: number) => {
        const savePersonalDataLogger = logger.setup('Saving personal details tab');
        savePersonalDataLogger.info('launching the server request', Severity.LOW);
        setIsLoading(true);
        axios.post('/personalDetails/updatePersonalDetails', {
            id: investigatedPatientId,
            personalInfoData,
        }).then(() => {
            const isInvestigationNew = investigationStatus.mainStatus === InvestigationMainStatusCodes.NEW;
            savePersonalDataLogger.info(
                `saved personal details successfully${isInvestigationNew ? ' and updating status to "in progress"' : ''}`,
                Severity.LOW
            );
        }).catch((error) => {
            savePersonalDataLogger.error(`got error from server: ${error}`, Severity.HIGH);
            complexityErrorAlert(error);
        }).finally(() => {
            setIsLoading(false);
            personalInfoTabValidationSchema.isValid(data).then(valid => {
                setFormState(epidemiologyNumber, id, valid);
            })
            checkUpdateInvestigationPersonalReasonId(personalInfoData, epidemiologyNumber, complexityReasonsId)
        })
    }

    return {
        subOccupations, 
        getSubOccupations,
        getEducationSubOccupations,
        investigatedPatientRoles,
        fetchPersonalInfo,
        insuranceCompanies,
        clearSubOccupations,
        savePersonalData
    };
}

export default usePersonalInfoTab;