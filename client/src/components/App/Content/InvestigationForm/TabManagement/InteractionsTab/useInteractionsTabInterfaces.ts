import { StartInvestigationDateVariables } from "../../StartInvestigationDateVariables/StartInvestigationDateVariables";

export interface useInteractionsTabOutcome {
    getDatesToInvestigate: (startInvestigationDateVariables: StartInvestigationDateVariables) => Date[];
};