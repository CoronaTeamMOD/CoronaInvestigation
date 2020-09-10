import { Street } from 'models/Street';
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
    subOccupationName: string;
    setSubOccupationName: React.Dispatch<React.SetStateAction<string>>;
    cityName: string;
    setCityName: React.Dispatch<React.SetStateAction<string>>;
    streetName: string;
    setStreetName: React.Dispatch<React.SetStateAction<string>>;
    setStreets: React.Dispatch<React.SetStateAction<Street[]>>
}

export interface usePersonalInfoTabOutcome {
    fetchPersonalInfo: () => void;
    getSubOccupations: (parentOccupation: string) => void;
    getEducationSubOccupations: (city: string) => void;
    getStreetsByCity: (cityId: string) => void;
}

