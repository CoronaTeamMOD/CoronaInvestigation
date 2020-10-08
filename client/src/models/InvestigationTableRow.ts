import Investigator from './Investigator';

interface InvestigationTableRow {
    epidemiologyNumber: number;
    status: string;
    fullName: string;
    phoneNumber: string;
    age: number;
    city: string;
    investigator: Investigator;
};

export default InvestigationTableRow;
