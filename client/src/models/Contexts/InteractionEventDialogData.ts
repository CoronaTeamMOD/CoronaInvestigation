import Contact from 'models/Contact';
import Address from 'models/Address';
import { DBAddress } from 'models/DBAddress';

export interface OccuranceData {
    startTime: Date;
    endTime: Date;
    unknownTime: boolean;
    externalizationApproval: boolean | null;
    placeDescription?: string;
}

interface InteractionEventDialogData extends InteractionEventData, OccuranceData {
    additionalOccurrences?: OccuranceData[]
}

interface InteractionEventData {
    id?: number;
    isRepetitive: boolean | null;
    placeType: string;
    investigationId: number;
    placeName?: string;
    locationAddress: Address;
    placeSubType: number | null;
    busLine?: string;
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
    creationTime: Date;
    privateHouseAddress?: DBAddress;
};

export default InteractionEventDialogData;
