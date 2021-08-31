import County from './County';
import Investigator from './Investigator';
import InvestigationMainStatus from './InvestigationMainStatus';

interface InvestigationTableRow {
    isChecked: boolean;
    epidemiologyNumber: number;
    validationDate: string;
    isComplex: boolean;
    complexityReasonsId: (number | null)[];
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
    parentOccupation: string;
    isInInstitute: boolean;
    creationDate: Date;
    startTime: Date;
    isSelfInvestigated: boolean;
    selfInvestigationStatus: number;
    selfInvestigationUpdateTime: string;
    wasAbroad: boolean;
};

export default InvestigationTableRow;
