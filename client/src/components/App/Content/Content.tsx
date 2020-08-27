import React from 'react';

import TabObj from 'models/TabObj';
import InvestigationForm from './InvestigationForm/InvestigationForm';

export const defaultTab: TabObj = {
    id: 0,
    name: 'פרטים אישיים'
};

const Content: React.FC = (): JSX.Element => {
  
    return (
        <InvestigationForm/>
    )
}

export default Content;
