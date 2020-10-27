import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

const useComplexitySwal = () => {

    const { alertError } = useCustomSwal();
    
    const complexityErrorAlert = (error: any) => {
        if (error?.response?.data?.message && error.response.data.message.includes('complexity')) {
            alertError(
                'לא הצלחנו לחשב את מורכבות החקירה מחדש',
                'שים לב לשדות סטטוסים, גורם מאבטח ותחום עיסוק',
            );

        } else {
            alertError(
                'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות'
            );
        }
    }

    return {
        complexityErrorAlert
    }

};

export default useComplexitySwal;