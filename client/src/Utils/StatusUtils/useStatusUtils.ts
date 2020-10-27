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

    const updateIsDeceased = (onInvestigationFinish: Function) => {
        if (!investigatedPatient.isDeceased) {
            axios.post('/clinicalDetails/isDeceased/' + investigatedPatient.investigatedPatientId + '/' + true)
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
            axios.post('/clinicalDetails/isCurrentlyHospitialized/' + investigatedPatient.investigatedPatientId + '/' + true)
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

    return {
        updateIsDeceased,
        updateIsCurrentlyHospitialized
    }

};

export default useStatusUtils;