import County from './County';
import Investigator from './Investigator';
import InvestigationMainStatus from './InvestigationMainStatus';

interface InvestigationTableRow {
    isChecked: boolean;
    epidemiologyNumber: number;
    coronaTestDate: string;
    isComplex: boolean;
    priority: number;
    mainStatus: InvestigationMainStatus;
    subStatus: string;
    fullName: string;
    phoneNumber: string;
    age: number;
    city: string;
    investigationDesk: string,
    investigator: Investigator;
    county: County;
    comment: string;
    statusReason: string;
    wasInvestigationTransferred: boolean;
    transferReason: string;
    groupId: string;
    canFetchGroup: boolean;
    groupReason: string;
    otherReason: string;
    reasonId: number;
    subOccupation: string;
    parentOccupation:string;
    isInInstitute: boolean;
    creationDate: Date;
    startTime: Date;
    isSelfInvestigated: boolean;
    selfInvestigationStatus: number;
    selfInvestigationUpdateTime: string;
};

export default InvestigationTableRow;
