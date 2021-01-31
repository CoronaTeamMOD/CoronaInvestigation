import { UseFormMethods } from 'react-hook-form';

import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import investigatedPatientRole from 'models/investigatedPatientRole';
import { PersonalInfoDbData } from 'models/Contexts/PersonalInfoContextData';

import { PersonalInfoTabState } from '../PersonalInfoTabInterfaces';

export interface usePersonalInfoTabOutcome {
    subOccupations: SubOccupationAndStreet[];
    getEducationSubOccupations: (city: string) => void;
    investigatedPatientRoles: investigatedPatientRole[];
    getSubOccupations: (parrentOccupation :string) => void; 
    fetchPersonalInfo: (reset: UseFormMethods<PersonalInfoTabState>['reset'], trigger: UseFormMethods<PersonalInfoTabState>['trigger']) => void;
    insuranceCompanies: string[];
    clearSubOccupations: () => void;
    savePersonalData: (personalInfoData: PersonalInfoDbData, data: { [x: string]: any }, id: number) => void;
}