import axios from 'axios';
import { useEffect } from 'react';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import FilterRulesVariables from 'models/FilterRulesVariables';
import InvesitgationStatistics from 'models/InvestigationStatistics';

interface Parameters {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setInvestigationsStatistics: React.Dispatch<React.SetStateAction<InvesitgationStatistics>>;
    investigationInfoFilter: FilterRulesVariables;
}

const useAdminLandingPage = (parameters: Parameters) => {

    const { setIsLoading, setInvestigationsStatistics, investigationInfoFilter } = parameters;
    
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

};

export default useAdminLandingPage;