import Street from 'models/Street';
import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import { OccupationsContext } from 'commons/Contexts/OccupationsContext';
import { PersonalInfoFormData } from 'models/Contexts/PersonalInfoContextData';

export interface usePersoanlInfoTabParameters {
    occupationsStateContext: OccupationsContext;
    setInsuranceCompanies: React.Dispatch<React.SetStateAction<string[]>>;
    setPersonalInfoData: React.Dispatch<React.SetStateAction<PersonalInfoFormData>>;
    setSubOccupations: React.Dispatch<React.SetStateAction<SubOccupationAndStreet[]>>;
    setSubOccupationName: React.Dispatch<React.SetStateAction<string>>;
    setCityName: React.Dispatch<React.SetStateAction<string>>;
    setStreetName: React.Dispatch<React.SetStateAction<string>>;
    setStreets: React.Dispatch<React.SetStateAction<Street[]>>;
    setInsuranceCompany: React.Dispatch<React.SetStateAction<string>>;
}

export interface usePersonalInfoTabOutcome {
    fetchPersonalInfo: (reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
                        trigger: (payload?: string | string[]) => Promise<boolean>
                        ) => void;
    getSubOccupations: (parentOccupation: string) => void;
    getEducationSubOccupations: (city: string) => void;
    getStreetsByCity: (cityId: string) => void;
}
