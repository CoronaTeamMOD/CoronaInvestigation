import * as redux from 'react-redux'
import MockAdapter from 'axios-mock-adapter';
import { subDays, eachDayOfInterval } from 'date-fns';

import axios from 'Utils/axios';
import { testHooksFunction } from 'TestHooks';
import Interaction from 'models/Contexts/InteractionEventDialogData';

import useInteractionsTab from './useInteractionsTab';
import { getDatesToInvestigate } from 'Utils/DateUtils/useDateUtils';
import { useInteractionsTabOutcome as useInteactionsTabsOutcomeInterface,
    useInteractionsTabParameters as useInteactionsTabsInputInterface } from './useInteractionsTabInterfaces';

const spy = jest.spyOn(redux, 'useSelector');
spy.mockReturnValue({});

let useInteractionsTabOutcome: useInteactionsTabsOutcomeInterface;
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
            it('get dates when symptoms start date is available', async () => {
                const receivedDates = getDatesToInvestigate(true, symptomsStartDate, coronaTestDate);
                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(symptomsStartDate, 4), end: investigationStartDate}));
            })

            it('get dates when symptoms start is not available', async () => {
                const receivedDates = getDatesToInvestigate(true, null, coronaTestDate);

                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(coronaTestDate, 10), end: investigationStartDate}));
            });
        });

        describe('asymptomatic investigated person tests:', () => {
            it('get dates when the investigated person is asymptomatic', async () => {
                const receivedDates = getDatesToInvestigate(false, null, coronaTestDate);

                expect(receivedDates).toEqual(eachDayOfInterval({start: subDays(coronaTestDate, 7), end: investigationStartDate}));
            });
        });

        describe('loadInteractions tests', () => {
            // TODO: add the test
            // it('when getting interactions from DB then it should be loaded into the state map', async () => {
            //     mockAdapter.onGet('/intersections').reply(200, {
            //         data: {
            //             investigationByEpidemioligyNumbe: {
            //               contactEventsByInvestigationId: {
            //                 nodes: [
            //                   {
            //                     contactedPeopleByContactEvent: {
            //                       nodes: [
            //                         {
            //                           personByPersonInfo: {
            //                             firstName: "חיים",
            //                             lastName: "רובין",
            //                             identificationNumber: 20060049
            //                           }
            //                         }
            //                       ]
            //                     },
            //                     placeTypeByPlaceType: {
            //                       displayName: "מבנה דת"
            //                     },
            //                     placeName: "בית כנסת שירת הים",
            //                     addressByLocationAddress: {
            //                       city: "בני ברק",
            //                       neighbourhood: null,
            //                       street: "כהנמן",
            //                       houseNum: 106,
            //                       floor: 4,
            //                       apartment: 18,
            //                       entrance: null
            //                     },
            //                     contactPhoneNumber: "050-0000000",
            //                     startTime: new Date("2020-09-02T16:07:43.238806+00:00"),
            //                     endTime: new Date("2020-09-02T15:07:43.238806+00:00")
            //                   }
            //                 ]
            //               }
            //             }
            //           }
            //     });

            //     await act(async () => {
            //         await useInteractionsTabOutcome.loadInteractions();
            //     });

            //     expect(true).toBeTruthy();
            // })
        })
    });
});