import React from 'react';
import axios from 'axios';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';

const UseTrackingReccomendationForm = (props: Props) => {
    const fetchSubReasonsByReason = async (reasonId : number) => {
        const subReasonsByReasonLogger = logger.setup('getting sub reasons by reason');
        const subReasons = await axios.get(`/investigationInfo/trackingSubReasons/${reasonId}`)
            .then((result) => {
                subReasonsByReasonLogger.info('got results back from the server', Severity.LOW)
                return result.data
            })
            .catch((e) => {
                subReasonsByReasonLogger.error(`got error from the server, ${e}`, Severity.HIGH)
            })
        return subReasons
    }
    
    return {
        fetchSubReasonsByReason
    }
}
    
interface Props {
        
}
    
export default UseTrackingReccomendationForm
