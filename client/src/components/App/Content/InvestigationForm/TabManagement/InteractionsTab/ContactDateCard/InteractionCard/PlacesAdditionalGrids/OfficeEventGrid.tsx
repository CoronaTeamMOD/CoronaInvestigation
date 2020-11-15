import React from 'react';
import { Typography, Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';

const OfficeEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { interaction } = props;
    
    const formClasses = useFormStyles();
   
    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <FormInput xs={12} fieldName='שם המשרד'>
                    <Typography variant='caption'>
                        {interaction.placeName}
                    </Typography>
                </FormInput>
            </Grid>
            <AddressGrid interaction={interaction}/>
        </>
    );
};

export default OfficeEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}