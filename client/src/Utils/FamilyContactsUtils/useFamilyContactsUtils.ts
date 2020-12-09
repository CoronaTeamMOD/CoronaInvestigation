import { format } from 'date-fns';

import InvolvedContact from 'models/InvolvedContact';

import FamilyContactsTableHeadersNames, { FamilyContactsTableHeaders } from './FamilyContactsTableHeaders';

const birthDateFormat = 'dd/MM/yyyy';

const useFamilyContactsUtils = () => {

    const convertToIndexedRow = (row: InvolvedContact) : IndexedContactRow => ({
        [FamilyContactsTableHeadersNames.FAMILY_RELATIONSHIP]: row.familyRelationship,
        [FamilyContactsTableHeadersNames.FIRST_NAME]: row.firstName,
        [FamilyContactsTableHeadersNames.LAST_NAME]: row.lastName,
        [FamilyContactsTableHeadersNames.IDENTIFICATION_TYPE]: row.identificationType,
        [FamilyContactsTableHeadersNames.IDENTIFICATION_NUMBER]: row.identificationNumber,
        [FamilyContactsTableHeadersNames.BIRTH_DATE]: row.birthDate,
        [FamilyContactsTableHeadersNames.PHONE_NUMBER]: row.phoneNumber,
        [FamilyContactsTableHeadersNames.ADDITIONAL_PHONE_NUMBER]: row.additionalPhoneNumber,
        [FamilyContactsTableHeadersNames.ISOLATION_CITY]: row.isolationCity
    });

    const getTableCell = (row: IndexedContactRow, cellName: string) => {
        const cellValue = row[cellName as FamilyContactsTableHeadersNames];
        if (!cellValue) return '---'; 
        switch (cellName) {
            case FamilyContactsTableHeadersNames.BIRTH_DATE: {
                return format(new Date(cellValue), birthDateFormat);
            }
            case FamilyContactsTableHeadersNames.FAMILY_RELATIONSHIP: {
                return cellValue.displayName;
            }
            default: 
                return cellValue;
        }
    };

    return {
        convertToIndexedRow,
        getTableCell,
    }

};

export type IndexedContactRow = { [T in keyof typeof FamilyContactsTableHeaders]: any};

export default useFamilyContactsUtils;
