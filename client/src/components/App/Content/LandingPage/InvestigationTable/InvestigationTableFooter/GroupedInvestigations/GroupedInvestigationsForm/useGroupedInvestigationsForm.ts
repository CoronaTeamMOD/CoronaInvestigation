import axios from 'axios';

import logger from 'logger/logger'
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export interface Reason {
    id: number,
    displayName: string
}

const useGroupedInvestigationsForm = ({ setReasons }: useGroupedInvestigationsFormIncome): useGroupedInvestigationsFormOutcome => {

    const { alertError } = useCustomSwal();

    const fetchReasons = () => {
        const reasonsLogger = logger.setup('Fetching reasons for grouped investigations');
        reasonsLogger.info('launching reasons request', Severity.LOW);
        axios.get('/groupedInvestigations/reasons')
            .then((result: any) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setReasons(result.data.nodes);
                    reasonsLogger.info('got results back from the server', Severity.LOW);
                }
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל סיבות');
                reasonsLogger.error('didnt get results back from the server', Severity.HIGH);
            });   
    }

    return {
        fetchReasons
    }
}

interface useGroupedInvestigationsFormIncome {
    setReasons: React.Dispatch<React.SetStateAction<Reason[]>>
}

interface useGroupedInvestigationsFormOutcome {
    fetchReasons: () => void;
}

export default useGroupedInvestigationsForm;