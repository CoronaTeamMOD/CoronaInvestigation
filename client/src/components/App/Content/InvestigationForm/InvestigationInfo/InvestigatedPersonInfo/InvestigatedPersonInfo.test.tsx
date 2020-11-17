import Swal from 'sweetalert2';
import theme from 'styles/theme';
import * as redux from 'react-redux'
import {act} from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import {testHooksFunction} from 'TestHooks';

import axios from 'Utils/axios';

import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';
import {InvestigatedPersonInfoOutcome} from './InvestigatedPersonInfoInterfaces';
import {useSelector} from "react-redux";

jest.mock('redux/store', () => {
    return {
        store: {
            getState: () => ({user: {token: 1}}),
        }
    }
})

jest.mock('redux/store', () => {
    middlewares: []
});

const spy = jest.spyOn(redux, 'useSelector');
spy.mockReturnValue({});

jest.mock('redux/IsLoading/isLoadingActionCreators', () => {
    return {setIsLoading: (isLoading: boolean) => jest.fn()}
})

const mockAdapter = new MockAdapter(axios);

let investigatedPersonInfoOutcome: InvestigatedPersonInfoOutcome;

describe('investigatedPersonInfo tests', () => {
    afterEach(() => {
        jest.resetAllMocks();
        mockAdapter.reset();
    });

    describe('confirmExitUnfinishedInvestigation tests', () => {
        beforeEach(() => {
            const ActualReactRedux = require.requireActual('react-redux');
            return {
                ...ActualReactRedux,
                useSelector: jest.fn().mockImplementation(() => {
                    return {
                        statuses: ['', '', ''],
                        subStatuses: ['', '', ''],
                        investigation: {
                            epidemiologyNumber: -1,
                            cantReachInvestigated: false,
                            investigatedPatientId: -1,
                            creator: '',
                            lastUpdator: '',
                            investigationStatus: {
                                mainStatus: 'בטיפול',
                                subStatus: '',
                                statusReason: '',
                            },
                        },
                    };
                }),
            };
        });

        beforeEach(async () => {
            await testHooksFunction(() => {
                investigatedPersonInfoOutcome = useInvestigatedPersonInfo();
                mockAdapter.onPost('/investigationInfo/updateInvestigationStatus').reply(200);
            });
        });
        const epidemiologyNumber = 111;
        const cantReachInvestigated = false;

        const expectedFirstSwal = {
            icon: 'warning',
            title: 'האם אתה בטוח שתרצה לצאת מהחקירה ולחזור אליה מאוחר יותר?',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                content: "makeStyles-swalText-17",
                title: "makeStyles-swalTitle-16",
                container: "makeStyles-container-15",
            }
        };

        const expectedNoStatusSwal = {
            icon: 'warning',
            title: "שים לב, כדי לצאת מחקירה יש להזין סטטוס חקירה וסטטוס משנה תקינים",
            confirmButtonColor: "rgb(44, 151, 185)",
            confirmButtonText: "הבנתי, המשך",
            customClass: {
                container: "makeStyles-container-1",
                content: "makeStyles-swalText-3",
                title: "makeStyles-swalTitle-2",
            }

        }

        const expectedSecondSwal = {
            icon: 'success',
            title: 'בחרת לצאת מהחקירה לפני השלמתה! הנך מועבר לעמוד הנחיתה',
            customClass: {
                title: 'makeStyles-swalTitle-9'
            },
            timer: 1750,
            showConfirmButton: false
        };

        it('check that swal was opened', async () => {
            const myspy = jest.spyOn(Swal, 'fire');
            await act(async () => {
                await testHooksFunction(() => {
                    investigatedPersonInfoOutcome = useInvestigatedPersonInfo();
                });
                investigatedPersonInfoOutcome.confirmExitUnfinishedInvestigation(epidemiologyNumber);
            });

            expect(myspy).toHaveBeenCalled();
            expect(myspy).toHaveBeenCalledWith(expectedNoStatusSwal);
        });

        // it('Check that second swal was opened on acception', async () => {
        //     jest.spyOn(Swal, 'fire').mockResolvedValueOnce({
        //         isConfirmed: true,
        //         isDismissed: false,
        //         value: true
        //     });
        //     mockAdapter.onPost('/investigationInfo/updateInvestigationStatus').replyOnce(200);
        //     const myspy = jest.spyOn(Swal, 'fire').mockResolvedValue({
        //         isConfirmed: false,
        //         isDismissed: false,
        //         value: false
        //     });

        //     await act(async () => {
        //         await testHooksFunctionWithRoute(() => {
        //             investigatedPersonInfoOutcome = useInvestigatedPersonInfo();
        //         });
        //         await investigatedPersonInfoOutcome
        //             .confirmExitUnfinishedInvestigation(epidemiologyNumber);
        //         await wait();
        //     });

        //     expect(myspy).toHaveBeenCalled();
        //     expect(myspy).toHaveBeenCalledWith(expectedSecondSwal);
        // });

        // it('Check that second swal was not opened on cancelation', async () => {
        //     jest.spyOn(Swal, 'fire').mockResolvedValue({
        //         isConfirmed: false,
        //         isDismissed: true,
        //         value: false
        //     });

        //     const myspy = jest.spyOn(Swal, 'fire');

        //     await act(async () => {
        //         await testHooksFunction(() => {
        //             investigatedPersonInfoOutcome = useInvestigatedPersonInfo();
        //         });
        //         await investigatedPersonInfoOutcome
        //             .confirmExitUnfinishedInvestigation(epidemiologyNumber);
        //     });

        //     expect(myspy).toHaveBeenCalled();
        //     expect(myspy).not.toHaveBeenCalledWith(expectedSecondSwal)
        // });
    });
});