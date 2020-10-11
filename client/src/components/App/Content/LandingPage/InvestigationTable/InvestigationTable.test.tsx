import { format } from 'date-fns';

import InvestigationTableRow from 'models/InvestigationTableRow';

import  {createRowData}  from './useInvestigationTable';

describe('investigationTable tests', () => {
  let newRowData: InvestigationTableRow;

  beforeAll(() => {
    newRowData = {
      epidemiologyNumber: 111,
      status: 'חדש',
      fullName: 'אמילי',
      phoneNumber: '053-3486954',
      age: 25,
      city: 'חיפה',
      coronaTestDate: format(new Date(), 'dd/MM'),
      priority: 1,
      investigator: {
        id: '1',
        userName: 'one'
      }
    };
  });

  it('shuld create correctly tableRow Object', async () => {
    const newRow = createRowData(
      newRowData.epidemiologyNumber,
      newRowData.coronaTestDate,
      newRowData.priority,
      newRowData.status,
      newRowData.fullName,
      newRowData.phoneNumber,
      newRowData.age,
      newRowData.city,
      newRowData.investigator
    );

    expect(newRow).toEqual(newRowData);
  });

  it('shuld not create correctly tableRow Object', async () => {
    const newRow = createRowData(
      newRowData.epidemiologyNumber,
      newRowData.coronaTestDate,
      newRowData.priority,
      newRowData.fullName,
      newRowData.status,
      newRowData.phoneNumber,
      newRowData.age,
      newRowData.city,
      newRowData.investigator
    );

    expect(newRow).not.toEqual(newRowData);
  });
});
