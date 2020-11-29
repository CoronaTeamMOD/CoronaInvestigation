import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';

import logger from 'logger/logger'
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import InvestigationTableRow from 'models/InvestigationTableRow';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal'

import { Reason } from './GroupedInvestigationsForm/useGroupedInvestigationsForm';

export interface GroupForm {
    reason: Reason | null;
    otherReason: string;
}

const useGroupedInvestigations = ({ invetigationsToGroup, onClose }: useGroupedInvestigationsIncome): useGroupedInvestigationsOutcome  => {

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    
    const { alertError } = useCustomSwal();
    
    const onSubmit = (data: GroupForm) => {
        const groupId = uuidv4();
        const groupToCreate = {
            id: groupId,
            reason: data.reason?.id,
            otherReason: data.otherReason
        };
        const groupToCreateLogger = logger.setup({
            workflow: 'create grouped investigations',
            user: userId,
            investigation: epidemiologyNumber
        });
        groupToCreateLogger.info('launching grouped investigations request', Severity.LOW);
        const invetigationsToGroupIds = invetigationsToGroup.map((invetigationToGroup: InvestigationTableRow) => invetigationToGroup.epidemiologyNumber);
        setIsLoading(true);
        axios.post('/groupedInvestigations', { groupToCreate, invetigationsToGroupIds })
        .then(() => {
            setIsLoading(false);
            onClose();
            groupToCreateLogger.info('create grouped investigations successfully', Severity.LOW);
        })
        .catch((err) => {
            groupToCreateLogger.error(`create grouped investigations was failde due to${err}`, Severity.HIGH);
            alertError('לא ניתן היה לקבץ חקירות אלו');
        })
    }

    return {
        onSubmit
    }
}

interface useGroupedInvestigationsIncome {
    invetigationsToGroup: InvestigationTableRow[];
    onClose: () => void;
}

interface useGroupedInvestigationsOutcome {
    onSubmit: (data: GroupForm) => void;
}

export default useGroupedInvestigations;