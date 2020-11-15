import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

const businessContactFirstNameField = 'שם איש קשר';
const businessContactNumField = 'טלפון איש קשר';
 
const BusinessContactGrid : React.FC<Props> = (props: Props) : JSX.Element => {
        
    const { interaction } = props;
    const formClasses = useFormStyles();
    
    return (
        <>
            <Grid container className={formClasses.formRow}>
                {   (interaction.contactPersonFirstName &&  interaction.contactPersonLastName) &&
                        <FormInput xs={6} fieldName={businessContactFirstNameField}>
                            <Typography variant='caption'>
                                {`${interaction.contactPersonFirstName} ${interaction.contactPersonLastName}`}
                            </Typography>
                        </FormInput>
                }
                {
                    (interaction.contactPersonPhoneNumber && interaction.contactPersonPhoneNumber) &&
                        <FormInput xs={6} fieldName={businessContactNumField}>
                            <Typography variant='caption'>
                                {interaction.contactPersonPhoneNumber}
                            </Typography>
                        </FormInput>
                }
            </Grid>
        </>
    );
};

export default BusinessContactGrid;

interface Props {
    interaction: InteractionEventDialogData;
}
