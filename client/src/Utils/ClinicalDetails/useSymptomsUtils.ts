import { SweetAlertResult } from 'sweetalert2';

import theme from 'styles/theme';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export const symptomsWithKnownStartDate: number = 4;
export const nonSymptomaticPatient: number = 7;
export const symptomsWithUnknownStartDate: number = 7;

const useSymptomsUtils = (): useSymptomsUtilsOutCome => {
    const { alertWarning } = useCustomSwal();

    const alertSymptomsDatesChange = () =>
        alertWarning('האם אתה בטוח שתרצה לשנות את שדה התסמינים? שינוי זה יגרום למחיקת האירועים והמגעים הקיימים בימים שימחקו', {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך'
        });

    return { alertSymptomsDatesChange };
}

interface useSymptomsUtilsOutCome {
    alertSymptomsDatesChange: () => Promise<SweetAlertResult>;
}

export default useSymptomsUtils;