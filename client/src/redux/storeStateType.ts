import Desk from 'models/Desk';
import City from 'models/City';
import Country from 'models/Country';
import Authority from 'models/Authority';
import ContactType from 'models/ContactType';
import CountyReducer from 'models/CountyReducer';
import FlattenedDBAddress from 'models/DBAddress';
import EducationGrade from 'models/EducationGrade';
import InvestigationRedux from 'models/InvestigationRedux';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

import { UserState } from './User/userReducer';
import GroupedInvestigationReducerType from './GroupedInvestigations/GroupedInvestigationsType';

export default interface StoreStateType {
    user: UserState;
    isLoading: boolean;
    isInInvestigation: boolean;
    investigation: InvestigationRedux;
    gender: string;
    placeSubTypesByTypes: PlacesSubTypesByTypes ;
    cities: Map<string, City>;
    countries: Map<string, Country>;
    contactTypes: Map<number, ContactType>;
    occupations: string[];
    subStatuses: string[];
    statuses: InvestigationMainStatus[];
    formsValidations: { [key: number]: (boolean | null)[] };
    address: FlattenedDBAddress;
    educationGrades: EducationGrade[];
    county: CountyReducer;
    desk: Desk[];
    groupedInvestigations: GroupedInvestigationReducerType;
    authorities: Map<string, Authority>;
    complexReasons: (number|null)[];
};
