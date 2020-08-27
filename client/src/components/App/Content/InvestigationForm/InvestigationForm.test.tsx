import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';
import Swal from 'sweetalert2';
import useInvestigationForm from './useInvestigationForm';
import { testHooksFunction } from 'TestHooks';
import swal from 'sweetalert2';
import { act } from 'react-dom/test-utils';
import { wait } from '@testing-library/react';

import theme from 'styles/theme';

let investigationFormOutcome: useInvestigationFormOutcome;

describe('investigationForm tests', () => {
    it('', async () => {

        const myspy = jest.spyOn(swal, 'fire');

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
                title: 'makeStyles-swalTitle-4'
            }
          })
    });

    // it('', async () => {

    //     jest.spyOn(swal, 'fire').mockResolvedValue({
    //         isConfirmed: true,
    //         isDismissed: false,
    //         value: true
    //     });

    //     await act(async () => {
    //         await testHooksFunction(() => {
    //             investigationFormOutcome = useInvestigationForm();
    //             investigationFormOutcome.handleInvestigationFinish = jest.fn();
    //         });
    //     });

    //     await act(async () => {
    //         await investigationFormOutcome.confirmFinishInvestigation();
    //     });
    //     jest.runAllTimers();
    //     expect(investigationFormOutcome.handleInvestigationFinish).toHaveBeenCalled();
    // });
});
