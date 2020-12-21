import Street from 'models/Street';
import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import investigatedPatientRole from 'models/investigatedPatientRole';
import { PersonalInfoDbData, PersonalInfoFormData } from 'models/Contexts/PersonalInfoContextData';

export interface usePersonalInfoTabParameters {
    setInsuranceCompanies: React.Dispatch<React.SetStateAction<string[]>>;
    setPersonalInfoData: React.Dispatch<React.SetStateAction<PersonalInfoFormData>>;
    setSubOccupations: React.Dispatch<React.SetStateAction<SubOccupationAndStreet[]>>;
    setSubOccupationName: React.Dispatch<React.SetStateAction<string>>;
    setCityName: React.Dispatch<React.SetStateAction<string>>;
    setStreetName: React.Dispatch<React.SetStateAction<string>>;
    setStreets: React.Dispatch<React.SetStateAction<Street[]>>;
    setInsuranceCompany: React.Dispatch<React.SetStateAction<string>>;
    setInvestigatedPatientRoles: React.Dispatch<React.SetStateAction<investigatedPatientRole[]>>;
}

export interface usePersonalInfoTabOutcome {
    fetchPersonalInfo: (reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
                        trigger: (payload?: string | string[]) => Promise<boolean>
                        ) => void;
    getSubOccupations: (parentOccupation: string) => void;
    getEducationSubOccupations: (city: string) => void;
    getStreetsByCity: (cityId: string) => void;
    savePersonalData: (personalInfoData: PersonalInfoDbData, data: { [x: string]: any }, id: number) => void;
};
