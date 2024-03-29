import Desk from 'models/Desk';
import City from 'models/City';
import Country from 'models/Country';
import District from 'models/District';
import SubStatus from 'models/SubStatus';
import Authority from 'models/Authority';
import ContactType from 'models/ContactType';
import CountyReducer from 'models/CountyReducer';
import FlattenedDBAddress from 'models/DBAddress';
import EducationGrade from 'models/EducationGrade';
import InvestigationRedux from 'models/InvestigationRedux';
import IdentificationType from 'models/IdentificationType';
import PlacesSubTypesByTypes from 'models/PlacesSubTypesByTypes';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import ComplexityReason from 'models/ComplexityReason'

import { UserState } from './User/userReducer';
import { GreenPassReducerType } from './GreenPass/greenPassReducer';
import GroupedInvestigationReducerType from './GroupedInvestigations/GroupedInvestigationsType';
import { InteractedContactsState } from './InteractedContacts/interactedContactsReducer';
import { ClinicalDetailsState } from './ClinicalDetails/ClinicalDetailsReducer';
import { PersonalInfoTabState } from 'components/App/Content/InvestigationForm/TabManagement/PersonalInfoTab/PersonalInfoTabInterfaces';
import KeyValuePair from 'models/KeyValuePair';
import { BotInvestigationInfoState } from './BotInvestigationInfo/botInvestigationInfoReducer';
import { MutationInfoState } from './MutationInfo/mutationInfoReducer';
import BorderCheckpoint from 'models/BorderCheckpoint';
import ExposureAndFlightData from 'models/ExposureAndFlightData';
import { RuleConfigRedux } from 'models/RulesConfig';

export default interface StoreStateType {
    user: UserState;
    isLoading: boolean;
    isInInvestigation: boolean;
    investigation: InvestigationRedux;
    gender: string;
    placeSubTypesByTypes: PlacesSubTypesByTypes;
    cities: Map<string, City>;
    countries: Map<string, Country>;
    contactTypes: Map<number, ContactType>;
    occupations: string[];
    subStatuses: SubStatus[];
    statuses: InvestigationMainStatus[];
    formsValidations: { [key: number]: (boolean | null)[] };
    address: FlattenedDBAddress;
    educationGrades: EducationGrade[];
    district: District[];
    county: CountyReducer;
    desk: Desk[];
    groupedInvestigations: GroupedInvestigationReducerType;
    authorities: Map<string, Authority>;
    complexReasons: (number | null)[];
    greenPass: GreenPassReducerType;
    identificationTypes: IdentificationType[];
    airlines: Map<string, string>;
    interactedContacts: InteractedContactsState;
    clinicalDetails: ClinicalDetailsState;
    personalInfo: PersonalInfoTabState;
    investigatorReferenceStatuses: KeyValuePair[];
    botInvestigationInfo: BotInvestigationInfoState;
    chatStatuses: KeyValuePair[];
    mutationInfo: MutationInfoState;
    complexityReasons: ComplexityReason[];
    borderCheckpointTypes: KeyValuePair[];
    borderCheckpoints: BorderCheckpoint[];
    exposuresAndFlights: ExposureAndFlightData;
    vaccineDoses: KeyValuePair[];
    rulesConfig: RuleConfigRedux;
    transferReason:KeyValuePair[];
};