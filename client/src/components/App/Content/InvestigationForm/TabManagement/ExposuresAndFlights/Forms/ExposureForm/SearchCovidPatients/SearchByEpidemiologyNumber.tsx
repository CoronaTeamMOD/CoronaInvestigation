import React, { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@material-ui/core';

const nameLabel = 'מספר אפידמיולוגי';

const SearchByEpidemiologyNumber = (props: Props) => {
    const { getQueryParams } = props;

    const [query,setQuery] = useState<string>('');

    return (
        <>
            <Grid xs={7}>
                <TextField
                    fullWidth
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value ?? '')
                    }}
                    label={nameLabel}
                />
            </Grid>
            <Grid xs='auto'>
                <Button 
                    onClick={() => {
                        getQueryParams(query)
                    }}
                >
                    aaaaaa    
                </Button>
            </Grid>
        </>
    )
};

interface Props {
    getQueryParams: (query : string) => void
};


export default SearchByEpidemiologyNumber;
