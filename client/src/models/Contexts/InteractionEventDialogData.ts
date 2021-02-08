import Contact from 'models/Contact';
import Address from 'models/Address';
import { DBAddress } from 'models/DBAddress';
import InteractionEventDialogFields from '../enums/InteractionsEventDialogContext/InteractionEventDialogFields';

export interface DateData {
    startTime: Date;
    endTime: Date;
    unknownTime: boolean;
}
export interface OccuranceData extends DateData{
    externalizationApproval: boolean | null;
    placeDescription?: string;
}

interface InteractionEventDialogData extends InteractionEventData, OccuranceData {
    [InteractionEventDialogFields.ADDITIONAL_OCCURRENCES]?: OccuranceData[]
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
