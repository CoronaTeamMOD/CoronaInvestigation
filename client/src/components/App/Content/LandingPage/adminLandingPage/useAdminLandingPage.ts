import axios from 'axios';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import { landingPageRoute } from 'Utils/Routes/Routes';
import { defaultTimeRange } from 'models/enums/timeRanges'
import { TimeRange, TimeRangeDates } from 'models/TimeRange';
import FilterRulesVariables from 'models/FilterRulesVariables';
import InvesitgationStatistics from 'models/InvestigationStatistics';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import { HistoryState } from '../InvestigationTable/InvestigationTableInterfaces';

export const allTimeRangeId = 10;

const useAdminLandingPage = (parameters: Parameters) => {

    const { 
        setIsLoading, setInvestigationsStatistics, 
        investigationInfoFilter , setInvestigationInfoFilter,
        setLastUpdated
    } = parameters;    
    const history = useHistory<HistoryState>();

    useEffect(() => {
        const { location: { state } } = history;
        const deskFilter = state?.deskFilter;
        const timeRange = state?.timeRangeFilter;
        const investigationInfo : HistoryState = {};
        if (deskFilter && deskFilter.length > 0) investigationInfo.deskFilter = deskFilter;
        if (timeRange && timeRange.id !== defaultTimeRange.id) investigationInfo.timeRangeFilter = timeRange;
        setInvestigationInfoFilter(investigationInfo);
    }, [])

    const updateInvestigationFilterByDesks =  (deskFilter: number[]) => {
        if (deskFilter.length === 0) {
            setInvestigationInfoFilter({timeRangeFilter: investigationInfoFilter.timeRangeFilter});
        } else {
            setInvestigationInfoFilter({...investigationInfoFilter, deskFilter});
        }
    }
    
    const updateInvestigationFilterByTime =  (timeRangeFilter: TimeRange) => {
        if (timeRangeFilter.id === defaultTimeRange.id) {
            setInvestigationInfoFilter({deskFilter: investigationInfoFilter.deskFilter});
        } else {
            setInvestigationInfoFilter({...investigationInfoFilter, timeRangeFilter});
        }
    }

    const updateFilterHistory = () => {
        const { location: { state } } = history;
        history.replace({
            state: {
                ...state,
                deskFilter: investigationInfoFilter.deskFilter || [],
                timeRangeFilter: investigationInfoFilter.timeRangeFilter || defaultTimeRange,
            }
        });
    };
    
    useEffect(() => {
        fetchInvestigationStatistics();
        updateFilterHistory();
    }, [investigationInfoFilter])

    const fetchInvestigationStatistics = () => {
        const unallocatedCountLogger = logger.setup('query investigation statistics');
        unallocatedCountLogger.info('launching db request', Severity.LOW);
        setIsLoading(true);
        axios.post<InvesitgationStatistics>('/landingPage/investigationStatistics', {
            ...investigationInfoFilter,
            timeRangeFilter: investigationInfoFilter.timeRangeFilter as TimeRangeDates
        })
        .then((response) => {
            unallocatedCountLogger.info('launching db request', Severity.LOW);
            setInvestigationsStatistics(response.data);
        })
        .catch(error => {
            unallocatedCountLogger.error(`got error ${error}`, Severity.HIGH);
        })
        .finally(() => {
            setIsLoading(false)
            setLastUpdated(new Date());
        });
    }

    const redirectToInvestigationTable = (investigationStatusFilter: FilterRulesVariables, filterType?: FilterRulesDescription) => {
        const filterTitle = filterType ? `חקירות ${filterType}` : undefined;
        const state : HistoryState = {...investigationStatusFilter, isAdminLandingRedirect: true, filterTitle, ...investigationInfoFilter}
        history.push(landingPageRoute, state);
    };

    return {
        redirectToInvestigationTable,
        fetchInvestigationStatistics,
        updateInvestigationFilterByDesks,
        updateInvestigationFilterByTime
    }
};

interface Parameters {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<HistoryState>>;
    setInvestigationsStatistics: React.Dispatch<React.SetStateAction<InvesitgationStatistics>>;
    investigationInfoFilter: HistoryState;
    setLastUpdated:  React.Dispatch<React.SetStateAction<Date>>;
};

export default useAdminLandingPage;