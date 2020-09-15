import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import { initAddress } from 'models/Address';
import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

const AddressGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { removeFloor, removeEntrance, interaction } = props;
        
    const formClasses = useFormStyles();

    // Im making this check because somehow interaction.locationAddress sometimes gets saved as a string and sometimes
    // as an object, for now this is a quickfix for the problem that allows the user to save contact events
    // const parsedLocation = interaction.locationAddress instanceof String ?
    //     interaction.locationAddress !== null ? JSON.parse(interaction.locationAddress as unknown as string) : initAddress
    // : interaction.locationAddress;
    
    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='כתובת'>
                        <Typography variant='caption'>
                            {interaction.locationAddress.address}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={6}/>
            </Grid>
            {
                interaction.locationAddress !== null &&
                <Grid className={formClasses.formRow} container justify='flex-start'>
                    <Grid item xs={6}>
                        { !removeEntrance && <FormInput fieldName='כניסה'>
                                <Typography variant='caption'>
                                    {interaction.locationAddress.entrance}
                                </Typography>
                            </FormInput>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        { !removeFloor && <FormInput fieldName='קומה'>
                            <Typography variant='caption'>
                                {interaction.locationAddress.floor}
                            </Typography>
                        </FormInput> }
                    </Grid>
                </Grid>
            }
        </>
    );
};

export default AddressGrid;

interface Props {
    removeFloor?: boolean
    removeEntrance?: boolean
    interaction: InteractionEventDialogData
}