import React from 'react';
import { useSelector } from 'react-redux';

import Contact from 'models/Contact';
import { initAddress } from 'models/Address';
import StoreStateType from 'redux/storeStateType';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import InteractionDialog from '../InteractionDialog/InteractionDialog';

const initialDialogData = (startTime: Date, endTime: Date, contacts: Contact[], investigationId: number) : InteractionEventDialogData  => ({
    placeType: '',
    placeSubType: null,
    investigationId,
    locationAddress: initAddress,
    contacts,
    contactPersonPhoneNumber: '',
    creationTime: new Date(),
    isRepetitive: null,
    startTime,
    endTime,
    unknownTime: false,
    externalizationApproval: null,
    externalizationApprovalDescription: '',
    additionalOccurrences: []
});

const newContactEventTitle = 'יצירת מקום/מגע חדש';

const NewInteractionEventDialog: React.FC<Props> = (props: Props): JSX.Element => {
    const { interactionDate, closeNewDialog, isOpen, loadInteractions, loadInvolvedContacts, interactions,isNewDate } = props;
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const testIds = {
        cancelButton: 'cancelNewContactLocation',
        submitButton: 'createContact',
    };

    return (
        <InteractionDialog
            isNewInteraction={true}
            dialogTitle={newContactEventTitle}
            isOpen={isOpen}
            onDialogClose={closeNewDialog}
            loadInteractions={loadInteractions}
            loadInvolvedContacts={loadInvolvedContacts}
            interactions={interactions}
            testIds={testIds}
            interactionData={initialDialogData(interactionDate, interactionDate, [], epidemiologyNumber)}
            isNewDate={isNewDate}
        />
    );
};

export default NewInteractionEventDialog;

export interface Props {
    isOpen: boolean;
    interactionDate: Date;
    closeNewDialog: () => void;
    loadInteractions: () => void;
    loadInvolvedContacts: () => void;
    interactions: InteractionEventDialogData[];
    isNewDate?: boolean | undefined;
}
