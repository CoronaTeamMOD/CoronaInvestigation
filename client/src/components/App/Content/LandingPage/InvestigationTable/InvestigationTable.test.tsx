import { DistributedTracingModes } from '@microsoft/applicationinsights-web';
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
                userName: 'one',
                isActive: true
            },
            county: {
                displayName: 'תל אביב - תל אביב',
                id: 50,
            },
            investigationDesk: 'שם דסק',
            comment: 'הערה',
            statusReason: 'כי ככה',
            complexityReasonsId: [1],
            wasInvestigationTransferred: false,
            transferReason: '',
            groupId: '',
            canFetchGroup: false,
            groupReason: '',
            otherReason: '',
            reasonId: 1,
            subOccupation: '',
            parentOccupation: '',
            isInInstitute: false,
            isSelfInvestigated: false,
            creationDate: new Date(),
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
            newRowData.isChecked,
            newRowData.complexityReasonsId,
            newRowData.wasInvestigationTransferred,
            newRowData.transferReason,
            newRowData.groupId,
            newRowData.canFetchGroup,
            newRowData.groupReason,
            newRowData.otherReason,
            newRowData.reasonId,
            newRowData.subOccupation,
            newRowData.parentOccupation,
            newRowData.isInInstitute,
            newRowData.isSelfInvestigated,
            newRowData.selfInvestigationUpdateTime

        );

        expect(newRow).not.toEqual(newRowData);
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
            newRowData.isChecked,
            newRowData.complexityReasonsId,
            newRowData.wasInvestigationTransferred,
            newRowData.transferReason,
            newRowData.groupId,
            newRowData.canFetchGroup,
            newRowData.groupReason,
            newRowData.otherReason,
            newRowData.reasonId,
            newRowData.subOccupation,
            newRowData.parentOccupation,
            newRowData.isInInstitute,
            newRowData.isSelfInvestigated,
            newRowData.selfInvestigationUpdateTime
        );

        expect(newRow).not.toEqual(newRowData);
    });
});
