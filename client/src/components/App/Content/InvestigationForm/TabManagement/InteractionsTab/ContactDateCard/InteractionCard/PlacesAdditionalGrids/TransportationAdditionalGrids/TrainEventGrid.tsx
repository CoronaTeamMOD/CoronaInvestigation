import React from 'react';
import { useSelector } from 'react-redux';
import {Grid, Typography} from '@material-ui/core';

import City from 'models/City';
import useFormStyles from 'styles/formStyles';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import InteractionEventDialogData from 'models/Contexts/InteractionEventDialogData';

const TrainEventGrid : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { interaction } = props;
       
    const formClasses = useFormStyles();

    const cities : Map<string, City> = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    return (
        <>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר מוצא'>
                        <Typography>
                            {cities.get(interaction.cityOrigin as string)?.displayName}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='תחנת עליה'>
                        <Typography variant='caption'>
                            {interaction.boardingStation}
                        </Typography>
                    </FormInput>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' className={formClasses.formRow}>
                <Grid item xs={6}>
                    <FormInput fieldName='עיר יעד'>
                        <Typography>
                            {cities.get(interaction.cityDestination as string)?.displayName}
                        </Typography>
                    </FormInput>
                </Grid>
                <Grid item xs={6}>
                    <FormInput fieldName='תחנת ירידה'>
                        <Typography variant='caption'>
                            {interaction.endStation}
                        </Typography>
                    </FormInput>
                </Grid>
            </Grid>
        </>
    );
};

export default TrainEventGrid;

interface Props {
    interaction: InteractionEventDialogData;
}