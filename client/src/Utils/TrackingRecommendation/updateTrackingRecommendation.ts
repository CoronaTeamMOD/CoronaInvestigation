import axios  from 'axios';
import { useSelector } from 'react-redux';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import TrackingRecommendation from 'models/TrackingRecommendation';

const UdpateTrackingRecommendation = () => {
    const { alertError } = useCustomSwal();
    const trackingRecommendation = useSelector<StoreStateType, TrackingRecommendation>(state => state.investigation.trackingRecommendation);

    const updateTrackingReccomentaion = async () => {
        const updateInvestigationTrackingLogger = logger.setup('Update investigation tracking recommendation');
        updateInvestigationTrackingLogger.info('launching investigation tracking recommendation request' , Severity.LOW);
        await axios.post('/investigationInfo/updateTrackingRecommendation' , trackingRecommendation)
            .then(() => {
                updateInvestigationTrackingLogger.info('update tracking recommendation was successful' , Severity.LOW)
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

export default UdpateTrackingRecommendation;
