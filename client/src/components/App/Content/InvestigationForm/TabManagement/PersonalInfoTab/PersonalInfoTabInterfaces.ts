import { Street } from 'models/Street';
import { SubOccupationAndStreet } from 'models/SubOccupationAndStreet';
import { OccupationsContext } from 'commons/Contexts/OccupationsContext';
import { PersonalInfoDataAndSet } from 'commons/Contexts/PersonalInfoStateContext';

export interface usePersoanlInfoTabParameters {
    occupationsStateContext: OccupationsContext;
    setInsuranceCompanies: React.Dispatch<React.SetStateAction<string[]>>;
    personalInfoStateContext: PersonalInfoDataAndSet;
    setSubOccupations: React.Dispatch<React.SetStateAction<SubOccupationAndStreet[]>>;
    setSubOccupationName: React.Dispatch<React.SetStateAction<string>>;
    setCityName: React.Dispatch<React.SetStateAction<string>>;
    setStreetName: React.Dispatch<React.SetStateAction<string>>;
    setStreets: React.Dispatch<React.SetStateAction<Street[]>>
}

export interface usePersonalInfoTabOutcome {
    fetchPersonalInfo: () => void;
    getSubOccupations: (parentOccupation: string) => void;
    getEducationSubOccupations: (city: string) => void;
    getStreetsByCity: (cityId: string) => void;
}

