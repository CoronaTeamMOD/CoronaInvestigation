import Person from './Person';
import FamilyRelationship from './FamilyRelationship';

interface InvolvedContact extends Person {
	id: number;
    involvementReason: number | null;
	isContactedPerson: boolean;
	isolationCity: string;
	familyRelationship: FamilyRelationship | null;
	selected?: boolean;
	educationGrade: string,
	educationClassNumber: number,
	institutionName: string,
	contactType: number,
};

export default InvolvedContact;
