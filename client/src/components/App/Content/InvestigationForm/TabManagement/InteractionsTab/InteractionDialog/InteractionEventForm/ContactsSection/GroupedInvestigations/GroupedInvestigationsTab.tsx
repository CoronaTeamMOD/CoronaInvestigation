import React from 'react';
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';

import useStyles from './groupedInvestigationFormStyles'; 
import ErrorMessage from './ErrorMessage/ErrorMessage';
import GroupedInvestigationForm from './GroupedInvestigationForm/GroupedInvestigationForm';

const notGroupedText = 'החקירה אינה מקובצת';

const GroupedInvestigationsTab = () => {
    const classes = useStyles();

    const groupId = useSelector<StoreStateType , string>(state => state.groupedInvestigations.groupId);

    return (
        <div className={classes.wrapper}>
            {!Boolean(groupId)
                ?   <ErrorMessage 
                        text={notGroupedText}
                    />
                :   <GroupedInvestigationForm />
                }
        </div>
    )
}

export default GroupedInvestigationsTab;
