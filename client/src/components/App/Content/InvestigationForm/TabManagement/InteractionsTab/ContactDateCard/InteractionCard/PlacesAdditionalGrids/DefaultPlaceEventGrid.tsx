import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';

const DefaultPlaceEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { interaction } = props;

    return (
        <>
            <Grid item xs={6}>
                <FormInput fieldName='שם המוסד'>
                    <Typography variant='caption'>
                        {interaction.placeName}
                    </Typography>
                </FormInput>
            </Grid>
            <AddressGrid interaction={interaction}/>
            <BusinessContactGrid interaction={interaction}/>
        </>
    );
};

export default DefaultPlaceEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}