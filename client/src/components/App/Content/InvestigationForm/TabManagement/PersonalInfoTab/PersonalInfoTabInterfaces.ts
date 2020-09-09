import { PersonalInfoDataAndSet } from "commons/Contexts/PersonalInfoStateContext";

export interface usePersoanlInfoTabParameters {
    occupations: string[];
    setOccupations: React.Dispatch<React.SetStateAction<string[]>>;
    insuranceCompanies: string[];
    setInsuranceCompanies: React.Dispatch<React.SetStateAction<string[]>>;
    personalInfoStateContext: PersonalInfoDataAndSet;
}

export interface usePersonalInfoTabOutcome {
    fetchPersonalInfo: () => void;
}

