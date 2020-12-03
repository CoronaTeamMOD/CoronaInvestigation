import Person from './Person';

interface InvolvedContact extends Person {
	id: number;
    involvementReason: number | null;
	isContactedPerson: boolean;
	isolationCity: string;
	familyRelationship: string | null;
	selected?: boolean;
	educationGrade: string,
	educationClassNumber: number,
	institutionName: string,
	contactType: number,
};

export default InvolvedContact;
