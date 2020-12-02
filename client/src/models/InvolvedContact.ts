import Person from './Person';

interface InvolvedContact extends Person {
    involvementReason: number | null;
	isContactedPerson: boolean;
	isolationCity: string;
	familyRelationship: string | null;
	educationGrade: string,
	educationClassNumber: number,
	institutionName: string,
	contactType: number,
};

export default InvolvedContact;
