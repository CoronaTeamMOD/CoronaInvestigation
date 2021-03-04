import axios from 'axios';

import { PersonalInfoDbData } from 'models/Contexts/PersonalInfoContextData';
import { Exposure } from 'commons/Contexts/ExposuresAndFlights';
import logger from 'logger/logger';
import { Severity } from 'models/Logger';

interface DBExposure extends Omit<Exposure, 'exposureAddress'> {
    exposureAddress: string|null;
}

const updateInvestigationReasonId = (epidemiologyNumber: number, newComplexityReasonId: number) => {
    const updateInvestigationComplexityReasonIdLogger = logger.setup('updateInvestigationComplexityReasonIdLogger');
    updateInvestigationComplexityReasonIdLogger.info('launching updateInvestigationComplexityReasonIdLogger request', Severity.LOW);
        
    axios.post('/investigationInfo/updateComplexityReason', {
        epidemiologyNumberInput: epidemiologyNumber,
        newComplexityReasonId: newComplexityReasonId})
        .then(() => {
            updateInvestigationComplexityReasonIdLogger.info('updateInvestigationComplexityReasonIdLogger to db successfully', Severity.LOW)
        })
        .catch((err) => {
            updateInvestigationComplexityReasonIdLogger.error(err, Severity.HIGH);
        })
}

const removeInvestigationReasonId = (epidemiologyNumber: number, oldComplexityReasonId: number) => {
    const deleteInvestigationComplexityReasonIdLogger = logger.setup('deleteInvestigationComplexityReasonIdLogger');
    deleteInvestigationComplexityReasonIdLogger.info('launching deleteInvestigationComplexityReasonIdLogger request', Severity.LOW);
    axios.post('/investigationInfo/deleteComplexityReason', {
        epidemiologyNumberInput: epidemiologyNumber,
        oldComplexityReasonId: oldComplexityReasonId})
        .then(() => {
            deleteInvestigationComplexityReasonIdLogger.info('deleteInvestigationComplexityReasonIdLogger to db successfully', Severity.LOW)
        })
        .catch((err) => {
            deleteInvestigationComplexityReasonIdLogger.error(err, Severity.HIGH);

        })
}

export const checkUpdateInvestigationPersonalReasonId = (personalInfoData: PersonalInfoDbData, epidemiologyNumber: number, complexityReasonsId: (number|null)[]) => {
    if (personalInfoData.insuranceCompany === null || personalInfoData.insuranceCompany === `אף אחד מהנ"ל` && !(complexityReasonsId.includes(6))) {
        updateInvestigationReasonId(epidemiologyNumber, 6);
    }
    if (personalInfoData.institutionName !== ''  && !(complexityReasonsId.includes(7))) {
        updateInvestigationReasonId(epidemiologyNumber, 7);
    }
    if (personalInfoData.relevantOccupation === "מערכת החינוך"  && !(complexityReasonsId.includes(8))) {
        updateInvestigationReasonId(epidemiologyNumber, 8);
    }
    if (personalInfoData.relevantOccupation === "מערכת הבריאות"  && !(complexityReasonsId.includes(9))) {
        updateInvestigationReasonId(epidemiologyNumber, 9);
    }

    if (personalInfoData.insuranceCompany !== null && personalInfoData.insuranceCompany !== `אף אחד מהנ"ל` && complexityReasonsId.includes(6)) {
        removeInvestigationReasonId(epidemiologyNumber, 6);
    }
    if (personalInfoData.institutionName == ''  && complexityReasonsId.includes(7)) {
        removeInvestigationReasonId(epidemiologyNumber, 7);
    }
    if (personalInfoData.relevantOccupation !== "מערכת החינוך"  && complexityReasonsId.includes(8)) {
        removeInvestigationReasonId(epidemiologyNumber, 8);
    }
    if (personalInfoData.relevantOccupation !== "מערכת הבריאות"  && complexityReasonsId.includes(9)) {
        removeInvestigationReasonId(epidemiologyNumber, 9);
    }
}

export const checkUpdateInvestigationExposureReasonId = (filteredExposures: (Exposure | DBExposure)[], epidemiologyNumber: number, complexityReasonsId: (number|null)[]) => {
    if (filteredExposures.length > 0  && !(complexityReasonsId.includes(13))) {
        updateInvestigationReasonId(epidemiologyNumber, 13)
    }
    if (filteredExposures.length == 0  && complexityReasonsId.includes(13)) {
        removeInvestigationReasonId(epidemiologyNumber, 13)
    }
}