
import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Country from 'models/Country';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

const FlightEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {

    const { interaction } = props;

    const formClasses = useFormStyles();

    const countries : Map<string, Country> = useSelector<StoreStateType, Map<string, Country>>(state => state.countries);

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='מספר טיסה'>
                        <Typography variant='caption'>
                            {interaction.flightNum}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='חברת תעופה'>
                        <Typography variant='caption'>
                            {interaction.airline}
                        </Typography>
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={4}>
                    <FormInput fieldName='ארץ מוצא'>
                        <Typography>
                            {countries.get(interaction.flightOriginCountry as string)?.displayName}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName='עיר מוצא'>
                        <Typography variant='caption'>
                            {interaction.flightOriginCity}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName='שדה תעופה מוצא'>
                        <Typography variant='caption'>
                            {interaction.flightOriginAirport}
                        </Typography>
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={4}>
                    <FormInput fieldName='ארץ יעד'>
                        <Typography>
                            {countries.get(interaction.flightDestinationCountry as string)?.displayName}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName='עיר יעד'>
                        <Typography variant='caption'>
                            {interaction.flightDestinationCity}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={4}>
                    <FormInput fieldName='שדה תעופה יעד'>
                        <Typography variant='caption'>
                            {interaction.flightDestinationAirport}
                        </Typography>
                    </FormInput>
                </Grid>
            </Grid>
        </>
    );
};

export default FlightEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}