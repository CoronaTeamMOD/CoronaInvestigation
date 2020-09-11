import React, {useContext} from 'react';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';

import HospitalEventForm from './HospitalEventForm';
import DefaultPlaceEventForm from './DefaultPlaceEventForm';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'

const MedicalLocationForm : React.FC = () : JSX.Element => {

    const { placeSubType } = useContext(InteractionEventDialogContext).interactionEventDialogData;

    return (
        <>
        {
            placeSubType === placeTypesCodesHierarchy.medical.subTypesCodes.hospital ?
                <HospitalEventForm/>
            : 
                <DefaultPlaceEventForm/>
        }
        </>
    );
};

export default MedicalLocationForm;