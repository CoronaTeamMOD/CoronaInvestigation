import React from 'react';
import {LocationOn} from '@material-ui/icons';
import {Grid, Typography} from '@material-ui/core';

import {GeocodeResponse, GoogleApiPlace} from '../LocationInput';

// @ts-ignore
const LocationOptionItem = ({structured_formatting, description , formatted_address}: GoogleApiPlace | GeocodeResponse) => {
    return (
        <Grid container alignItems='center'>
            <Grid item>
                <LocationOn/>
            </Grid>
            <Grid item xs>
                <span style={{fontWeight: 700}}>
                  {structured_formatting?.main_text || description}
                </span>
                <Typography variant='body2' color='textSecondary'>
                    {structured_formatting?.secondary_text || formatted_address}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default LocationOptionItem;
