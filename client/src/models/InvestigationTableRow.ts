import Investigator from './Investigator';

interface InvestigationTableRow {
    epidemiologyNumber: number;
    coronaTestDate: string,
    priority: number,
    status: string;
    fullName: string;
    phoneNumber: string;
    age: number;
    city: string;
    investigator: Investigator;
};

export default InvestigationTableRow;
