import React from 'react';

import Interaction from 'models/Contexts/InteractionEventDialogData';
import { interactionsDataContext } from 'commons/Contexts/InteractionsContext';

import { useStyles } from './InteractionsQuestioningStyles';
import useInteractionsQuestioning from './useInteractionsQuestioning';

const InteractionsQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const interactionsContext = React.useContext(interactionsDataContext);

    const interactions = interactionsContext.interactions;

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
