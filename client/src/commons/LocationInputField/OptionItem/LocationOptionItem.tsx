import React from 'react';
import {Grid, Typography} from "@material-ui/core";
import {LocationOn} from "@material-ui/icons";
import {GoogleApiPlace} from "../LocationInput";

const LocationOptionItem = ({structured_formatting}: GoogleApiPlace) => {
    const {main_text, secondary_text} = structured_formatting;
    return (
        <Grid container alignItems="center">
            <Grid item>
                <LocationOn/>
            </Grid>
            <Grid item xs>
                <span style={{fontWeight: 700}}>
                  {main_text}
                </span>
                <Typography variant="body2" color="textSecondary">
                    {secondary_text}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default LocationOptionItem;