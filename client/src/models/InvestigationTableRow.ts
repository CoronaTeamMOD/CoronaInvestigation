import County from './County';
import Investigator from './Investigator';

interface InvestigationTableRow {
    epidemiologyNumber: number;
    coronaTestDate: string;
    priority: number;
    mainStatus: string;
    subStatus: string;
    fullName: string;
    phoneNumber: string;
    age: number;
    city: string;
    investigator: Investigator;
    county: County;
};

export default InvestigationTableRow;
