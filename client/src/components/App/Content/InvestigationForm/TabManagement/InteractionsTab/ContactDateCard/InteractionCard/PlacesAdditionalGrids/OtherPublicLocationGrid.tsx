import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';

const { publicPark, zoo, stadium, amphitheater, beach } = placeTypesCodesHierarchy.otherPublicPlaces.subTypesCodes;

const wideAreas = [
    publicPark,
    zoo,
    stadium,
    amphitheater,
    beach
]

const OtherPublicLocationGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { interaction } = props;
    const isWideArea : boolean = wideAreas.includes(interaction.placeSubType);

    return (
        <>
            <Grid item xs={6}>
                <FormInput fieldName='שם המוסד'>
                    <Typography variant='caption'>
                        {interaction.placeName}
                    </Typography>
                </FormInput>
            </Grid>
            <AddressGrid removeEntrance removeFloor interaction={interaction}/>
            {
                !isWideArea && <BusinessContactGrid interaction={interaction}/>
            }
        </>
    );
};

export default OtherPublicLocationGrid;

interface Props {
    interaction: InteractionEventDialogData;
}