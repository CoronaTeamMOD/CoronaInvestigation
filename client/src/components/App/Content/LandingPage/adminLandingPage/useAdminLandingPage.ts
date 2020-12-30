import axios from 'axios';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import { landingPageRoute } from 'Utils/Routes/Routes';
import FilterRulesVariables from 'models/FilterRulesVariables';
import InvesitgationStatistics from 'models/InvestigationStatistics';
interface Parameters {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setInvestigationsStatistics: React.Dispatch<React.SetStateAction<InvesitgationStatistics>>;
    investigationInfoFilter: FilterRulesVariables;
}

const useAdminLandingPage = (parameters: Parameters) => {

    const { setIsLoading, setInvestigationsStatistics, investigationInfoFilter } = parameters;
    
    const history = useHistory();
    
    useEffect(() => {
        const unallocatedCountLogger = logger.setup('query investigation statistics');
        unallocatedCountLogger.info('launching db request', Severity.LOW);
        setIsLoading(true);
        axios.post<InvesitgationStatistics>('/landingPage/investigationStatistics', investigationInfoFilter)
        .then((response) => {
            unallocatedCountLogger.info('launching db request', Severity.LOW);
            setInvestigationsStatistics(response.data);
        })
        .catch(error => {
            unallocatedCountLogger.error(`got error ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    }, [investigationInfoFilter])

    // A function whenever there is a need to redirect to the investigation table
    const redirectToInvestigationTable = (investigationInfoFilter: FilterRulesVariables) => {
        // append with desk/time filter when done
        // P.S: when finishing the time filter make sure 
        //      that the history in useInvestigationTable.ts is expecting to recive it
        // Good Luck! 😁 R.R
        history.push(landingPageRoute, {...investigationInfoFilter, isAdminLandingRedirect: true});
    };

    return {
        redirectToInvestigationTable
    }

};

export default useAdminLandingPage;