import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import investigatedPatientRole from 'models/investigatedPatientRole';

export interface usePersonalInfoTabIncome {

}

export interface usePersonalInfoTabOutcome {
    subOccupations: SubOccupationAndStreet[];
    getEducationSubOccupations: (city: string) => void;
    investigatedPatientRoles: investigatedPatientRole[];
    getSubOccupations: (parrentOccupation :string) => void; 
}