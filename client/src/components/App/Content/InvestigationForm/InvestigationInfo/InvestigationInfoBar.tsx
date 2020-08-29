import React from 'react';

import InvestigatedPersonInfo from './InvestigatedPersonInfo/InvestigatedPersonInfo';
import InvestigationMetadata from './InvestigationMetadata/InvestigationMetadata';

const InvestigationInfoBar = () => {
    return (
        <>
            <InvestigatedPersonInfo/>
            <InvestigationMetadata/>
        </>
    );
};

export default InvestigationInfoBar;