import { format } from 'date-fns';

import InvolvedContact from 'models/InvolvedContact';
import formatDate from 'Utils/DateUtils/formatDate';

import FamilyContactsTableHeadersNames, { FamilyContactsTableHeaders } from './FamilyContactsTableHeaders';

const birthDateFormat = 'dd/MM/yyyy';

const useFamilyContactsUtils = () => {

    const convertToIndexedRow = (row: InvolvedContact) : IndexedContactRow => ({
        [FamilyContactsTableHeadersNames.FAMILY_RELATIONSHIP]: row.familyRelationship,
        [FamilyContactsTableHeadersNames.FIRST_NAME]: row.firstName,
        [FamilyContactsTableHeadersNames.LAST_NAME]: row.lastName,
        [FamilyContactsTableHeadersNames.IDENTIFICATION_TYPE]: row.identificationType.type,
        [FamilyContactsTableHeadersNames.IDENTIFICATION_NUMBER]: row.identificationNumber,
        [FamilyContactsTableHeadersNames.BIRTH_DATE]: row.birthDate,
        [FamilyContactsTableHeadersNames.PHONE_NUMBER]: row.phoneNumber,
        [FamilyContactsTableHeadersNames.RECOVERY_DATE]: formatDate(row.epidemiologicStatus?.recoveryDate, '---'),
        [FamilyContactsTableHeadersNames.SEROLOGIC_IMMUNITY_START_DATE]: formatDate(row.epidemiologicStatus?.serologicImmunityStartDate, '---'),
        [FamilyContactsTableHeadersNames.SEROLOGIC_IMMUNITY_EXPIERY_DATE]: formatDate(row.epidemiologicStatus?.serologicImmunityExpirationDate, '---'),
        [FamilyContactsTableHeadersNames.VACCINE_EFFECTIVENESS_START_DATE]: formatDate(row.epidemiologicStatus?.vaccineEffectivenessStartDate, '---'),
        [FamilyContactsTableHeadersNames.VACCINE_EFFECTIVENESS_EXPIERY_DATE]: formatDate(row.epidemiologicStatus?.vaccineExpirationDate, '---'),
        [FamilyContactsTableHeadersNames.FINAL_EPIDEMIOLOGICAL_STATUS_DESC]: row?.finalEpidemiologicalStatusDesc ? row?.finalEpidemiologicalStatusDesc : '---',
        [FamilyContactsTableHeadersNames.ISOLATION_CITY]: row.isolationAddress?.city?.displayName,
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
