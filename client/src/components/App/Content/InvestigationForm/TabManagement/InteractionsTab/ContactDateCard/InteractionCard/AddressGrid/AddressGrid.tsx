import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

const AddressGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    const { interaction } = props;
        
    const formClasses = useFormStyles();
    
    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='כתובת'>
                        <Typography variant='caption'>
                            {interaction.locationAddress ? (interaction.locationAddress as any).description : 'לא הוזן מיקום'}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={6}/>
            </Grid>
        </>
    );
};

export default AddressGrid;

interface Props {
    removeFloor?: boolean
    removeEntrance?: boolean
    interaction: InteractionEventDialogData
}
