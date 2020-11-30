import Person from './Person';

interface InvolvedContact extends Person {
	id: number;
    involvementReason: number;
	isContactedPerson: boolean;
	isolationCity: string;
	familyRelationship: string;
	selected?: boolean;
};

export default InvolvedContact;
