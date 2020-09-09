import Address from '../Address';
import Contact from 'models/Contact';

export default interface InteractionEventDialogData {
    id?: number;
    locationType: string;
    startTime: Date;
    endTime: Date;
    externalizationApproval: boolean;
    investigationId: number;
    locationName?: string;
    locationAddress: Address;
    locationSubType: string;
    trainLine?: string,
    busLine?: string,
    airline?: string;
    flightNumber?: string;
    busCompany?: string;
    grade?: string;
    boardingStation?: string;
    boardingCountry?: string;
    boardingCity?: string;
    endStation?: string;
    endCountry?: string;
    endCity?: string;
    buisnessContactName?: string;
    buisnessContactNumber?: string;
    hospitalDepartment?: string;
    contacts: Contact[];
}