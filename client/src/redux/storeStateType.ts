import Desk from 'models/Desk';
import City from 'models/City';
import Country from 'models/Country';
import District from 'models/District';
import Authority from 'models/Authority';
import ContactType from 'models/ContactType';
import CountyReducer from 'models/CountyReducer';
import FlattenedDBAddress from 'models/DBAddress';
import EducationGrade from 'models/EducationGrade';
import InvestigationRedux from 'models/InvestigationRedux';
import IdentificationType from 'models/IdentificationType';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';
import InvestigationMainStatus from 'models/InvestigationMainStatus';

import { UserState } from './User/userReducer';
import { GreenPassReducerType } from './GreenPass/greenPassReducer';
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
    district: District[];
    county: CountyReducer;
    desk: Desk[];
    groupedInvestigations: GroupedInvestigationReducerType;
    authorities: Map<string, Authority>;
    complexReasons: (number|null)[];
    greenPass: GreenPassReducerType;
    identificationTypes: IdentificationType[];
    airlines: Map<number, string>
};