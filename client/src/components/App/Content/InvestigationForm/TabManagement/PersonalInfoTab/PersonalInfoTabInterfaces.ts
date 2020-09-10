import { SubOccupationAndStreet } from 'models/SubOccupationAndStreet';
import { PersonalInfoDataAndSet } from "commons/Contexts/PersonalInfoStateContext";

export interface usePersoanlInfoTabParameters {
    occupations: string[];
    setOccupations: React.Dispatch<React.SetStateAction<string[]>>;
    insuranceCompanies: string[];
    setInsuranceCompanies: React.Dispatch<React.SetStateAction<string[]>>;
    personalInfoStateContext: PersonalInfoDataAndSet;
    subOccupations: SubOccupationAndStreet[];
    setSubOccupations: React.Dispatch<React.SetStateAction<SubOccupationAndStreet[]>>;
}

export interface usePersonalInfoTabOutcome {
    fetchPersonalInfo: () => void;
    getSubOccupations: (parentOccupation: string) => void;
    getEducationSubOccupations: (city: string) => void;
}

