import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';

const HospitalEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { interaction } = props;

    const formClasses = useFormStyles();

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם בית חולים'>
                        <Typography variant='caption'>
                            {interaction.placeName}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={3}>
                    <FormInput fieldName='מחלקה'>
                        <Typography variant='caption'>
                            {interaction.hospitalDepartment}
                        </Typography>
                    </FormInput>
                </Grid>
            </Grid>
            <AddressGrid interaction={interaction} removeEntrance removeFloor/>
            <BusinessContactGrid interaction={interaction}/>
        </>
    );
};

export default HospitalEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}