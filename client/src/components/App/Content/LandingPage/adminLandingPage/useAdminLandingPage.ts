import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import { landingPageRoute } from 'Utils/Routes/Routes';
import { defaultTimeRange } from 'models/enums/timeRanges';
import adminInvestigation from 'models/adminInvestigation';
import { TimeRange, TimeRangeDates } from 'models/TimeRange';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import FilterRulesVariables from 'models/FilterRulesVariables';
import { initialDisplayedCounty } from 'redux/User/userReducer';
import InvesitgationStatistics from 'models/InvestigationStatistics';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import { HistoryState } from '../InvestigationTable/InvestigationTableInterfaces';
import { defaultOrderBy } from './adminInvestigationsTable/adminInvestigationsTable';


export const allTimeRangeId = [10, 11];

const useAdminLandingPage = (parameters: Parameters) => {
    const { alertError } = useCustomSwal();

    const history = useHistory<HistoryState>();
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);
    const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);

    const getInvestigationInfoFilter = () => {
        const { location: { state } } = history;
        const deskFilter = state?.deskFilter;
        const timeRange = state?.timeRangeFilter;
        const investigationInfo : HistoryState = {};
        if (deskFilter && deskFilter.length > 0) investigationInfo.deskFilter = deskFilter;
        if (timeRange && timeRange.id !== defaultTimeRange.id) investigationInfo.timeRangeFilter = timeRange;
        return investigationInfo;
    }

    const [investigationInfoFilter, setInvestigationInfoFilter] = useState<HistoryState>(getInvestigationInfoFilter());

    const { 
        setIsLoading, setInvestigationsStatistics, 
        setadminInvestigations ,setLastUpdated,setAdminInvestigationsIsLoading
    } = parameters;    

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
        if(displayedCounty !== initialDisplayedCounty) {
            fetchInvestigationStatistics();
            fetchAdminInvestigations(defaultOrderBy);
            updateFilterHistory();
        }
    }, [investigationInfoFilter, displayedCounty, userType])

    const fetchInvestigationStatistics = () => {
        const unallocatedCountLogger = logger.setup('query investigation statistics');
        unallocatedCountLogger.info('launching db request', Severity.LOW);
        setIsLoading(true);
        axios.post<InvesitgationStatistics>('/landingPage/investigationStatistics', {
            ...investigationInfoFilter,
            timeRangeFilter: investigationInfoFilter.timeRangeFilter as TimeRangeDates,
            county: displayedCounty
        })
        .then((response) => {
            unallocatedCountLogger.info('launching db request', Severity.LOW);
            setInvestigationsStatistics(response.data);
        })
        .catch(error => {
            unallocatedCountLogger.error(`got error ${error}`, Severity.HIGH);
            alertError('לא ניתן היה לקבל את הנתונים');
        })
        .finally(() => {
            setIsLoading(false)
            setLastUpdated(new Date());
        });
    }

    const fetchAdminInvestigations = (orderBy : string) => {
        const adminInvestigationsLogger = logger.setup('query admin investigations');
        adminInvestigationsLogger.info('launching db request', Severity.LOW);
        setAdminInvestigationsIsLoading(true);
        axios.post('/landingPage/adminInvestigations', {
            desks: investigationInfoFilter?.deskFilter,
            orderBy: orderBy,
            county: displayedCounty,
            timeRangeFilter: investigationInfoFilter.timeRangeFilter as TimeRangeDates
        })
        .then((response) => {
            adminInvestigationsLogger.info('launching db request', Severity.LOW);
            setadminInvestigations(response.data !== "" ? response.data : []);
        })
        .catch(error => {
            adminInvestigationsLogger.error(`got error ${error}`, Severity.HIGH);
            alertError('לא ניתן היה לקבל את הנתונים');
        })
        .finally(() => {
            setAdminInvestigationsIsLoading(false)
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
        updateInvestigationFilterByTime, 
        fetchAdminInvestigations
    }
};

interface Parameters {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setInvestigationsStatistics: React.Dispatch<React.SetStateAction<InvesitgationStatistics>>;
    setadminInvestigations: React.Dispatch<React.SetStateAction<adminInvestigation[]>>;
    setLastUpdated:  React.Dispatch<React.SetStateAction<Date>>;
    setAdminInvestigationsIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default useAdminLandingPage;