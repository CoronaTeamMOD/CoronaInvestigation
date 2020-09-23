import React from 'react';
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import Interaction from 'models/Contexts/InteractionEventDialogData';

import { useStyles } from './InteractionsQuestioningStyles';
import useInteractionsQuestioning from './useInteractionsQuestioning';
import { Typography } from '@material-ui/core';

const InteractionsQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const interactions = useSelector<StoreStateType, Interaction[]>(state => state.interactions);

    const {} = useInteractionsQuestioning({});

    return (
        <div>
            <Typography variant='h4' className={classes.form}>טופס תשאול מגעים ( {interactions.length} )</Typography>
            {
                interactions.map((interaction: Interaction) => (
                    <div className={classes.form}>
                        {interaction.cityOrigin}
                    </div>
                ))
            }
        </div>
    );
};

export default InteractionsQuestioning;
