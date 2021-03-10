import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import { errorStatusCode, graphqlRequest, validStatusCode } from '../../GraphqlHTTPRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import { GET_INVESTIGATION_DETAILS } from '../../DBService/ComplexityReasons/Query';
import { SET_COMPLEXITY_REASONS_ARRAY } from '../../DBService/ComplexityReasons/Mutation';

const complexityReasonsRoute = Router();

const isBirthDateUnder14 = (birthDate: Date) => {
    if (birthDate === null) { 
        return false
    } else {
        const today = new Date();
        let birthday = new Date(birthDate);
        birthday.setFullYear(birthday.getFullYear() + 14);
        return birthday > today
    }
}

complexityReasonsRoute.get('/investigations', (request: Request, response: Response) => {
    const complexityReasonsLogger = logger.setup({
        workflow: 'set complexity Reasons for all investigations Logger',
        investigation: response.locals.epidemiologynumber,
        user: response.locals.user.id
    });
    complexityReasonsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_INVESTIGATION_DETAILS, response.locals).then((result: any) => {
        complexityReasonsLogger.info(validDBResponseLog, Severity.LOW);
        
        result.data.allInvestigations.nodes.forEach((investigation: any) => {
            if (investigation.investigationStatus != 100000001 && investigation.complexityCode === 1){
                let complexityReasonsArray = []
                const investigatedPatient = investigation.investigatedPatientByInvestigatedPatientId;
                const covidPatient = investigatedPatient.covidPatientByCovidPatient
                if (covidPatient.fullName === null && covidPatient.birthDate === null) {
                    complexityReasonsArray.push(2);
                }
                if (covidPatient.age <= 14 || isBirthDateUnder14(covidPatient.birthDate)) {
                    complexityReasonsArray.push(3);
                }
                if (investigatedPatient.isDeceased === true) {
                    complexityReasonsArray.push(4);
                }
                if (investigatedPatient.isCurrentlyHospitalized === true) {
                    complexityReasonsArray.push(5);
                }
                if (investigatedPatient.hmo === '' || investigatedPatient.hmo === 'אף אחד מהנ"ל') {
                    complexityReasonsArray.push(6);
                }
                if (investigatedPatient.isInClosedInstitution === true) {
                    complexityReasonsArray.push(7);
                }
                if (investigatedPatient.occupation === 'מערכת החינוך') {
                    complexityReasonsArray.push(8);
                }
                if (investigatedPatient.occupation === 'מערכת הבריאות') {
                    complexityReasonsArray.push(9);
                }
                if (investigation.isReturnSick === true) {
                    complexityReasonsArray.push(10);
                }
                if (investigation.isVaccinated === true) {
                    complexityReasonsArray.push(11);
                }
                if (investigation.isSuspicionOfMutation === true) {
                    complexityReasonsArray.push(12);
                }
                if (investigation.exposuresByInvestigationId.nodes.some((node: any) => node.wasAbroad)) {
                    complexityReasonsArray.push(13);
                }
                const parameters = {complexityReasonsIdInput: complexityReasonsArray, epidemiologyNumberInput: investigation.epidemiologyNumber}
                complexityReasonsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
                graphqlRequest(SET_COMPLEXITY_REASONS_ARRAY, response.locals, parameters).then((result: any) => {

                    complexityReasonsLogger.info(validDBResponseLog, Severity.LOW);
                }).catch(error => {

                    complexityReasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                });
            }
        });

        response.send('update was success');
    }).catch(error => {
        complexityReasonsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

export default complexityReasonsRoute;