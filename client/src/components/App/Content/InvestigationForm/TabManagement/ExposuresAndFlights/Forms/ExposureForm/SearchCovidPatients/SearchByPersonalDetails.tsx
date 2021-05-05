import React, { useState } from 'react';
import { Search } from '@material-ui/icons';
import { Grid, IconButton, TextField, Typography } from '@material-ui/core';

import PersonalDetailsQueryParams from 'models/ExposureForm/PersonalDetailsQueryParams';

import useStyles from './searchStyles';

const nameLabel = 'שם';
const phoneNumberLabel = 'טלפון';

const SearchByPersonalDetails = (props: Props) => {
    const { getQueryParams } = props;

    const classes = useStyles()

    const [nameQuery,setFirstNameQuery] = useState<string>('');
    const [phoneNumberQuery,setPhoneNumberQuery] = useState<string>('');
    
    return (
        <>
            <Grid xs={3}>
                <TextField
                    fullWidth
                    value={nameQuery}
                    onChange={(e) => {
                        setFirstNameQuery(e.target.value ?? '')
                    }}
                    label={nameLabel}
                />
            </Grid>
            <Grid xs={1}>
                <Typography align='center'>
                    וגם
                </Typography>
            </Grid>
            <Grid xs={3}>
                <TextField
                    fullWidth
                    value={phoneNumberQuery}
                    onChange={(e) => {
                        setPhoneNumberQuery(e.target.value ?? '')
                    }}
                    label={phoneNumberLabel}
                />
            </Grid>
            <Grid xs='auto' className={classes.buttonWrapper}>
                <IconButton
                    onClick={() => {
                        getQueryParams({
                            name: nameQuery,
                            phoneNumber: phoneNumberQuery
                        })
                    }}
                >
                    <Search color='primary' />
                </IconButton>
            </Grid>
        </>
    )
};

interface Props {
    getQueryParams: (params : PersonalDetailsQueryParams) => void
};


export default SearchByPersonalDetails;
