import {LocationAddress} from '../LocationAddress/LocationAddress';
import {ContactedPerson} from "../ContactedPerson/ContactedPerson";

export default interface InteractionEventDialogData {
    id?: number;
    locationType: string;
    startTime: Date;
    endTime: Date;
    externalizationApproval: boolean;
    investigationId: string;
    locationName?: string;
    locationAddress: LocationAddress;
    locationSubType: number;
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
    numberOfContacted: number;
    contactedPeople: ContactedPerson[]
}