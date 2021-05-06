import React, { useState } from 'react';
import { Search } from '@material-ui/icons';
import { IconButton, Grid } from '@material-ui/core';

import NumericTextField from 'commons/NumericTextField/NumericTextField';

const nameLabel = 'מספר אפידמיולוגי';

const SearchByEpidemiologyNumber = (props: Props) => {
    const { getQueryParams } = props;

    const [query,setQuery] = useState<string>('');

    const triggerSearch = () => {
        getQueryParams(query)
    };

    const handleKeyDown = (e : React.KeyboardEvent) => {
        if(e.key === "Enter") {
            e.preventDefault();
            triggerSearch();
        }
    };
    return (
        <>
            <Grid xs={7}>
                <NumericTextField
                    name='searchByEpidemiologyNumber'
                    fullWidth
                    value={query}
                    onChange={(e) => {
                        setQuery(e);
                    }}
                    label={nameLabel}
                    onKeyDown={handleKeyDown}
                />
            </Grid>
            <Grid xs='auto'>
                <IconButton
                        onClick={() => {
                            getQueryParams(query)
                        }}
                >
                    <Search color='primary' />
                </IconButton>
            </Grid>
        </>
    )
};

interface Props {
    getQueryParams: (query : string) => void
};


export default SearchByEpidemiologyNumber;
