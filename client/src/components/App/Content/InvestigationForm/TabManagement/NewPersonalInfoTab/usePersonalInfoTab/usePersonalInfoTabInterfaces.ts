import SubOccupationAndStreet from 'models/SubOccupationAndStreet';

export interface usePersonalInfoTabIncome {

}

export interface usePersonalInfoTabOutcome {
    subOccupations: SubOccupationAndStreet[];
    getSubOccupations: (parrentOccupation :string) => void; 
    getEducationSubOccupations: (city: string) => void;
}