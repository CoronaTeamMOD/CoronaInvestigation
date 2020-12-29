import City from 'models/City';
import Country from 'models/Country';
import DBAddress from 'models/DBAddress';
import ContactType from 'models/ContactType';
import InvestigationRedux from 'models/InvestigationRedux';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

import { UserState } from './User/userReducer';
import EducationGrade from 'models/EducationGrade';

export default interface StoreStateType {
    user: UserState;
    isLoading: boolean;
    isInInvestigation: boolean;
    investigation: InvestigationRedux;
    gender: string;
    cities: Map<string, City>;
    countries: Map<string, Country>;
    contactTypes: Map<number, ContactType>;
    occupations: string[];
    subStatuses: string[];
    statuses: InvestigationMainStatus[];
    formsValidations: { [key: number]: (boolean | null)[] };
    address: DBAddress;
    educationGrades: EducationGrade[];
};
