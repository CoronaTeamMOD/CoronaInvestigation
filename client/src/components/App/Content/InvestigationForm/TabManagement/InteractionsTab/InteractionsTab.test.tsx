import * as redux from 'react-redux'
import MockAdapter from 'axios-mock-adapter';
import { subDays, eachDayOfInterval } from 'date-fns';

import axios from 'Utils/axios';
import { testHooksFunction } from 'TestHooks';
import Interaction from 'models/Contexts/InteractionEventDialogData';

import useInteractionsTab from './useInteractionsTab';
import { useDateUtils, useDateUtilsOutCome } from 'Utils/DateUtils/useDateUtils';
import { useInteractionsTabOutcome as useInteactionsTabsOutcomeInterface,
    useInteractionsTabParameters as useInteactionsTabsInputInterface } from './useInteractionsTabInterfaces';

const spy = jest.spyOn(redux, 'useSelector');
spy.mockReturnValue({});

let useInteractionsTabOutcome: useInteactionsTabsOutcomeInterface;
let useDateUtilsOutcome: useDateUtilsOutCome;
let interactionsForTests: Interaction[] = [];
let useInteractionsTabInput: useInteactionsTabsInputInterface = {
    interactions: interactionsForTests,
    setAreThereContacts: () => {}, 
    setDatesToInvestigate: () => {},
    // @ts-ignore
    setInteractions: (interactionsArr: Interaction[]) => {interactionsForTests = interactionsArr},
    setEducationMembers: () => {},
    setFamilyMembers: () => {},
    completeTabChange: () => {},
    setInteractionsTabSettings: () => {},
};

const mockAdapter = new MockAdapter(axios);

describe('useInteractionsTab tests', () => {
    afterEach(() => {
        jest.resetAllMocks()
        mockAdapter.reset();
    });

    describe('getDatesToInvestigate tests:', () => {
        const investigationStartDate = new Date();
        const coronaTestDate = new Date();
        const symptomsStartDate = new Date();
        beforeEach(async () => {
            subDays(coronaTestDate, 3);
            subDays(symptomsStartDate, 5);
            await testHooksFunction(() => {
                useInteractionsTabOutcome = useInteractionsTab(useInteractionsTabInput);
            });
        });
        describe('symptomatic investigated person tests:', () => {
            beforeEach(async () => {
                await testHooksFunction(() => {
                    useDateUtilsOutcome = useDateUtils();
                })
            })
            it('get dates when symptoms start date is available', async () => {
                const receivedDates = useDateUtilsOutcome.getDatesToInvestigate(true, symptomsStartDate, coronaTestDate);
                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(symptomsStartDate, 4), end: investigationStartDate}));
            })

            it('get dates when symptoms start is not available', async () => {
                const receivedDates = useDateUtilsOutcome.getDatesToInvestigate(true, null, coronaTestDate);

                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(coronaTestDate, 7), end: investigationStartDate}));
            });
        });

        describe('asymptomatic investigated person tests:', () => {
            it('get dates when the investigated person is asymptomatic', async () => {
                const receivedDates = useDateUtilsOutcome.getDatesToInvestigate(false, null, coronaTestDate);

                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(coronaTestDate, 7), end: investigationStartDate}));
            });
        });
    });
});