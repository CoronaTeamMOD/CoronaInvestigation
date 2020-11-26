import { SweetAlertResult } from 'sweetalert2';

import theme from 'styles/theme';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import React from "react";

const useSymptomsFields = (): useSymptomsFieldsOutCome => {
    const { alertWarning } = useCustomSwal();

    const handleSymptomsDateDataChange = () => {
        return alertWarning('האם אתה בטוח שתרצה לשנות את שדה התסמינים? שינוי זה יגרום למחיקת האירועים והמגעים הקיימים בימים שימחקו', {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך'
        });
    }

    return { handleSymptomsDateDataChange };
}

interface useSymptomsFieldsOutCome {
    handleSymptomsDateDataChange: () => Promise<SweetAlertResult>;
}

export default useSymptomsFields;