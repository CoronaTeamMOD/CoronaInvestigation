import React from 'react';

import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import HospitalEventGrid from './HospitalEventGrid';
import DefaultPlaceEventGrid from './DefaultPlaceEventGrid';

const MedicalLocationGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { interaction } = props;

    return (
        <>
        {
            interaction.placeSubType === placeTypesCodesHierarchy.medical.subTypesCodes?.hospital.code ?
                <HospitalEventGrid interaction={interaction}/>
            : 
                <DefaultPlaceEventGrid interaction={interaction}/>
        }
        </>
    );
};

export default MedicalLocationGrid;

interface Props {
    interaction: InteractionEventDialogData;
}