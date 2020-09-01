import React from 'react';
import {Grid, TextField} from "@material-ui/core";
import FormRowWithInput from "commons/FormRowWithInput/FormRowWithInput";
import useFormStyles from "styles/formStyles";

const ExposureForm = () => {
    const placeholderText = 'הכנס שם...';
    const classes = useFormStyles();

    return (
        <Grid className={classes.form} container justify='flex-start'>
            <FormRowWithInput fieldName='שם החולה'>
                <TextField
                    InputProps={{classes:{ root: classes.roundedTextField }}}
                    variant='outlined' placeholder={placeholderText}/>
            </FormRowWithInput>

            <FormRowWithInput fieldName='מקום החשיפה'>
                <TextField
                    InputProps={{classes:{ root: classes.roundedTextField }}}
                    variant='outlined' placeholder={placeholderText}/>
            </FormRowWithInput>
        </Grid>
    );
};

export default ExposureForm;