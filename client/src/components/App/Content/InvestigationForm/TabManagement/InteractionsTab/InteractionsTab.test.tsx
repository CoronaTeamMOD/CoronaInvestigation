import axios  from 'axios';
import * as redux from 'react-redux'
import MockAdapter from 'axios-mock-adapter';
import { testHooksFunction } from 'TestHooks';
import configureMockStore from 'redux-mock-store';
import { subDays, eachDayOfInterval, compareDesc } from 'date-fns';

import Interaction from 'models/Contexts/InteractionEventDialogData';
import { getDatesToInvestigate } from 'Utils/ClinicalDetails/symptomsUtils';

import useInteractionsTab from './useInteractionsTab';
import { useInteractionsTabOutcome as useInteactionsTabsOutcomeInterface,
    useInteractionsTabParameters as useInteactionsTabsInputInterface } from './useInteractionsTabInterfaces';

let useInteractionsTabOutcome: useInteactionsTabsOutcomeInterface;
let interactionsForTests: Interaction[] = [];
let useInteractionsTabInput: useInteactionsTabsInputInterface = {
    interactions: interactionsForTests,
    setAreThereContacts: () => {}, 
    // @ts-ignore
    setInteractions: (interactionsArr: Interaction[]) => {interactionsForTests = interactionsArr},
    setEducationMembers: () => {},
    completeTabChange: () => {},
    setInteractionsTabSettings: () => {},
    familyMembersStateContext: {familyMembers: []},
};

const mockAdapter = new MockAdapter(axios);

const mockSelectors = () => {
    const mockStore = configureMockStore()({
      investigation: {
        datesToInvestigate: []
      },
    });
    jest
      .spyOn(redux, 'useSelector')
      .mockImplementation(state => state(mockStore.getState()));
};

describe('useInteractionsTab tests', () => {
    beforeEach(() => {
        mockSelectors();
    })
    afterEach(() => {
        jest.resetAllMocks()
        mockAdapter.reset();
    });

    describe('getDatesToInvestigate tests:', () => {
        const investigationStartDate = new Date();
        const validationDate = new Date();
        const symptomsStartDate = new Date();
        beforeEach(async () => {
            subDays(validationDate, 3);
            subDays(symptomsStartDate, 5);
            await testHooksFunction(() => {
                useInteractionsTabOutcome = useInteractionsTab(useInteractionsTabInput);
            });
        });
        describe('symptomatic investigated person tests:', () => {
            it('get dates when symptoms start date is available', async () => {
                const receivedDates = getDatesToInvestigate(true, symptomsStartDate, validationDate);
                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(symptomsStartDate, 4), end: investigationStartDate}).sort(compareDesc));
            })

            it('get dates when symptoms start is not available', async () => {
                const receivedDates = getDatesToInvestigate(true, null, validationDate);

                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(validationDate, 7), end: investigationStartDate}).sort(compareDesc));
            });
        });

        describe('asymptomatic investigated person tests:', () => {
            it('get dates when the investigated person is asymptomatic', async () => {
                const receivedDates = getDatesToInvestigate(false, null, validationDate);
                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(validationDate, 7), end: investigationStartDate}).sort(compareDesc));
            });
        });
    });
});