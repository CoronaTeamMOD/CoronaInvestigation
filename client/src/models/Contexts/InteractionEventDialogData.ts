import Contact from 'models/Contact';
import Address from 'models/Address';
import PhoneNumberControl from 'models/PhoneNumberControl';

export default interface InteractionEventDialogData {
    id?: number;
    placeType: string;
    startTime: Date;
    endTime: Date;
    externalizationApproval: boolean;
    investigationId: number;
    placeName?: string;
    locationAddress: Address;
    placeSubType: number;
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
    contactPersonPhoneNumber?: PhoneNumberControl;
    hospitalDepartment?: string;
    contacts: Contact[];
    flightDestinationAirport?: string;
    flightDestinationCity?: string;
    flightDestinationCountry?: string;
    flightOriginAirport?: string;
    flightOriginCity?: string;
    flightOriginCountry?: string;
}