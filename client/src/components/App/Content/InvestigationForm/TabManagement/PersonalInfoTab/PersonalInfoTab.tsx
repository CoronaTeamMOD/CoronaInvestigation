import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import useStyles from './PersonalInfoTabStyles';

const PersonalInfoTab: React.FC<Props> = (): JSX.Element => {
    const classes = useStyles({});

    const personalInfoFields: string[] = [
        'טלפון',
        'מין',
        'סוג תעודה מזהה',
        'גיל',
        'שמות הורי הקטין',
        'קופת חולים',
        'כתובת',
        'האם עובד באחד מהבאים'
    ]
  
    return (
        <Grid container spacing={3} className={classes.container}>
            <Grid item xs={1}>
                <Typography>
                    <b>
                        טלפון:
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <TextField required id="standard-required" placeholder="טלפון:" className={classes.borderRadius} variant="filled" />
            </Grid>
        </Grid>
    )
};

interface Props {

}

export default PersonalInfoTab;
