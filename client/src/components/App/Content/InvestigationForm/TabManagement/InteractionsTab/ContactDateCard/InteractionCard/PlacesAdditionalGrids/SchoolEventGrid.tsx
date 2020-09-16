import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';
import AddressGrid from '../AddressGrid/AddressGrid';


const SchoolEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { interaction } = props;
    
    const formClasses = useFormStyles();

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='שם המוסד'>
                        <Typography variant='caption'>
                            {interaction.placeName}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='כיתה'>
                        <Typography variant='caption'>
                            {interaction.grade}
                        </Typography>
                    </FormInput>
                </Grid>
            </Grid>
            <AddressGrid interaction={interaction} removeEntrance removeFloor/>
            <BusinessContactGrid interaction={interaction}/>
        </>
    );
};

export default SchoolEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}