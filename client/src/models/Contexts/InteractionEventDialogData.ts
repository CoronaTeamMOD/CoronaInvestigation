import Address from '../Address';
import Contact from 'models/Contact';

export default interface InteractionEventDialogData {
    id?: number;
    placeType: string;
    startTime: Date;
    endTime: Date;
    externalizationApproval: boolean;
    investigationId: number;
    placeName?: string;
    locationAddress: Address;
    placeSubType: string;
    busLine?: string,
    airline?: string;
    flightNum?: string;
    busCompany?: string;
    grade?: string;
    boardingStation?: string;
    cityOrigin?: string;
    endStation?: string;
    cityDestination?: string;
    contactPersonFirstName?: string;
    contactPersonLastName?: string;
    contactPersonPhoneNumber?: string;
    hospitalDepartment?: string;
    contacts: Contact[];
    flightDestinationAirport?: string;
    flightDestinationCity?: string;
    flightDestinationCountry?: string;
    flightOriginAirport?: string;
    flightOriginCity?: string;
    flightOriginCountry?: string;
}