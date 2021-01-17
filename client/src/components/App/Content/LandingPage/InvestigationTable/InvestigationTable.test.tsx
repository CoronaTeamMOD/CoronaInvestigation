import { format } from 'date-fns';

import InvestigationTableRow from 'models/InvestigationTableRow';

import { createRowData } from './useInvestigationTable';

describe('investigationTable tests', () => {
    let newRowData: InvestigationTableRow;

    beforeAll(() => {

        newRowData = {
            isChecked: false,
            epidemiologyNumber: 111,
            mainStatus: 'חדש',
            subStatus: 'חדש2',
            isComplex: false,
            fullName: 'אמילי',
            phoneNumber: '053-3486954',
            age: 25,
            city: 'חיפה',
            validationDate: format(new Date(), 'dd/MM'),
            priority: 1,
            investigator: {
                id: '1',
                userName: 'one'
            },
            county: {
                displayName: 'תל אביב - תל אביב',
                id: 50,
            },
            investigationDesk: 'שם דסק',
            comment: 'הערה',
            statusReason: 'כי ככה'
        };
    });

    it('should create correctly tableRow Object', async () => {
        const newRow = createRowData(
            newRowData.epidemiologyNumber,
            newRowData.validationDate,
            newRowData.isComplex,
            newRowData.priority,
            newRowData.mainStatus,
            newRowData.subStatus,
            newRowData.fullName,
            newRowData.phoneNumber,
            newRowData.age,
            newRowData.city,
            newRowData.investigationDesk,
            newRowData.county,
            newRowData.investigator,
            newRowData.comment,
            newRowData.statusReason,
            newRowData.creationDate,
            newRowData.startTime,
        );

        expect(newRow).toEqual(newRowData);
    });

    it('should not create correctly tableRow Object', async () => {
        const newRow = createRowData(
            newRowData.epidemiologyNumber,
            newRowData.validationDate,
            newRowData.isComplex,
            newRowData.priority,
            newRowData.fullName,
            newRowData.mainStatus,
            newRowData.subStatus,
            newRowData.phoneNumber,
            newRowData.age,
            newRowData.city,
            newRowData.investigationDesk,
            newRowData.county,
            newRowData.investigator,
            newRowData.comment,
            newRowData.statusReason,
            newRowData.creationDate,
            newRowData.startTime,
        );

        expect(newRow).not.toEqual(newRowData);
    });
});
