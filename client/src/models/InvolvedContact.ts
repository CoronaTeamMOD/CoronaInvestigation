import Person from './Person';

interface InvolvedContact extends Person {
    involvementReason: number | null;
	isContactedPerson: boolean;
	isolationCity: string;
	familyRelationship: string | null;
};

export default InvolvedContact;
