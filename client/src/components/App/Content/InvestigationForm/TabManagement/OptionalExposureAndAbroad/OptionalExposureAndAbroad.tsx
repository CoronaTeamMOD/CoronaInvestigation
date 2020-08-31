import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { Grid, Typography, TextField } from '@material-ui/core';

import useStyles from './OptionalExposureAndAbroadStyles';

import useOptionalExposureAndAbroad from './useOptionalExposureAndAbroad';


const OptionalExposureAndAbroad: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [wasExposedToVerifiedPatient, setWasExposedToVerifiedPatient] = React.useState<boolean>(false);

    const { wasExposedToVerifiedPatientToggle } = useOptionalExposureAndAbroad({ wasExposedToVerifiedPatient, setWasExposedToVerifiedPatient });

    return (
        <>
            {/* Optional Exposure Panel */}
            <Grid container spacing={2} className={classes.root}>
                <Grid item xs={12}>
                    <Typography variant='subtitle2'>
                        <b>חשיפה אפשרית</b>
                    </Typography>
                </Grid>
                <Grid item xs={2} >
                    <Typography variant='subtitle2'>
                        <b>האם היה מגע ידוע עם חולה מאומת?</b>
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <ToggleButtonGroup
                        value={wasExposedToVerifiedPatient}
                        exclusive
                        onChange={wasExposedToVerifiedPatientToggle}
                        className={classes.verifiedPatientToggle} >
                        <ToggleButton value={true} className={classes.yesBtn}>
                            כן
                        </ToggleButton>
                        <ToggleButton value={false} className={classes.noBtn}>
                            לא
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>

                <Grid item xs={2} />
                <Grid item xs={2} >
                    <Typography variant='subtitle2'>
                        <b>שם החולה:</b>
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField id="outlined-basic" className={classes.nameTextField}/>
                </Grid>
            </Grid>

            {/* Abroad panel */}
            <Grid container spacing={3}>

            </Grid>
        </>

    )
};

export default OptionalExposureAndAbroad;
