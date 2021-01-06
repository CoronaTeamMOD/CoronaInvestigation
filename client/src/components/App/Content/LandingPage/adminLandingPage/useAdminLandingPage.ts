import axios from 'axios';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import { TimeRange } from 'models/TimeRange';
import { landingPageRoute } from 'Utils/Routes/Routes';
import FilterRulesVariables from 'models/FilterRulesVariables';
import InvesitgationStatistics from 'models/InvestigationStatistics';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import AdminLandingPageFilters from './AdminLandingPageFilters';
import { HistoryState } from '../InvestigationTable/InvestigationTableInterfaces';

const useAdminLandingPage = (parameters: Parameters) => {

    const allTimeRangeId = 10;
    const { 
        setIsLoading, setInvestigationsStatistics, 
        investigationInfoFilter , setInvestigationInfoFilter,
        filteredDesks , setFilteredDesks ,
        timeRangeFilter, setTimeRangeFilter,
        setLastUpdated
    } = parameters;    
    const history = useHistory<HistoryState>();

    useEffect(() => {
        const { location: { state } } = history;
        const deskFilter = state ? state.deskFilter : undefined;
        const timeRange = state ? state.timeRangeFilter : undefined;
        if(deskFilter) {
            setFilteredDesks(deskFilter)
            if(deskFilter.length > 0) {
                setInvestigationInfoFilter((investigationInfoFilter) => {
                    return {...investigationInfoFilter, desks : deskFilter};
                });
            } else {
                delete investigationInfoFilter.desks
                setInvestigationInfoFilter((investigationInfoFilter) => {
                    return {...investigationInfoFilter};
                });
            }
        } 
        if (timeRange) {
            setTimeRangeFilter(timeRange)
            if(timeRange.id !== allTimeRangeId) {
                setInvestigationInfoFilter((investigationInfoFilter) => {
                    return {...investigationInfoFilter, timeRange : {startDate: timeRange.startDate, endDate: timeRange.endDate}};
                });
            } else {
                delete investigationInfoFilter.timeRange
                setInvestigationInfoFilter((investigationInfoFilter) => {
                    return {...investigationInfoFilter};
                });
            }
        }
        if (!deskFilter && !timeRange){
            setInvestigationInfoFilter({})
        }
    }, [])
    
    useEffect(() => {
        fetchInvestigationStatistics();
    }, [investigationInfoFilter])

    const fetchInvestigationStatistics = () => {
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
        .finally(() => {
            setIsLoading(false)
            setLastUpdated(new Date());
        });
    }

    const redirectToInvestigationTable = (investigationInfoFilter: FilterRulesVariables, filterType?: FilterRulesDescription) => {
        const filterTitle = filterType ? `חקירות ${filterType}` : undefined;
        const state = {...investigationInfoFilter, isAdminLandingRedirect: true, filterTitle, deskFilter : filteredDesks, timeRangeFilter: timeRangeFilter}
        history.push(landingPageRoute, state);
    };

    return {
        redirectToInvestigationTable,
        fetchInvestigationStatistics
    }
};

interface Parameters {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<AdminLandingPageFilters>>;
    setInvestigationsStatistics: React.Dispatch<React.SetStateAction<InvesitgationStatistics>>;
    investigationInfoFilter: AdminLandingPageFilters;
    filteredDesks: number[];
    setFilteredDesks:  React.Dispatch<React.SetStateAction<number[]>>;
    timeRangeFilter: TimeRange;
    setTimeRangeFilter: React.Dispatch<React.SetStateAction<TimeRange>>;
    setLastUpdated:  React.Dispatch<React.SetStateAction<Date>>;
};

export default useAdminLandingPage;