import React from 'react';
import { Grid } from '@material-ui/core';

import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';

import InteractionGridItem from '../PlacesAdditionalGrids/InteractionGridItem';

const PATIENT_HOUSE = 'בית המתוחקר';
const NO_LOCATION_INSERTED = 'לא הוזן מיקום';

const AddressGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    const { interaction } = props;
    
    const content =
        interaction.placeSubType === placeTypesCodesHierarchy.privateHouse.subTypesCodes?.patientHouse.code
            ? PATIENT_HOUSE
            : interaction.locationAddress
                ? interaction.locationAddress.description
                : NO_LOCATION_INSERTED;

    return (
        <>
            <InteractionGridItem 
                    containerSize={6}
                    labelLengthMD={3}
                    labelLengthLG={2}
                    title='כתובת'
                    content={content}
                />
            <Grid xs={6} />
        </>
    );
};

export default AddressGrid;

interface Props {
    interaction: InteractionEventDialogData;
}
