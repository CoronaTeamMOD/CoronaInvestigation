import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

import AddressGrid from '../AddressGrid/AddressGrid';
import BusinessContactGrid from '../BusinessContactGrid/BusinessContactGrid';


const SchoolEventGrid: React.FC<Props> = (props: Props): JSX.Element => {
    
    const { interaction } = props;
    
    const formClasses = useFormStyles();

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <FormInput xs={6} fieldName='שם המוסד'>
                    <Typography variant='caption'>
                        {interaction.placeName}
                    </Typography>
                </FormInput>
                    {
                        interaction.grade &&
                        <FormInput xs={6} fieldName='כיתה'>
                            <Typography variant='caption'>
                                {interaction.grade}
                            </Typography>
                        </FormInput>
                    }
            </Grid>
            <AddressGrid interaction={interaction} />
            <BusinessContactGrid interaction={interaction}/>
        </>
    );
};

export default SchoolEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
};
