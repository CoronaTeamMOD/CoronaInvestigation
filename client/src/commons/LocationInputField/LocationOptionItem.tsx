import React from 'react';
import {Grid, Typography} from "@material-ui/core";
import {LocationOn} from "@material-ui/icons";
import {DisplayPlaceType} from "./LocationInput";

const LocationOptionItem = ({title, subTitle}: DisplayPlaceType) => {
    return (
        <Grid container alignItems="center">
            <Grid item>
                <LocationOn/>
            </Grid>
            <Grid item xs>
                <span style={{fontWeight: 700}}>
                  {title}
                </span>
                <Typography variant="body2" color="textSecondary">
                    {subTitle.join(' ')}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default LocationOptionItem;