import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';

const PATIENT_HOUSE = 'בית המתוחקר';
const NO_LOCATION_INSERTED = 'לא הוזן מיקום';

const AddressGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    const { interaction } = props;

    const formClasses = useFormStyles();
    
    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <FormInput xs={6} fieldName='כתובת'>
                    <Typography variant='caption'>
                        {
                            interaction.placeSubType === placeTypesCodesHierarchy.privateHouse.subTypesCodes?.patientHouse.code ?
                                PATIENT_HOUSE
                            :
                                interaction.locationAddress ? 
                                    interaction.locationAddress.description 
                                : 
                                    NO_LOCATION_INSERTED
                        }
                    </Typography>
                </FormInput>
                <Grid item xs={6}/>
            </Grid>
        </>
    );
};

export default AddressGrid;

interface Props {
    interaction: InteractionEventDialogData;
}
