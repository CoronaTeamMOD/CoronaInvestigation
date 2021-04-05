import { Typography } from '@material-ui/core';
import React from 'react';
import { PersonalDetails, 
         ClinicalDetails,
         PossibleExposure, 
         PlacesAndContacts,
         ContactQuestioning
        } from './Scripts';

const scriptsOrder = [
    {
        name: 'פרטים אישיים',
        component: <PersonalDetails />
    },{
        name: 'בידוד ופרטים קליניים',
        component: <ClinicalDetails />
    },{
        name: 'חשיפה אפשרית',
        component: <PossibleExposure />
    },{
        name: 'מקומות ומגעים',
        component: <PlacesAndContacts />
    },{
        name: 'תשאול מגעים',
        component: <ContactQuestioning />
    }

]

const ConvesrationScript = (props: Props) => {
    const { currentTab } = props;
    const currentScript = scriptsOrder[currentTab];

    return (
        <div>
            <Typography variant='h5'>{currentScript.name}</Typography>
            {currentScript.component}
        </div>
    )
}

interface Props {
    currentTab: number;
}

export default ConvesrationScript;
