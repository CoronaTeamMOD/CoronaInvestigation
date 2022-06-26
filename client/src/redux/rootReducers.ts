import { combineReducers, Reducer, CombinedState, AnyAction } from 'redux';

import formReducer from './Form/formReducer';
import cityReducer from './City/cityReducer';
import userReducer from './User/userReducer';
import deskReducer from './Desk/deskReducer';
import StoreStateType from './storeStateType';
import countyReducer from './County/countyReducer';
import genderReducer from './Gender/GenderReducer';
import countryReducer from './Country/countryReducer';
import addressReducer from './Address/AddressReducer';
import airlineReducer from './Airlines/airlineReducer';
import statusesReducer from './Status/statusesReducer';
import districtReducer from './District/districtReducer';
import authorityReducer from './Authority/authorityReducer';
import isLoadingReducer from './IsLoading/isLoadingReducer';
import greenPassReducer from './GreenPass/greenPassReducer';
import placetypeReducer from './PlaceTypes/placetypeReducer';
import contactTypeReducer from './ContactType/contactTypeReducer';
import subStatusesReducer from './SubStatuses/subStatusesReducer';
import occupationsReducer from './Occupations/occupationsReducer';
import investigationReducer from './Investigation/investigationReducer';
import educationGradeReducer from './EducationGrade/educationGradeReducer';
import complexReasonsReducer from './ComplexReasons/complexReasonsReducer';
import isInInvestigationReducer from './IsInInvestigations/isInInvestigationReducer';
import identificationTypesReducer from './IdentificationTypes/identificationTypesReducer';
import groupedInvestigationReducer from './GroupedInvestigations/GroupedInvestigationsReducer';
import interactedContactsReducer from './InteractedContacts/interactedContactsReducer';
import ClinicalDetailsReducer from './ClinicalDetails/ClinicalDetailsReducer';
import personalInfoReducer from './PersonalInfo/personalInfoReducer';
import investigatorReferenceStatusesReducer from './investigatorReferenceStatuses/investigatorReferenceStatusesReduces';
import botInvestigationInfoReducer from './BotInvestigationInfo/botInvestigationInfoReducer';
import chatStatusesReducer from './ChatStatuses/chatStatusesReducer';
import mutationInfoReducer from './MutationInfo/mutationInfoReducer';
import complexityReasonsReducer from './ComplexityReasons/ComplexityReasonsReducer';
import borderCheckpointTypesReducer from './BorderCheckpointTypes/BorderCheckpointTypesReducer';
import borderCheckpointsReducer from './BorderCheckpoints/BorderCheckpointsReducer';
import exposuresAndFlightsReducer from './ExposuresAndFlights/ExposuresAndFlightsReducer';
import vaccineDosesReducer from './VaccineDoses/VaccineDosesReducer';
import rulesConfigReducer from './RulesConfig/RulesConfigReducer';
import interactionEventsReducer from './InteractionEvents/InteractionEventsReducer';

export default combineReducers<StoreStateType>({
     occupations: occupationsReducer,
     user: userReducer,
     isLoading: isLoadingReducer,
     isInInvestigation: isInInvestigationReducer,
     investigation: investigationReducer,
     gender: genderReducer,
     cities: cityReducer,
     countries: countryReducer,
     contactTypes: contactTypeReducer,
     statuses: statusesReducer,
     subStatuses: subStatusesReducer,
     formsValidations: formReducer,
     address: addressReducer,
     educationGrades: educationGradeReducer,
     placeSubTypesByTypes: placetypeReducer,
     district: districtReducer,
     county: countyReducer,
     desk: deskReducer,
     groupedInvestigations: groupedInvestigationReducer,
     authorities: authorityReducer,
     complexReasons: complexReasonsReducer,
     greenPass: greenPassReducer,
     identificationTypes: identificationTypesReducer,
     airlines: airlineReducer,
     interactedContacts: interactedContactsReducer,
     clinicalDetails: ClinicalDetailsReducer,
     personalInfo: personalInfoReducer,
     investigatorReferenceStatuses: investigatorReferenceStatusesReducer,
     botInvestigationInfo: botInvestigationInfoReducer,
     chatStatuses: chatStatusesReducer,
     mutationInfo: mutationInfoReducer,
     complexityReasons: complexityReasonsReducer,
     borderCheckpointTypes: borderCheckpointTypesReducer,
     borderCheckpoints: borderCheckpointsReducer,
     exposuresAndFlights: exposuresAndFlightsReducer,
     vaccineDoses: vaccineDosesReducer,
     rulesConfig: rulesConfigReducer,
     interactionEvents: interactionEventsReducer,
}) as unknown as Reducer<CombinedState<StoreStateType>, AnyAction>;