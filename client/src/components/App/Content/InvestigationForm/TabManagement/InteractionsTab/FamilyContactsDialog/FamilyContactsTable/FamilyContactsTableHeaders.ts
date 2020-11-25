enum FamilyContactsTableHeadersNames {
    FAMILY_RELATIONSHIP = 'familyRelationship',
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    IDENTIFICATION_TYPE = 'identificationType',
    IDENTIFICATION_NUMBER = 'identificationNumber',
    BIRTH_DATE = 'birthDate',
    PHONE_NUMBER = 'phoneNumber',
    ADDITIONAL_PHONE_NUMBER = 'additionalPhoneNumber',
    ISOLATION_CITY = 'isolationCity'
};

export const FamilyContactsTableHeaders = {
    [FamilyContactsTableHeadersNames.FAMILY_RELATIONSHIP]: 'קרבה משפחתית',
    [FamilyContactsTableHeadersNames.FIRST_NAME]: 'שם פרטי',
    [FamilyContactsTableHeadersNames.LAST_NAME]: 'שם משפחה',
    [FamilyContactsTableHeadersNames.IDENTIFICATION_TYPE]: 'סוג מזהה',
    [FamilyContactsTableHeadersNames.IDENTIFICATION_NUMBER]: 'מספר מזהה',
    [FamilyContactsTableHeadersNames.BIRTH_DATE]: 'תאריך לידה',
    [FamilyContactsTableHeadersNames.PHONE_NUMBER]: 'טלפון ראשי',
    [FamilyContactsTableHeadersNames.ADDITIONAL_PHONE_NUMBER]: 'טלפון משני',
    [FamilyContactsTableHeadersNames.ISOLATION_CITY]: 'ישוב השהייה בבידוד'
}

export default FamilyContactsTableHeadersNames;