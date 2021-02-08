import { PlaceSubType } from './GetPlacesSubTypesByTypes';
import { ContactedPerson } from '../ContactedPerson/ContactedPerson'
import { InvolvedContactDB } from './GetInvolvedContacts';

export interface GetContactEventResponse {
    data: {
        allContactEvents: {
            nodes: ContactEvent[]
        }
    }
}

export interface GetContactEventByIdResponse {
    data: {
        contactEventById: ContactEvent
    }
}

export interface OccuranceData {
    startTime: ContactEvent['startTime'];
    endTime: ContactEvent['endTime'];
    unknownTime: boolean;
    externalizationApproval: ContactEvent['externalizationApproval'];
    placeDescription?: string;
}

export interface ClientInteractionsData extends ContactEvent, OccuranceData {
    additionalOccurrences?: OccuranceData[]
}

export interface ContactEvent {
    id: number,
    airline: string,
    allowsHamagenData: boolean,
    boardingStation: string,
    busCompany: string,
    cityDestination: string,
    cityOrigin: string,
    busLine: string,
    contactPersonFirstName: string,
    contactPersonLastName: string,
    contactPersonPhoneNumber: string,
    contactPhoneNumber: string,
    endStation: string,
    endTime: string,
    externalizationApproval: boolean,
    flightDestinationAirport: string,
    flightDestinationCity: string,
    flightDestinationCountry: string,
    flightNum: string,
    flightOriginAirport: string,
    flightOriginCity: string,
    flightOriginCountry: string,
    grade: string,
    investigationId: number,
    isolationStartDate: Date,
    locationAddress: string,
    numberOfContacted: number,
    placeName: string,
    placeSubType: number,
    placeType: string,
    startTime: Date,
    trainLine: string,
    placeTypeByPlaceType: PlaceSubType,
    creationTime: Date,
    contactedPeopleByContactEvent: {
        nodes: ContactedPerson[]
    }
    involvedContact: InvolvedContactDB | null
}
