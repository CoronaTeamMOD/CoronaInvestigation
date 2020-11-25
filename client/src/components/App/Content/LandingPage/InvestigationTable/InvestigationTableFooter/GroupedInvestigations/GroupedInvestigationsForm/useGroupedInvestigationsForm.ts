import axios from 'axios';
import { useSelector } from 'react-redux';

import logger from 'logger/logger'
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';

export interface Reason {
    id: number,
    displayName: string
}

const useGroupedInvestigationsForm = ({ setReasons }: useGroupedInvestigationsFormIncome): useGroupedInvestigationsFormOutCome => {

    const { alertError } = useCustomSwal();

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const fetchReasons = () => {
        const reasonsLogger = logger.setup({
            workflow: 'Fetching reasons for grouped investigations',
            user: userId,
            investigation: epidemiologyNumber
        });
        reasonsLogger.info('launching reasons request', Severity.LOW);
        axios.get('/investigationInfo/groupedInvestigations/reasons')
            .then((result: any) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    setReasons(result.data);
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

interface useGroupedInvestigationsFormOutCome {
    fetchReasons: () => void;
}

export default useGroupedInvestigationsForm;