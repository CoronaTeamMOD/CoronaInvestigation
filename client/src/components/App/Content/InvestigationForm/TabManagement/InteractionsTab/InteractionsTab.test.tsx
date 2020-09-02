import { testHooksFunction } from 'TestHooks';
import { subDays, eachDayOfInterval } from 'date-fns';

import useInteractionsTab from './useInteractionsTab';
import { useInteractionsTabOutcome as useInteactionsTabsOutcomeInterface} from './InteractionsTabInterfaces';
import { intialStartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

let useInteractionsTabOutcome: useInteactionsTabsOutcomeInterface;

describe('useInteractionsTab tests', () => {
    afterEach(() => jest.resetAllMocks());

    describe('getDatesToInvestigate tests:', () => {
        beforeEach(async () => {
            await testHooksFunction(() => {
                useInteractionsTabOutcome = useInteractionsTab();
            });
        })

        describe('symptomatic investigated person tests:', () => {
            const initialSymptomaticInvestigationDateVariables = {...intialStartInvestigationDateVariables, hasSymptoms: true}
            
            it('get dates when symptoms start date is available', async () => {
                const endInvestigationDate = new Date();
                const symptomsStartDate: Date = subDays(endInvestigationDate, 2);
                const startInvestigationDateVariables = {
                    ...initialSymptomaticInvestigationDateVariables, symptomsStartDate, endInvestigationDate
                }
                const recievedDates = useInteractionsTabOutcome.getDatesToInvestigate(startInvestigationDateVariables);
                
                expect(recievedDates).toEqual(eachDayOfInterval({start: subDays(symptomsStartDate, 4), end: endInvestigationDate}));
            })

            it('get dates when symptoms start is not available', async () => {
                const endInvestigationDate = new Date();
                const startInvestigationDateVariables = {
                    ...initialSymptomaticInvestigationDateVariables, endInvestigationDate
                }
                const recievedDates = useInteractionsTabOutcome.getDatesToInvestigate(startInvestigationDateVariables);
                
                expect(recievedDates).toEqual(eachDayOfInterval({start: subDays(endInvestigationDate, 10), end: endInvestigationDate}));
            });
        });

        describe('unsymptomatic investigated person tests:', () => {
            const initialUnsymptomaticInvestigationDateVariables = {...intialStartInvestigationDateVariables, hasSymptoms: false}

            it('get dates when the investigated person is usymptomatic', async () => {
                const endInvestigationDate = new Date();
                const startInvestigationDateVariables = {
                    ...initialUnsymptomaticInvestigationDateVariables, endInvestigationDate
                }
                const recievedDates = useInteractionsTabOutcome.getDatesToInvestigate(startInvestigationDateVariables);
                
                expect(recievedDates).toEqual(eachDayOfInterval({start: subDays(endInvestigationDate, 7), end: endInvestigationDate}));
            });
        });
    });
});
