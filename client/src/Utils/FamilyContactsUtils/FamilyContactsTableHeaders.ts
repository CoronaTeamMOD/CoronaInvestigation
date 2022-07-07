enum FamilyContactsTableHeadersNames {
    FAMILY_RELATIONSHIP = 'familyRelationship',
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    IDENTIFICATION_TYPE = 'identificationType',
    IDENTIFICATION_NUMBER = 'identificationNumber',
    BIRTH_DATE = 'birthDate',
    PHONE_NUMBER = 'phoneNumber',
    ISOLATION_CITY = 'isolationCity',
    RECOVERY_DATE = 'recoveryDate',
    SEROLOGIC_IMMUNITY_START_DATE = 'serologicImmunityStartDate',
    SEROLOGIC_IMMUNITY_EXPIERY_DATE = 'serologicImmunityExpieryDate',
    VACCINE_EFFECTIVENESS_START_DATE = 'vaccineEffectivenessStartDate',
    VACCINE_EFFECTIVENESS_EXPIERY_DATE = 'vaccineEffectivenessExpieryDate',
    FINAL_EPIDEMIOLOGICAL_STATUS_DESC = 'finalEpidemiologicalStatusDesc',
    IS_STAY_ANOTHER_COUNTRY = 'isStayAnotherCountry'
};

export const FamilyContactsTableHeaders = {
    [FamilyContactsTableHeadersNames.FAMILY_RELATIONSHIP]: 'קרבה',
    [FamilyContactsTableHeadersNames.FIRST_NAME]: 'שם',
    [FamilyContactsTableHeadersNames.LAST_NAME]: 'משפחה',
    [FamilyContactsTableHeadersNames.IDENTIFICATION_TYPE]: 'מזהה',
    [FamilyContactsTableHeadersNames.IDENTIFICATION_NUMBER]: 'מספר מזהה',
    [FamilyContactsTableHeadersNames.BIRTH_DATE]: 'ת. לידה',
    [FamilyContactsTableHeadersNames.PHONE_NUMBER]: 'טלפון',
    [FamilyContactsTableHeadersNames.RECOVERY_DATE]: 'תאריך החלמה',
    [FamilyContactsTableHeadersNames.SEROLOGIC_IMMUNITY_START_DATE]: 'תחילת חסינות סרולוגית',
    [FamilyContactsTableHeadersNames.SEROLOGIC_IMMUNITY_EXPIERY_DATE]: 'תוקף חסינות סרולוגית',
    [FamilyContactsTableHeadersNames.VACCINE_EFFECTIVENESS_START_DATE]: 'אפקטיביות חיסון',
    [FamilyContactsTableHeadersNames.VACCINE_EFFECTIVENESS_EXPIERY_DATE]: 'תוקף חיסון',
    [FamilyContactsTableHeadersNames.FINAL_EPIDEMIOLOGICAL_STATUS_DESC ]: 'סטטוס מסכם',
    [FamilyContactsTableHeadersNames.ISOLATION_CITY]: 'ישוב השהייה בבידוד',
    [FamilyContactsTableHeadersNames.IS_STAY_ANOTHER_COUNTRY]: 'האם חזר מחו"ל',
}

export default FamilyContactsTableHeadersNames;
