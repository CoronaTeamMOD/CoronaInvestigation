import Swal from 'sweetalert2';
import theme from 'styles/theme';
import { act } from 'react-dom/test-utils';
import { testHooksFunction } from 'TestHooks';

import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';
import { InvestigatedPersonInfoOutcome } from './InvestigatedPersonInfoInterfaces';

let investigatedPersonInfoOutcome: InvestigatedPersonInfoOutcome;

describe('investigatedPersonInfo tests', () => {
    afterEach(() => jest.resetAllMocks());

    const expectedFirstSwal = {
        icon: 'warning',
        title: 'האם אתה בטוח שתרצה לצאת מהחקירה ולחזור אליה מאוחר יותר?',
        showCancelButton: true,
        cancelButtonText: 'בטל',
        cancelButtonColor: theme.palette.error.main,
        confirmButtonColor: theme.palette.primary.main,
        confirmButtonText: 'כן, המשך',
        customClass: {
            title: 'makeStyles-swalTitle-9'
        }
    };

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
            investigatedPersonInfoOutcome.confirmExitUnfinishedInvestigation();
        });

        expect(myspy).toHaveBeenCalled();
        expect(myspy).toHaveBeenCalledWith(expectedFirstSwal);
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
                investigatedPersonInfoOutcome = useInvestigatedPersonInfo();
            });
            await investigatedPersonInfoOutcome.confirmExitUnfinishedInvestigation();
        });

        expect(myspy).toHaveBeenCalled();
        expect(myspy).toHaveBeenCalledWith(expectedSecondSwal);
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
                investigatedPersonInfoOutcome = useInvestigatedPersonInfo();
            });
            await investigatedPersonInfoOutcome.confirmExitUnfinishedInvestigation();
        });

        expect(myspy).toHaveBeenCalled();
        expect(myspy).not.toHaveBeenCalledWith(expectedSecondSwal)
    });
});
