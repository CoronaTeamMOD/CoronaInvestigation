import React from 'react';
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import Interaction from 'models/Contexts/InteractionEventDialogData';

import { useStyles } from './InteractionsQuestioningStyles';
import useInteractionsQuestioning from './useInteractionsQuestioning';

const InteractionsQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const interactions = useSelector<StoreStateType, Interaction[]>(state => state.interactions);

    const {} = useInteractionsQuestioning({});

    return (
        <div>
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
