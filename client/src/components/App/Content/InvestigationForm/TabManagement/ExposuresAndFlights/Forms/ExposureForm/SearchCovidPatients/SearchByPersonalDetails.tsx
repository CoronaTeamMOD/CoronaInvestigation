import React, { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import PersonalDetailsQueryParams from '../../../../../../../../../models/ExposureForm/PersonalDetailsQueryParams';

const nameLabel = 'שם';
const phoneNumberLabel = 'טלפון';

const SearchByPersonalDetails = (props: Props) => {
    const { getQueryParams } = props;

    const [nameQuery,setFirstNameQuery] = useState<string>('');
    const [phoneNumberQuery,setPhoneNumberQuery] = useState<string>('');
    
    return (
        <>
            <Grid xs={3}>
                <TextField
                    value={nameQuery}
                    onChange={(e) => {
                        setFirstNameQuery(e.target.value ?? '')
                    }}
                    label={nameLabel}
                />
            </Grid>
            <Grid xs={1}>
                <Typography>
                    וגם
                </Typography>
            </Grid>
            <Grid xs={3}>
                <TextField
                    value={phoneNumberQuery}
                    onChange={(e) => {
                        setPhoneNumberQuery(e.target.value ?? '')
                    }}
                    label={phoneNumberLabel}
                />
            </Grid>
            <Grid xs='auto'>
                <Button 
                    onClick={() => {
                        getQueryParams({
                            name: nameQuery,
                            phoneNumber: phoneNumberQuery
                        })
                    }}
                >
                    aaaaaa    
                </Button>
            </Grid>
        </>
    )
};

interface Props {
    getQueryParams: (params : PersonalDetailsQueryParams) => void
};


export default SearchByPersonalDetails;
