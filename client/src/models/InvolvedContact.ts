import Person from './Person';

interface InvolvedContact extends Person {
    involvementReason: number;
	isContactedPerson: boolean;
	isolationCity: string;
	familyRelationship: string;
};

export default InvolvedContact;
