import React from 'react';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionDialog from '../InteractionDialog/InteractionDialog';

const newContactEventTitle = 'עריכת מקום/מגע';

const EditInteractionEventDialog: React.FC<Props> = (props: Props): JSX.Element => {
    const { closeEditDialog, eventToEdit, isOpen, loadInteractions, loadInvolvedContacts, interactions  } = props;
    const testIds = {
        cancelButton: '',
        submitButton: 'createContact',
    };

    return (
        <InteractionDialog
            isNewInteraction={false}
            isOpen={isOpen}
            dialogTitle={newContactEventTitle}
            onDialogClose={closeEditDialog}
            loadInteractions={loadInteractions}
            loadInvolvedContacts={loadInvolvedContacts}
            interactions={interactions}
            testIds={testIds}
            interactionData={eventToEdit}
        />
    );
};

export default EditInteractionEventDialog;

export interface Props {
    isOpen: boolean;
    eventToEdit: InteractionEventDialogData;
    closeEditDialog: () => void;
    loadInteractions: () => void;
    loadInvolvedContacts: () => void;
    interactions: InteractionEventDialogData[];
};
