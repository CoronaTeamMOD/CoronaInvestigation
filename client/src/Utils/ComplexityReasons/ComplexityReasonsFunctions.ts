import axios from 'axios';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import { PersonalInfoDbData } from 'models/Contexts/PersonalInfoContextData';
import { setComplexReasonsId } from 'redux/Investigation/investigationActionCreators';

interface DBExposure extends Omit<Exposure, 'exposureAddress'> {
    exposureAddress: string|null;
};

const updateInvestigationReasonId = (epidemiologyNumber: number, newComplexityReasonId: number, complexityReasonsId: (number|null)[]) => {
    const updateInvestigationComplexityReasonIdLogger = logger.setup('updateInvestigationComplexityReasonIdLogger');
    updateInvestigationComplexityReasonIdLogger.info('launching updateInvestigationComplexityReasonIdLogger request', Severity.LOW);
        
    axios.post('/investigationInfo/updateComplexityReason', {
        epidemiologyNumberInput: epidemiologyNumber,
        newComplexityReasonId: newComplexityReasonId})
        .then(() => {
            const currentComplexityReasonsId : (number|null)[] = complexityReasonsId.concat(newComplexityReasonId)
            setComplexReasonsId(currentComplexityReasonsId)
            updateInvestigationComplexityReasonIdLogger.info('updateInvestigationComplexityReasonIdLogger to db successfully', Severity.LOW)
        })
        .catch((err) => {
            updateInvestigationComplexityReasonIdLogger.error(err, Severity.HIGH);
        })
};

const removeInvestigationReasonId = (epidemiologyNumber: number, oldComplexityReasonId: number, complexityReasonsId: (number|null)[]) => {
    const deleteInvestigationComplexityReasonIdLogger = logger.setup('deleteInvestigationComplexityReasonIdLogger');
    deleteInvestigationComplexityReasonIdLogger.info('launching deleteInvestigationComplexityReasonIdLogger request', Severity.LOW);
    axios.post('/investigationInfo/deleteComplexityReason', {
        epidemiologyNumberInput: epidemiologyNumber,
        oldComplexityReasonId: oldComplexityReasonId})
        .then(() => {
            let currentComplexityReasonsId : (number|null)[] = complexityReasonsId
            const index = currentComplexityReasonsId.indexOf(oldComplexityReasonId);
            index > -1 && currentComplexityReasonsId.splice(index, 1);
            setComplexReasonsId(currentComplexityReasonsId)
            deleteInvestigationComplexityReasonIdLogger.info('deleteInvestigationComplexityReasonIdLogger to db successfully', Severity.LOW)
        })
        .catch((err) => {
            deleteInvestigationComplexityReasonIdLogger.error(err, Severity.HIGH);

        })
};

export const checkUpdateInvestigationPersonalReasonId = (personalInfoData: PersonalInfoDbData, epidemiologyNumber: number, complexityReasonsId: (number|null)[]) => {
    if (personalInfoData.insuranceCompany === null || personalInfoData.insuranceCompany === `אף אחד מהנ"ל` && !(complexityReasonsId.includes(6))) {
        updateInvestigationReasonId(epidemiologyNumber, 6, complexityReasonsId);
    }
    if (personalInfoData.role === 4  && !(complexityReasonsId.includes(7))) {
        updateInvestigationReasonId(epidemiologyNumber, 7, complexityReasonsId);
    }
    if (personalInfoData.relevantOccupation === "מערכת החינוך"  && !(complexityReasonsId.includes(8))) {
        updateInvestigationReasonId(epidemiologyNumber, 8, complexityReasonsId);
    }
    if (personalInfoData.relevantOccupation === "מערכת הבריאות"  && !(complexityReasonsId.includes(9))) {
        updateInvestigationReasonId(epidemiologyNumber, 9, complexityReasonsId);
    }

    if (personalInfoData.insuranceCompany !== null && personalInfoData.insuranceCompany !== `אף אחד מהנ"ל` && complexityReasonsId.includes(6)) {
        removeInvestigationReasonId(epidemiologyNumber, 6, complexityReasonsId);
    }
    if (personalInfoData.role !== 4  && complexityReasonsId.includes(7)) {
        removeInvestigationReasonId(epidemiologyNumber, 7, complexityReasonsId);
    }
    if (personalInfoData.relevantOccupation !== "מערכת החינוך"  && complexityReasonsId.includes(8)) {
        removeInvestigationReasonId(epidemiologyNumber, 8, complexityReasonsId);
    }
    if (personalInfoData.relevantOccupation !== "מערכת הבריאות"  && complexityReasonsId.includes(9)) {
        removeInvestigationReasonId(epidemiologyNumber, 9, complexityReasonsId);
    }
};

export const checkUpdateInvestigationExposureReasonId = (filteredExposures: (Exposure | DBExposure)[], epidemiologyNumber: number, complexityReasonsId: (number|null)[]) => {
    if (filteredExposures.length > 0  && !(complexityReasonsId.includes(13))) {
        updateInvestigationReasonId(epidemiologyNumber, 13, complexityReasonsId);
    }
    if (filteredExposures.length == 0  && complexityReasonsId.includes(13)) {
        removeInvestigationReasonId(epidemiologyNumber, 13, complexityReasonsId);
    }
};