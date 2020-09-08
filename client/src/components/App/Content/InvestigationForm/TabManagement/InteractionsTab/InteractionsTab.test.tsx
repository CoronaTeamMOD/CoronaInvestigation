import MockAdapter from 'axios-mock-adapter';
import { subDays, eachDayOfInterval } from 'date-fns';

import axios from 'Utils/axios';
import Interaction from 'models/Interaction';
import { testHooksFunction } from 'TestHooks';

import useInteractionsTab from './useInteractionsTab';
import { useInteractionsTabOutcome as useInteactionsTabsOutcomeInterface,
        useInteractionsTabInput as useInteactionsTabsInputInterface } from './useInteractionsTabInterfaces';
import { intialStartInvestigationDateVariables } from '../../StartInvestigationDateVariables/StartInvestigationDateVariables';

let interactionsForTests = new Map<number, Interaction[]>();
let useInteractionsTabOutcome: useInteactionsTabsOutcomeInterface;
let useInteractionsTabInput: useInteactionsTabsInputInterface = { 
    setNewInteractionEventId: () => {}, 
    interactions: interactionsForTests,
    // @ts-ignore
    setInteractions: (map: Map<number, Interaction>) => {interactionsForTests = map;}
};

const mockAdapter = new MockAdapter(axios);

describe('useInteractionsTab tests', () => {
    afterEach(() => {
        jest.resetAllMocks()
        mockAdapter.reset();
    });

    describe('getDatesToInvestigate tests:', () => {
        beforeEach(async () => {
            await testHooksFunction(() => {
                useInteractionsTabOutcome = useInteractionsTab(useInteractionsTabInput);
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
