import React, {useContext} from 'react';

import placeTypesCodesHierarchy, {getSubtypeCodeByName} from 'Utils/placeTypesCodesHierarchy';

import HospitalEventForm from './HospitalEventForm';
import DefaultPlaceEventForm from './DefaultPlaceEventForm';
import {InteractionEventDialogContext} from '../../InteractionsEventDialogContext/InteractionsEventDialogContext'

const MedicalLocationForm : React.FC = () : JSX.Element => {

    const { placeSubType } = useContext(InteractionEventDialogContext).interactionEventDialogData;

    return (
        <>
        {
            // TODO delete file
            placeSubType === getSubtypeCodeByName(placeTypesCodesHierarchy.medical.code, 'hospital') ?
                <HospitalEventForm/>
            : 
                <DefaultPlaceEventForm/>
        }
        </>
    );
};

export default MedicalLocationForm;