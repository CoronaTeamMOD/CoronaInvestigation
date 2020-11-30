import Person from './Person';

interface InvolvedContact extends Person {
	id: number;
    involvementReason: number | null;
	isContactedPerson: boolean;
	isolationCity: string;
	familyRelationship: string | null;
	selected?: boolean;
};

export default InvolvedContact;
