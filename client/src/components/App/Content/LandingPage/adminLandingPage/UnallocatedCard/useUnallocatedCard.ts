import axios from 'axios';
import logger from 'logger/logger';
import Desk from 'models/Desk';
import { Severity } from 'models/Logger';
import { useEffect, useState } from 'react';
import FilterRulesVariables from 'models/FilterRulesVariables';

interface Parameters {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setUnallocatedCount: React.Dispatch<React.SetStateAction<number>>;
    investigationInfoFilter: FilterRulesVariables;
}

const useUnallocatedCard = (parameters: Parameters) => {

    const { setIsLoading, setUnallocatedCount, investigationInfoFilter } = parameters;
    
    useEffect(() => {
        const unallocatedCountLogger = logger.setup('query unallocated count');
        unallocatedCountLogger.info('launching db request', Severity.LOW);
        setIsLoading(true);
        axios.post<number>('/landingPage/unallocatedInvestigationsCount', {filterRules: investigationInfoFilter})
        .then((response) => {
            unallocatedCountLogger.info('launching db request', Severity.LOW);
            setUnallocatedCount(response.data);
        })
        .catch(error => {
            unallocatedCountLogger.error(`got error ${error}`, Severity.HIGH);
        })
        .finally(() => setIsLoading(false));
    }, [])

};

export default useUnallocatedCard;