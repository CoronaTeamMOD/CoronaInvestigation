import axios  from 'axios';
import { useSelector } from 'react-redux';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import TrackingReccomendation from 'models/TrackingReccomendation';

const UdpateTrackingReccomendation = () => {
    const { alertError } = useCustomSwal();
    const trackingReccomendation = useSelector<StoreStateType, TrackingReccomendation>(state => state.investigation.trackingReccomendation);

    const updateTrackingReccomentaion = async () => {
        const updateInvestigationTrackingLogger = logger.setup('Update investigation tracking reccomendation');
        updateInvestigationTrackingLogger.info('launching investigation tracking reccomendation request' , Severity.LOW);
        await axios.post('/investigationInfo/updateTrackingReccomentaion' , trackingReccomendation)
            .then(() => {
                updateInvestigationTrackingLogger.info('update tracking reccomendation was successful' , Severity.LOW)
            })
            .catch((error) => {
                updateInvestigationTrackingLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                alertError('לא היה ניתן לעדכן את סיבת האיכון');
            });
    }

    return {
        updateTrackingReccomentaion
    }
}

export default UdpateTrackingReccomendation;
