import React from 'react';
import { useSelector } from 'react-redux';
import {Grid, Typography} from '@material-ui/core';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

const BusEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { interaction } = props;
       
    const formClasses = useFormStyles();

    const cities : Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <FormInput xs={6} fieldName='קו'>
                    <Typography variant='caption'>
                        {interaction.busLine}
                    </Typography>
                </FormInput>

                <FormInput xs={6} fieldName='חברה'>
                    <Typography variant='caption'>
                        {interaction.busCompany}
                    </Typography>
                </FormInput>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <FormInput xs={6} fieldName='עיר מוצא'>
                    <Typography>
                        {cities.get(interaction.cityOrigin as string)?.displayName}
                    </Typography>
                </FormInput>

                <FormInput xs={6} fieldName='תחנת עליה'>
                    <Typography variant='caption'>
                        {interaction.boardingStation}
                    </Typography>
                </FormInput>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <FormInput xs={6} fieldName='עיר יעד'>
                    <Typography>
                        {cities.get(interaction.cityDestination as string)?.displayName}
                    </Typography>
                </FormInput>

                <FormInput xs={6} fieldName='תחנת ירידה'>
                    <Typography variant='caption'>
                        {interaction.endStation}
                    </Typography>
                </FormInput>
            </Grid>
        </>
    );
};

export default BusEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}