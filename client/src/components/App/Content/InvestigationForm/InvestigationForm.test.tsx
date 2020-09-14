import Swal from 'sweetalert2';
import * as redux from 'react-redux'
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { testHooksFunction } from 'TestHooks';

import axios from 'Utils/axios';
import theme from 'styles/theme';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import { ClinicalDetailsDataAndSet, initialAddress } from 'commons/Contexts/ClinicalDetailsContext';

import { LAST_TAB_ID } from './InvestigationForm';
import useInvestigationForm from './useInvestigationForm';
import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';

const spy = jest.spyOn(redux, 'useSelector');
spy.mockReturnValue({});

const mockAdapter = new MockAdapter(axios);

let investigationFormOutcome: useInvestigationFormOutcome;

describe('investigationForm tests', () => {
    afterEach(() => {
        jest.resetAllMocks();
        mockAdapter.reset();
    });

    beforeEach(() => {
      mockAdapter.onGet("/addressDetails/cities").reply(200);
      mockAdapter.onGet("/personalDetails/updatePersonalDetails").reply(200);
      mockAdapter.onGet("/addressDetails/countries").reply(200);
    });

    const initialClinicalDetails: ClinicalDetailsData = {
        isolationStartDate: null,
        isolationEndDate: null,
        isolationAddress: initialAddress,
        isInIsolation: false,
        isIsolationProblem: false,
        isIsolationProblemMoreInfo: '',
        symptomsStartDate: null,
        symptoms: [''],
        backgroundDeseases: [''],
        hospital: '',
        hospitalizationStartDate: null,
        hospitalizationEndDate: null,
        doesHaveSymptoms: false,
        wasHospitalized: false,
        isPregnant: false,
        doesHaveBackgroundDiseases: false
    };
    
    const clinicalDetailsVariables: ClinicalDetailsDataAndSet = {
        clinicalDetailsData: initialClinicalDetails,
        setClinicalDetailsData: () => {}
    };

    const initialPersonalInfo: personalInfoContextData = {
        phoneNumber: '',
        additionalPhoneNumber: '',
        contactPhoneNumber: '',
        insuranceCompany: '',
        address: {
            city: '',
            street: '',
            floor: '',
            houseNum: ''
        },
        relevantOccupation: '',
        educationOccupationCity: '',
        institutionName: '',
        otherOccupationExtraInfo: ''
    };

    const initialSetPersonalInfoData : React.Dispatch<React.SetStateAction<personalInfoContextData>> = () => {};

    describe('tabs tests', () => {

        beforeEach(() => {
            jest.mock('react-redux', () => {
                const ActualReactRedux = require.requireActual('react-redux');
                return {
                    ...ActualReactRedux,
                    useSelector: jest.fn().mockImplementation(() => {
                        return { 
                            epidemiologyNumber: -1,
                            cantReachInvestigated: false,
                            investigatedPatientId: -1,
                            creator: '',
                            lastUpdator: '',
                        };
                    }),
                };
            });
        });


        it('isLastTab should be false when hook is initialized', async () => {
            await testHooksFunction(() => {
                investigationFormOutcome = useInvestigationForm({ clinicalDetailsVariables: clinicalDetailsVariables, personalInfoData: initialPersonalInfo, setPersonalInfoData: initialSetPersonalInfoData });
            });
            expect(investigationFormOutcome.currentTab.id === LAST_TAB_ID).toBeFalsy();
        });
    })

    describe('confirmExitUnfinishedInvestigation tests', () => {
        beforeEach(async () => {
            await testHooksFunction(() => {
                investigationFormOutcome = useInvestigationForm({ clinicalDetailsVariables: clinicalDetailsVariables, personalInfoData: initialPersonalInfo, setPersonalInfoData: initialSetPersonalInfoData });
            });
        })

        const epidemiologyNumber = 111;

        const expectedFirstSwal = {
            icon: 'warning',
            title: 'האם אתה בטוח שאתה רוצה לסיים ולשמור את החקירה?',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: 'makeStyles-swalTitle-4'
            }
        };

        const expectedSecondSwal = {
            icon: 'success',
            title: 'החקירה הסתיימה! הנך מועבר לעמוד הנחיתה',
            customClass: {
                title: 'makeStyles-swalTitle-4'
            },
            timer: 1750,
            showConfirmButton: false
        };

        it('Check that second swal was opened on acception', async () => {
            jest.spyOn(Swal, 'fire').mockResolvedValue({
                isConfirmed: true,
                isDismissed: false,
                value: true
            });

            const myspy = jest.spyOn(Swal, 'fire');

            await act(async () => {
                await investigationFormOutcome.confirmFinishInvestigation(epidemiologyNumber);
                mockAdapter.onPost('/investigationInfo/updateInvestigationStatus').reply(200);
            });

            expect(myspy).toHaveBeenCalled();
            expect(myspy).toHaveBeenCalledWith(expectedFirstSwal);
        });
        
        it('Check that second swal was not opened on cancelation', async () => {
            jest.spyOn(Swal, 'fire').mockResolvedValue({
                isConfirmed: false,
                isDismissed: true,
                value: false
            });

            const myspy = jest.spyOn(Swal, 'fire');

            await act(async () => {
                await testHooksFunction(() => {
                    investigationFormOutcome.handleInvestigationFinish = jest.fn();
                });
            });

            await act(async () => {
                await investigationFormOutcome.confirmFinishInvestigation(epidemiologyNumber);
            });

            expect(myspy).toHaveBeenCalled();
            expect(myspy).not.toHaveBeenCalledWith(expectedSecondSwal)
        });
    });
});