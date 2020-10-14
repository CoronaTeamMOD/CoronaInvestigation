import { format } from 'date-fns';

import InvestigationTableRow from 'models/InvestigationTableRow';

import { createRowData } from './useInvestigationTable';

describe('investigationTable tests', () => {
    let newRowData: InvestigationTableRow;

    beforeAll(() => {

        newRowData = {
            epidemiologyNumber: 111,
            mainStatus: 'חדש',
            subStatus: 'חדש2',
            fullName: 'אמילי',
            phoneNumber: '053-3486954',
            age: 25,
            city: 'חיפה',
            coronaTestDate: format(new Date(), 'dd/MM'),
            priority: 1,
            investigator: {
                id: '1',
                userName: 'one'
            },
            county: {
                displayName: 'תל אביב - תל אביב',
                id: 50,
            },
            investigationDesk: 'שם דסק'
        };
    });

    it('should create correctly tableRow Object', async () => {
        const newRow = createRowData(
            newRowData.epidemiologyNumber,
            newRowData.coronaTestDate,
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
        );

        expect(newRow).toEqual(newRowData);
    });

    it('should not create correctly tableRow Object', async () => {
        const newRow = createRowData(
            newRowData.epidemiologyNumber,
            newRowData.coronaTestDate,
            newRowData.priority,
            newRowData.fullName,
            newRowData.mainStatus,
            newRowData.subStatus,
            newRowData.phoneNumber,
            newRowData.age,
            newRowData.city,
            newRowData.investigationDesk,
            newRowData.county,
            newRowData.investigator
        );

        expect(newRow).not.toEqual(newRowData);
    });
});
