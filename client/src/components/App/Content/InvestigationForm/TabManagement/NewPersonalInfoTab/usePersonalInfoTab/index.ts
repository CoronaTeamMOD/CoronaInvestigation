import axios from 'axios';
import { useState } from 'react';
import { UseFormMethods } from 'react-hook-form';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import investigatedPatientRole from 'models/investigatedPatientRole';
import { setOccupations } from 'redux/Occupations/occupationsActionCreators';

import { PersonalInfoTabState } from '../PersonalInfoTabInterfaces';
import { usePersonalInfoTabIncome, usePersonalInfoTabOutcome } from './usePersonalInfoTabInterfaces';

// TODO: remove stubs
const rolesStub: investigatedPatientRole[] = [
    {
      "id": 2,
      "displayName": "צוות אדמיניסטרטיבי"
    },
    {
      "id": 3,
      "displayName": "צוות חינוכי"
    },
    {
      "id": 5,
      "displayName": "צוות מטפל"
    },
    {
      "id": 4,
      "displayName": "שוהה במוסד"
    },
    {
      "id": 1,
      "displayName": "תלמיד/ה"
    }
  ]

const usePersonalInfoTab = (parameters: usePersonalInfoTabIncome): usePersonalInfoTabOutcome => {
    const [subOccupations, setSubOccupations] = useState<SubOccupationAndStreet[]>([]);
    const [investigatedPatientRoles, setInvestigatedPatientRoles] = useState<investigatedPatientRole[]>([]);
    const [insuranceCompanies, setInsuranceCompanies] = useState<string[]>([]);

    const getSubOccupations = (parentOccupation: string) => {
        const subOccupationsLogger = logger.setup('Fetching Sub Occupation by Parent Occupation');
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
        const educationSubOccupationsLogger = logger.setup('Fetching Education Sub Occupation by City');
        educationSubOccupationsLogger.info(`launching education sub occupations request with parameter: ${city}`, Severity.LOW);
        axios.get('/personalDetails/educationSubOccupations?city=' + city).then((res: any) => {
            if (res && res.data && res.data.data) {
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
            res && res.data && res.data.data && setInsuranceCompanies(res.data.data.allHmos.nodes.map((node: any) => node.displayName));
        });

        const investigatedPatientRolesLogger = logger.setup('Fetching investigated patient roles');
        investigatedPatientRolesLogger.info('launching investigated patient roles request', Severity.LOW);
        axios.get('/personalDetails/investigatedPatientRoles').then((res: any) => {
            investigatedPatientRolesLogger.info('got results back from the server', Severity.LOW);
            setInvestigatedPatientRoles(res?.data);
        });
    }

    const clearSubOccupations = () => setSubOccupations([]);

    return {
        subOccupations, 
        getSubOccupations,
        getEducationSubOccupations,
        investigatedPatientRoles,
        fetchPersonalInfo,
        insuranceCompanies,
        clearSubOccupations
    };
}

export default usePersonalInfoTab;