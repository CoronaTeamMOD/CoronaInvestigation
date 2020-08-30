import React from 'react';
import { mount } from 'enzyme';
import Swal from 'sweetalert2';
import theme from 'styles/theme';
import { act } from 'react-dom/test-utils';
import { Button } from '@material-ui/core';
import { testHooksFunction } from 'TestHooks';

import InvestigationForm from './InvestigationForm';
import useInvestigationForm from './useInvestigationForm';
import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';

let investigationFormOutcome: useInvestigationFormOutcome;
const finishInvestigationButtonClass: string = 'finishInvestigationButton';

describe('investigationForm tests', () => {
    afterEach(() => jest.resetAllMocks());

    it('check that swal was opened', async () => {

        const myspy = jest.spyOn(Swal, 'fire');

        await act(async () => {
            await testHooksFunction(() => {
                investigationFormOutcome = useInvestigationForm();
            });
        });

        await act(async () => {
            investigationFormOutcome.confirmFinishInvestigation();
        });

        expect(myspy).toHaveBeenCalled();
        expect(myspy).toHaveBeenCalledWith({
            icon: 'warning',
            title: 'האם אתה בטוח שאתה רוצה לסיים ולשמור את החקירה?',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: 'makeStyles-swalTitle-5'
            }
          });
    });

    it('Check that second swal was opened on acception', async () => {
        jest.spyOn(Swal, 'fire').mockResolvedValue({
            isConfirmed: true,
            isDismissed: false,
            value: true
        });

        const myspy = jest.spyOn(Swal, 'fire');

        await act(async () => {
            await testHooksFunction(() => {
                investigationFormOutcome = useInvestigationForm();
            });
        });

        await act(async () => {
            await investigationFormOutcome.confirmFinishInvestigation();
        });

        expect(myspy).toHaveBeenCalled();
        expect(myspy).toHaveBeenCalledWith({
            icon: 'success',
            title: 'החקירה הסתיימה! הנך מועבר לעמוד הנחיתה',
            customClass: {
                title: 'makeStyles-swalTitle-5'
            },
            timer: 1750,
            showConfirmButton: false
          });
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
                investigationFormOutcome = useInvestigationForm();
                investigationFormOutcome.handleInvestigationFinish = jest.fn();
            });
        });

        await act(async () => {
            await investigationFormOutcome.confirmFinishInvestigation();
        });

        expect(myspy).toHaveBeenCalled();
        expect(myspy).not.toHaveBeenCalledWith({
            icon: 'success',
            title: 'החקירה הסתיימה! הנך מועבר לעמוד הנחיתה',
            customClass: {
                title: 'makeStyles-swalTitle-4'
            },
            timer: 1750,
            showConfirmButton: false
          })
    });
    it('isLastTab should be false when hook is initialized', async () => {
        await testHooksFunction(() => {
            investigationFormOutcome = useInvestigationForm();
        });
        expect(investigationFormOutcome.isLastTab).toBeFalsy();
    });
    it('continuing to the next tab should not change the button text', async () => {
        const wrapper = mount(<InvestigationForm />);
        wrapper
            .find(Button)
            .simulate('click');
        await act(() => {
            wrapper.update();
        });
        expect(wrapper.find(Button).text()).toEqual('המשך לשלב הבא');
    });
    it('going to the last tab should change the button text', async () => {
        const wrapper = mount(<InvestigationForm />);
        wrapper
            .find(Button)
            .simulate('click');
        wrapper
            .find(Button)
            .simulate('click');
        wrapper
            .find(Button)
            .simulate('click');
        await act(() => {
            wrapper.update();
        });
        expect(wrapper.find(Button).text()).toEqual('סיים חקירה');
    });
});