import React, {useContext} from 'react';

import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'
import HospitalEventForm from './HospitalEventForm';
import DefaultPlaceEventForm from './DefaultPlaceEventForm';

export const hospitalPlaceType = 122;

const MedicalLocationForm : React.FC = () : JSX.Element => {

    const { placeSubType } = useContext(InteractionEventDialogContext).interactionEventDialogData;

    return (
        <>
        {
            placeSubType === hospitalPlaceType ?
                <HospitalEventForm/>
            : 
                <DefaultPlaceEventForm/>
        }
        </>
    );
};

export default MedicalLocationForm;