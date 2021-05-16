import React from 'react'

import InvestigationChart from 'models/InvestigationChart';

const UseInvestigationsInfo = () => {
    const getCardBackgroundColor = (investigationData: InvestigationChart) => {
        const {secondary, color, value} = investigationData;
        return value === 0 && secondary 
            ? secondary
            : color
    }
    
    return {
        getCardBackgroundColor
    }
}

export default UseInvestigationsInfo
