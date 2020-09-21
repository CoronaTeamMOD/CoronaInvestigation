import React from 'react';

import placeTypesCodesHierarchy, {getSubtypeCodeByName} from 'Utils/placeTypesCodesHierarchy';

import HospitalEventGrid from './HospitalEventGrid';
import DefaultPlaceEventGrid from './DefaultPlaceEventGrid';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

const MedicalLocationGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { interaction } = props;

    return (
        <>
        {
            interaction.placeSubType === getSubtypeCodeByName(placeTypesCodesHierarchy.medical.code, 'hospital') ?
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