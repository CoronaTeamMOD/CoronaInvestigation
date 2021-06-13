import React, { useState } from 'react';
import { Search } from '@material-ui/icons';
import { Grid, IconButton, TextField, Typography } from '@material-ui/core';

import NumericTextField from 'commons/NoContextElements/NumericTextField';
import PersonalDetailsQueryParams from 'models/ExposureForm/PersonalDetailsQueryParams';

import useStyles from './searchStyles';

const nameLabel = 'שם';
const phoneNumberLabel = 'טלפון';

const SearchByPersonalDetails = (props: Props) => {
    const { getQueryParams, isViewMode } = props;

    const classes = useStyles()

    const [nameQuery, setFirstNameQuery] = useState<string>('');
    const [phoneNumberQuery, setPhoneNumberQuery] = useState<string>('');

    const triggerSearch = () => {
        getQueryParams({
            name: nameQuery,
            phoneNumber: phoneNumberQuery
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            triggerSearch();
        }
    };

    return (
        <>
            <Grid item xs={3}>
                <TextField
                    fullWidth
                    value={nameQuery}
                    onChange={(e) => {
                        setFirstNameQuery(e.target.value ?? '')
                    }}
                    label={nameLabel}
                    onKeyDown={handleKeyDown}
                    disabled={isViewMode}
                />
            </Grid>
            <Grid item className={classes.andConnectorWrapper}>
                <Typography align='center'>
                    וגם
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <NumericTextField
                    fullWidth
                    name={phoneNumberLabel}
                    value={phoneNumberQuery}
                    onChange={(newValue) => {
                        setPhoneNumberQuery(newValue ?? '')
                    }}
                    label={phoneNumberLabel}
                    onKeyDown={handleKeyDown}
                    disabled={isViewMode}
                />
            </Grid>
            <Grid item xs='auto' className={classes.buttonWrapper}>
                <IconButton
                    onClick={() => {
                        triggerSearch();
                    }}
                    disabled={isViewMode}
                >
                    <Search color='primary' />
                </IconButton>
            </Grid>
        </>
    )
};

interface Props {
    getQueryParams: (params: PersonalDetailsQueryParams) => void;
    isViewMode: boolean;
};


export default SearchByPersonalDetails;
