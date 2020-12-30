import axios from 'axios';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import { landingPageRoute } from 'Utils/Routes/Routes';
import FilterRulesVariables from 'models/FilterRulesVariables';
import AdminLandingPageFilters from './AdminLandingPageFilters';
import InvesitgationStatistics from 'models/InvestigationStatistics';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';
import { HistoryState } from '../InvestigationTable/InvestigationTableInterfaces';
interface Parameters {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<AdminLandingPageFilters>>
    setInvestigationsStatistics: React.Dispatch<React.SetStateAction<InvesitgationStatistics>>;
    investigationInfoFilter: AdminLandingPageFilters;
    filteredDesks: number[]
    setFilteredDesks:  React.Dispatch<React.SetStateAction<number[]>>;
}

const useAdminLandingPage = (parameters: Parameters) => {

    const { setIsLoading, setInvestigationsStatistics, investigationInfoFilter , filteredDesks , setFilteredDesks , setInvestigationInfoFilter} = parameters;
    
    const history = useHistory<HistoryState>();

    useEffect(() => {
        const { location: { state } } = history;
        const {deskFilter} = state;
        if(deskFilter) {
            setFilteredDesks(deskFilter)
            
            if(deskFilter.length > 0) {
                setInvestigationInfoFilter({
                    deskId : { in : deskFilter}
                })
            } else {
                setInvestigationInfoFilter({})
            }
        }
    }, [])
    
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

    const redirectToInvestigationTable = (investigationInfoFilter: FilterRulesVariables, filterType?: FilterRulesDescription) => {
        const filterTitle = filterType ? `חקירות ${filterType}` : undefined;
        history.push(landingPageRoute, {...investigationInfoFilter, isAdminLandingRedirect: true, deskFilter : filteredDesks});
    };

    return {
        redirectToInvestigationTable
    }

};

export default useAdminLandingPage;