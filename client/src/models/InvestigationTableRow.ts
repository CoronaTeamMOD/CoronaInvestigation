import County from './County';
import Investigator from './Investigator';

interface InvestigationTableRow {
    isChecked: boolean;
    epidemiologyNumber: number;
    coronaTestDate: string;
    isComplex: boolean;
    priority: number;
    mainStatus: string;
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
};

export default InvestigationTableRow;
