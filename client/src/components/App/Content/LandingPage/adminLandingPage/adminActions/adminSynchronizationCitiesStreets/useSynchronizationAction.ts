import axios  from 'axios';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const useSynchronizationAction = (props: Props) => {
    let numberOfFailuresCities = 1;
    let numberOfFailuresStreets = 1;
    const { alertError, alertSuccess } = useCustomSwal();

    const failedCityUpdateEmailParameters = { 
        from: 'moh.automatic.mail@gmail.com',
        to: 'chenfr@matrixdna.ai, Rut.shpitzer@moh.gov.il',
        subject: 'יצירת קובץ ערים נכשלה',
        text: 'יצירת קובץ ערים נכשלה'
    }

    const failedStreetUpdateEmailParameters = { 
        from: 'moh.automatic.mail@gmail.com',
        to: 'chenfr@matrixdna.ai, Rut.shpitzer@moh.gov.il',
        subject: 'יצירת קובץ רחובות נכשלה',
        text: 'יצירת קובץ רחובות נכשלה'
    }
    
    const synchronizationCities = () : Promise<any> => {
        const synchronizationCitiesLogger = logger.setup('synchronizationCities');
        synchronizationCitiesLogger.info('send request to server for synchronizationCities', Severity.LOW);
        setIsLoading(true);

        return axios.post('/synchronization/cities', {
        }).then((result) => {
            if (result.data) {
                alertSuccess('סנכרון הערים הסתיים בהצלחה')
                synchronizationCitiesLogger.info('City synchronization performed successfully', Severity.LOW);
            }
        }).catch((error) => {
            alertError('חלה שגיאה בסנכרון הערים');
            synchronizationCitiesLogger.error(`error in City synchronization: ${error}`, Severity.HIGH);
            if (numberOfFailuresCities === 3) {
                sendEmail(failedCityUpdateEmailParameters)
                numberOfFailuresCities = 1
            } else { numberOfFailuresCities++ } 
        })
        .finally(() => setIsLoading(false));
    };

    const sendEmail = (requestData:any) :any => {
        const sendEmailLogger = logger.setup('send email');
        sendEmailLogger.info('send request to server for send email', Severity.LOW);
        return axios.post('/email/sendEmail/', requestData);
    }

    const synchronizationstreets = () : Promise<any> => {
        const synchronizationStreetsLogger = logger.setup('synchronizationStreets');
        synchronizationStreetsLogger.info('send request to server for synchronizationStreets', Severity.LOW);
        setIsLoading(true);

        return axios.post('/synchronization/streets', {
        }).then((result) => {
            if (result.data) {
                alertSuccess('סנכרון הרחובות הסתיים בהצלחה')
                synchronizationStreetsLogger.info('Street synchronization performed successfully', Severity.LOW);
            }
        }).catch((error) => {
            alertError('חלה שגיאה בסנכרון הרחובות');
            synchronizationStreetsLogger.error(`error in Street synchronization: ${error}`, Severity.HIGH);
            if (numberOfFailuresStreets === 3) {
                sendEmail(failedStreetUpdateEmailParameters)
                numberOfFailuresStreets = 1
            } else { numberOfFailuresStreets++ } 
        })
        .finally(() => setIsLoading(false));
    };

    return {
        synchronizationCities,
        synchronizationstreets
    };
};

interface Props {};

export default useSynchronizationAction;