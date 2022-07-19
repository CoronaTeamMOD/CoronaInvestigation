import { Grid, TextField, Typography } from "@material-ui/core";
import NumericTextField from "commons/NumericTextField/NumericTextField";
import React, { useState } from "react";

const ExposureSearchForm = (props: Props) => {

    const {isViewMode } = props;
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    const nameLabel = 'שם';
    const phoneNumberLabel = 'טלפון'; 

    return (
        <Grid item md={12} container spacing={4} alignItems="center">
            <Grid item md={3}>
                <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value ?? '')
                    }}
                    label={nameLabel}
                    disabled={isViewMode}
                />
            </Grid>
            <Grid item /*className={classes.andConnectorWrapper}*/>
                <Typography align='center'>
                    וגם
                </Typography>
            </Grid>
            <Grid item md={3}>
                <NumericTextField
                    fullWidth
                    name={phoneNumberLabel}
                    value={phone}
                    onChange={(newValue) => {
                        setPhone(newValue ?? '')
                    }}
                    label={phoneNumberLabel}
                    disabled={isViewMode}
                />
            </Grid>
            {/* <Grid item xs='auto' className={classes.buttonWrapper}>
                <IconButton
                    onClick={() => {
                        triggerSearch();
                    }}
                    disabled={isViewMode}
                >
                    <Search color='primary' />
                </IconButton>
            </Grid> */}

            <Grid item md={3}>
            </Grid>
            <Grid item md={3}>
            </Grid>
            <Grid item md={3}>
            </Grid>
        </Grid>
    );
}


interface Props {
    isViewMode?: boolean;
};

export default ExposureSearchForm;
