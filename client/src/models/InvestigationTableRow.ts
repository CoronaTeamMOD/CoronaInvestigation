import Investigator from './Investigator';

interface InvestigationTableRow {
    epidemiologyNumber: number;
    coronaTestDate: string,
    status: string;
    fullName: string;
    phoneNumber: string;
    age: number;
    city: string;
    investigator: Investigator;
};

export default InvestigationTableRow;
