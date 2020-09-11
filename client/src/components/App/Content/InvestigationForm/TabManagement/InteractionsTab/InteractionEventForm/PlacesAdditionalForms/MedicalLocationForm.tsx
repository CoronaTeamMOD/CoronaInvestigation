import React, {useContext} from 'react';

import { hospitalPlaceType } from 'Utils/placeSubTypesCodes';

import HospitalEventForm from './HospitalEventForm';
import DefaultPlaceEventForm from './DefaultPlaceEventForm';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'

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