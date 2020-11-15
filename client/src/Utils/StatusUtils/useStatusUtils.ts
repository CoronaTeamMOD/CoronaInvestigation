import { isBefore } from 'date-fns';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import InvestigatedPatient from 'models/InvestigatedPatient';
import useComplexitySwal from 'commons/InvestigationComplexity/ComplexityUtils/ComplexitySwal';

const useStatusUtils = () => {

    const { complexityErrorAlert } = useComplexitySwal();

    const investigatedPatient = useSelector<StoreStateType, InvestigatedPatient>(state => state.investigation.investigatedPatient);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const investigationEndTime = useSelector<StoreStateType, Date | null>(state => state.investigation.endTime);
    const wasInvestigationReopend = investigationEndTime !== null;

    const updateIsDeceased = (onInvestigationFinish: Function) => {
        if (!investigatedPatient.isDeceased) {
            axios.get('/clinicalDetails/isDeceased/' + investigatedPatient.investigatedPatientId + '/' + true)
                .then((result: any) => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Update isDeceased',
                        step: `launching isDeceased request succssesfully ${result}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    onInvestigationFinish();
                }).catch((error: any) => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Update isDeceased',
                        step: `launching isDeceased request unsuccssesfully ${error}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    complexityErrorAlert(error);
                })
        }
        else {
            onInvestigationFinish();
        }
    }

    const updateIsCurrentlyHospitialized = (onInvestigationFinish: Function) => {
        if (!investigatedPatient.isCurrentlyHospitialized) {
            axios.get('/clinicalDetails/isCurrentlyHospitialized/' + investigatedPatient.investigatedPatientId + '/' + true)
                .then((result: any) => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Update isCurrentlyHospitialized',
                        step: `launching isCurrentlyHospitialized request succssesfully ${result}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    onInvestigationFinish();
                }).catch((error: any) => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Update isCurrentlyHospitialized',
                        step: `launching isCurrentlyHospitialized request unsuccssesfully ${error}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    complexityErrorAlert(error);
                })
        }
        else {
            onInvestigationFinish();
        }
    }

    const shouldDisableContact = (creationTime: Date) => {
        return wasInvestigationReopend && isBefore(new Date(creationTime), new Date(investigationEndTime as Date))
    };

    return {
        updateIsDeceased,
        updateIsCurrentlyHospitialized,
        wasInvestigationReopend,
        shouldDisableContact
    }

};

export default useStatusUtils;