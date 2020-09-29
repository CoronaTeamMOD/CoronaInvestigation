import { Street } from 'models/Street';
import { SubOccupationAndStreet } from 'models/SubOccupationAndStreet';
import { PersonalInfoDataAndSet } from "commons/Contexts/PersonalInfoStateContext";

export interface usePersoanlInfoTabParameters {
    setOccupations: React.Dispatch<React.SetStateAction<string[]>>;
    setInsuranceCompanies: React.Dispatch<React.SetStateAction<string[]>>;
    personalInfoStateContext: PersonalInfoDataAndSet;
    setSubOccupations: React.Dispatch<React.SetStateAction<SubOccupationAndStreet[]>>;
    setSubOccupationName: React.Dispatch<React.SetStateAction<string>>;
    setCityName: React.Dispatch<React.SetStateAction<string>>;
    setStreetName: React.Dispatch<React.SetStateAction<string>>;
    setStreets: React.Dispatch<React.SetStateAction<Street[]>>
}

export interface usePersonalInfoTabOutcome {
    fetchPersonalInfo: (epidemiologyNumber: number) => void;
    getSubOccupations: (parentOccupation: string) => void;
    getEducationSubOccupations: (city: string) => void;
    getStreetsByCity: (cityId: string) => void;
}

