import React from 'react';
import { Grid } from '@material-ui/core';

import useSynchronizationAction from './useSynchronizationAction';
import UpdateButton from '../../UpdateButton/UpdateButton';


const synchronizationCitiesText = 'סנכרון ערים';
const synchronizationStreetsText = 'סנכרון רחובות';

const AdminSynchronizationCitiesStreets = (): JSX.Element => {
    const {
        synchronizationCities, synchronizationstreets
    } = useSynchronizationAction({});

    return (
        <Grid container xs={8} spacing={1} direction='column'>
            <Grid item container xs={8} alignItems='center' justify='center'>
                <Grid item xs={4} alignItems='center'>
                    <UpdateButton 
                        onClick={() => synchronizationCities()}
                        text={synchronizationCitiesText}
                    />
                </Grid>
               
            </Grid>
            <Grid item container xs={8} alignItems='center' justify='center'>
                <Grid item xs={4} alignItems='center'>
                    <UpdateButton 
                        onClick={() => synchronizationstreets()}
                        text={synchronizationStreetsText}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
};

export default AdminSynchronizationCitiesStreets;