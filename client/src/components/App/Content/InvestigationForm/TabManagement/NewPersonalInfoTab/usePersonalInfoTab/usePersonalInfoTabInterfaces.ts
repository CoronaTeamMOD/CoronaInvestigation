import { UseFormMethods } from 'react-hook-form';

import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import investigatedPatientRole from 'models/investigatedPatientRole';

import { PersonalInfoTabState } from '../PersonalInfoTabInterfaces';

export interface usePersonalInfoTabIncome {

}

export interface usePersonalInfoTabOutcome {
    subOccupations: SubOccupationAndStreet[];
    getEducationSubOccupations: (city: string) => void;
    investigatedPatientRoles: investigatedPatientRole[];
    getSubOccupations: (parrentOccupation :string) => void; 
    fetchPersonalInfo: (reset: UseFormMethods<PersonalInfoTabState>['reset'], trigger: UseFormMethods<PersonalInfoTabState>['trigger']) => void;
    insuranceCompanies: string[];
    clearSubOccupations: () => void;
}