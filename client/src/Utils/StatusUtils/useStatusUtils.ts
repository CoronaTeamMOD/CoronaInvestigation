import { isBefore } from 'date-fns';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import InvestigatedPatient from 'models/InvestigatedPatient';
import useComplexitySwal from 'commons/InvestigationComplexity/ComplexityUtils/ComplexitySwal';

const useStatusUtils = () => {

    const { complexityErrorAlert } = useComplexitySwal();

    const investigatedPatient = useSelector<StoreStateType, InvestigatedPatient>(state => state.investigation.investigatedPatient);
    const investigationEndTime = useSelector<StoreStateType, Date | null>(state => state.investigation.endTime);
    const wasInvestigationReopend = investigationEndTime !== null;

    const updateIsDeceased = (onInvestigationFinish: Function) => {
        const updateIsDeceasedLogger = logger.setup('Update isDeceased');
        if (!investigatedPatient.isDeceased) {
            axios.get('/clinicalDetails/isDeceased/' + investigatedPatient.investigatedPatientId + '/' + true)
                .then((result: any) => {
                    updateIsDeceasedLogger.info(`launching isDeceased request succssesfully ${result}`, Severity.LOW);
                    onInvestigationFinish();
                }).catch((error: any) => {
                    updateIsDeceasedLogger.error(`launching isDeceased request unsuccssesfully ${error}`, Severity.HIGH);
                    complexityErrorAlert(error);
                })
        }
        else {
            onInvestigationFinish();
        }
    }

    const updateIsCurrentlyHospitialized = (onInvestigationFinish: Function) => {
        const updateIsCurrentlyHospitializedLogger = logger.setup('Update isCurrentlyHospitialized');
        if (!investigatedPatient.isCurrentlyHospitialized) {
            axios.get('/clinicalDetails/isCurrentlyHospitialized/' + investigatedPatient.investigatedPatientId + '/' + true)
                .then((result: any) => {
                    updateIsCurrentlyHospitializedLogger.info(`launching isCurrentlyHospitialized request succssesfully ${result}`, Severity.LOW);
                    onInvestigationFinish();
                }).catch((error: any) => {
                    updateIsCurrentlyHospitializedLogger.error(`launching isCurrentlyHospitialized request unsuccssesfully ${error}`, Severity.HIGH);
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