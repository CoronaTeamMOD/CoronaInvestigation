import { ContactedPerson } from '../ContactedPerson/ContactedPerson'
import { PlaceSubType } from './GetPlacesSubTypesByTypes';

export interface GetContactEventResponse {
    data: {
        allContactEvents: {
            nodes: ContactEvent[]
        }
    }
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
    contactedPeopleByContactEvent: {
        nodes: ContactedPerson[]
    }
}

